/* eslint-disable @typescript-eslint/no-unused-vars */
import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GameInstruction } from '@/components/GameInstruction';
import { getCoords } from '@/lib/location';
import { useTech } from '@/store/useTech';
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
  const [set, setSet] = useState<number>(1);
  const [player, setPlayer] = useState<number>(0);

  const [modal, setModal] = useState<boolean>(true);

  const navigate = useNavigate();
  const { pass } = useTech();

  const inBetweenTwoNumber = (target: number, ranges: [number, number]) =>
    target >= ranges[0] && target <= ranges[1];

  return player !== 0 ? (
    <div className="flex flex-col justify-center items-center h-screen w-screen p-7">
      <GameInstruction text={instructions} onClose={() => setModal(false)} open={modal} />
      <img
        alt={ans[set].images[0]}
        className="object-cover h-1/2 rounded-xl mb-5"
        src={`https://firebasestorage.googleapis.com/v0/b/light-chaser.appspot.com/o/${ans[set].images[player]}.jpg?alt=media&token=278190b7-ba13-4452-a365-4d503a676db0`}
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
        onClick={() => {
          if (
            inBetweenTwoNumber(parseFloat(lat), [ans[set].lat - 0.5, ans[set].lat + 0.5]) &&
            inBetweenTwoNumber(parseFloat(lng), [ans[set].lng - 0.5, ans[set].lng + 0.5])
          ) {
            toast(true);
            pass(3);
            navigate('/tech');
          } else {
            toast(false);
          }
        }}
        className="border-2 border-console text-white font-mono text-xl px-3 py-2 rounded-xl"
      >
        Submit
      </button>
    </div>
  );
};
