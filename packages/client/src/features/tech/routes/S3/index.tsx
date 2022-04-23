import { Icon } from '@iconify/react';
import { Button } from '@nextui-org/react';
import { FunctionComponent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoadingPage } from '@/components';
import { GameInstruction } from '@/components/GameInstruction';
import { getCoords } from '@/lib/location';
import { trpc } from '@/lib/trpc';
import { useUser } from '@/store/useUser';
import { fade } from '@/utils/animation';
import { toast } from '@/utils/toast';

const ans: Record<string, { lat: number; lng: number; name: string; images: string[] }> = {
  1: {
    lat: 48.86,
    lng: 2.35,
    name: 'Paris',
    images: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9'],
  },
  2: {
    lat: 2.19,
    lng: 102.25,
    name: 'Malacca',
    images: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9'],
  },
  3: {
    lat: 25.03,
    lng: 121.57,
    name: 'Taipei',
    images: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9'],
  },
  4: {
    lat: 40.71,
    lng: -74.01,
    name: 'New York',
    images: ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n8', 'n9'],
  },
  5: {
    lat: 41.9,
    lng: 12.5,
    name: 'Rome',
    images: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9'],
  },
};

const instructions = [
  '玩家们将得到不一样的照片',
  '照片中都指向同一个城市',
  '玩家们只可以使用我们所提供的工具寻找对应的地标',
  '而那将会是你们所需要输入的答案 🔥',
];

export const S3: FunctionComponent = () => {
  const [address, setAddress] = useState<string>('');
  const [lat, setLat] = useState<string>('');
  const [lng, setLng] = useState<string>('');
  const [data, setData] = useState<Record<string, any>>();
  const [player, setPlayer] = useState<number>();
  const [modal, setModal] = useState<boolean>(true);
  const { user } = useUser();
  const team = trpc.useQuery(['team.get', { id: user?.teamId }]);
  const mutation = trpc.useMutation(['team.update']);
  trpc.useSubscription(['team.realtime'], {
    onNext(teams) {
      if (!user) return;
      const team = teams.find((t) => t.id === user.teamId);
      if (!team) return;
      if (team.tgThreeCompleted) navigate('/tech', { replace: true });
    },
    onError(err) {
      console.error(err);
    },
  });

  const navigate = useNavigate();

  const inBetweenTwoNumber = (target: number, ranges: [number, number]) =>
    target >= ranges[0] && target <= ranges[1];

  useEffect(() => {
    if (team.isFetching || !team.data || !user) return;
    if (user.identityCardNumber === team.data.leaderId) setPlayer(0);
    else
      setPlayer(
        team.data.User.filter((u) => u.identityCardNumber !== team.data?.leaderId).findIndex(
          (u) => u.identityCardNumber === user.identityCardNumber
        ) + 1
      );
  }, [navigate, team, user]);

  if (team.isFetching || !team.data || player === undefined) return <LoadingPage />;

  return player !== 0 ? (
    <div className="flex flex-col justify-center items-center h-screen w-screen p-7">
      <GameInstruction text={instructions} onClose={() => setModal(false)} open={modal} />
      <img
        alt={ans[team.data.set].images[0]}
        className="object-cover h-1/2 rounded-xl mb-5"
        src={`https://firebasestorage.googleapis.com/v0/b/light-chaser.appspot.com/o/${
          ans[team.data.set].images[player & 9]
        }.jpg?alt=media&token=278190b7-ba13-4452-a365-4d503a676db0`}
      />
      <input
        placeholder="Place Name..."
        className="font-mono text-xl bg-black px-2 py-1 border-2 rounded-xl border-console mb-5 text-center"
        onChange={(e) => setAddress(e.target.value)}
      />
      <button
        onClick={async () => setData(await getCoords(address))}
        className="border-2 border-console text-white font-mono text-xl px-3 py-2 rounded-xl"
      >
        Get Location
      </button>

      {data && data.status == 'OK' ? (
        <div className="my-5">
          <p className="font-lato text-xl">
            Lat: {data.results[0].geometry.location.lat.toFixed(2)}
          </p>
          <p className="font-lato text-xl">
            Lng: {data.results[0].geometry.location.lng.toFixed(2)}
          </p>
        </div>
      ) : null}
      <Button
        auto
        flat
        color="success"
        css={{
          position: 'fixed',
          bottom: '$8',
          right: '$8',
          animation: `${fade(
            { x: 0, y: 50, opacity: 0 },
            { x: 0, y: 0, opacity: 1 }
          )} 0.5s ease forwards`,
        }}
        onClick={() => navigate('/tech')}
      >
        <Icon icon="heroicons-outline:chevron-left" width="16" style={{ marginRight: '12px' }} />{' '}
        Back to Dashboard
      </Button>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center h-screen w-screen p-7">
      <GameInstruction text={instructions} onClose={() => setModal(false)} open={modal} />
      <input
        placeholder="Latitude..."
        className="font-mono text-2xl bg-black px-2 py-1 border-2 rounded-xl border-console mb-5 text-center"
        onChange={(e) => setLat(e.target.value)}
      />
      <input
        placeholder="Longitude..."
        className="font-mono text-2xl bg-black px-2 py-1 border-2 rounded-xl border-console mb-5 text-center"
        onChange={(e) => setLng(e.target.value)}
      />
      <button
        onClick={async () => {
          if (!team.data) return;
          if (
            inBetweenTwoNumber(parseFloat(lat), [
              ans[team.data.set].lat - 0.5,
              ans[team.data.set].lat + 0.5,
            ]) &&
            inBetweenTwoNumber(parseFloat(lng), [
              ans[team.data.set].lng - 0.5,
              ans[team.data.set].lng + 0.5,
            ])
          ) {
            toast(true);
            try {
              await mutation.mutateAsync({
                id: team.data.id,
                newPoints: team.data.points + 10,
                newTgThreeCompleted: true,
              });
            } catch (e) {
              console.error(e);
              return;
            }
            navigate('/tech');
          } else {
            toast(false);
          }
        }}
        className="border-2 border-console text-white font-mono text-xl px-3 py-2 rounded-xl"
      >
        Submit
      </button>
      <Button
        auto
        flat
        color="success"
        css={{
          position: 'fixed',
          bottom: '$8',
          right: '$8',
          animation: `${fade(
            { x: 0, y: 50, opacity: 0 },
            { x: 0, y: 0, opacity: 1 }
          )} 0.5s ease forwards`,
        }}
        onClick={() => navigate('/tech')}
      >
        <Icon icon="heroicons-outline:chevron-left" width="16" style={{ marginRight: '12px' }} />{' '}
        Back to Dashboard
      </Button>
    </div>
  );
};
