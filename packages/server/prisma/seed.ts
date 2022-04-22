import { createReadStream } from 'fs';

import { PrismaClient, Gender, Satellite, Status, ShirtSize } from '@prisma/client';
import { parse } from 'csv-parse';
import { z } from 'zod';
const prisma = new PrismaClient();

// define the headers of registration.csv and group.csv here
const registration = z.object({
  name: z.string().nonempty(),
  identityCardNumber: z.string().nonempty(),
  age: z.string().nonempty(),
  gender: z.nativeEnum(Gender),
  contactNumber: z.string().nonempty(),
  satellite: z.nativeEnum(Satellite),
  cg: z.string().nonempty(),
  status: z.nativeEnum(Status),
  shirtSize: z.nativeEnum(ShirtSize),
});
const group = z.object({
  name: z.string().nonempty(),
  identityCardNumber: z.string().nonempty(),
  group: z.string().regex(/^(0|[1-9][0-9]*)$/),
  leader: z.enum(['true', 'false']),
});

async function loadCSV<T extends z.AnyZodObject>(fileName: string, schema: T) {
  type ObjectType = z.infer<T>;
  return new Promise<ObjectType[]>((resolve, reject) => {
    const registrations: ObjectType[] = [];
    createReadStream(fileName)
      .pipe(parse({ delimiter: ',', trim: true, columns: true }))
      .on('data', (data) => {
        registrations.push(schema.parse(data));
      })
      .on('end', () => {
        resolve(registrations);
      })
      .on('error', reject);
  });
}

async function main() {
  const registrations = await loadCSV('data/registration.csv', registration);
  const groups = await loadCSV('data/group.csv', group);
  const aggregated = groups.map(({ group, leader, identityCardNumber }) => {
    const reg = registrations.find((r) => r.identityCardNumber === identityCardNumber);
    if (!reg) throw new Error(`unable to find registration record for '${identityCardNumber}'`);
    return {
      ...reg,
      birthYear: new Date().getFullYear() - parseInt(reg.age),
      group: parseInt(group),
      leader: leader === 'true',
    };
  });
  const aggregatedGroups: Record<string, typeof aggregated> = {};
  aggregated.forEach((a) => {
    if (!aggregatedGroups[a.group]) aggregatedGroups[a.group] = [a];
    else aggregatedGroups[a.group].push(a);
  });

  await prisma.team.deleteMany({});
  console.log(`🗑 cleared `);
  await prisma.user.deleteMany({});

  const entries = Object.entries(aggregatedGroups);

  for (const entry of entries) {
    const groupNum = parseInt(entry[0]);
    const members = entry[1];
    const leader = members.find((m) => m.leader);
    if (!leader) throw new Error(`no leader found for team ${groupNum}`);

    const users = await prisma.user.createMany({
      data: members.map(
        ({
          identityCardNumber,
          name,
          birthYear,
          gender,
          contactNumber,
          satellite,
          cg,
          status,
          shirtSize,
        }) => ({
          identityCardNumber,
          name,
          birthYear,
          gender,
          contactNumber,
          satellite,
          cg,
          status,
          shirtSize,
        })
      ),
    });
    console.log(`✅ created ${users.count} users`);

    const team = await prisma.team.create({
      data: {
        id: groupNum,
        leaderId: leader.identityCardNumber,
      },
    });
    console.log(`✅ created team ${team.id} (${team.leaderId})`);

    for (const m of members)
      await prisma.user.update({
        where: { identityCardNumber: m.identityCardNumber },
        data: { teamId: groupNum },
      });

    console.log();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
