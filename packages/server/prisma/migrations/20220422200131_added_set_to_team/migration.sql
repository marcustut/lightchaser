-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "set" INT4 NOT NULL DEFAULT floor(random() * 5 + 1)::int;
