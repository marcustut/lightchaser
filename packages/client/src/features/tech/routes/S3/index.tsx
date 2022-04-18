/* eslint-disable @typescript-eslint/no-unused-vars */
import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getCoords } from '@/lib/location';
import { useTech } from '@/store/useTech';

const ans: Record<string, any | number> = {
  1: {
    lat: 48.86,
    lng: 2.35,
    name: 'Paris',
  },
  2: {
    lat: 2.19,
    lng: 102.25,
    name: 'Malacca',
  },
  3: {
    lat: 25.03,
    lng: 121.57,
    name: 'Taipei',
  },
  4: {
    lat: 40.71,
    lng: -74.01,
    name: 'New York',
  },
  5: {
    lat: 41.9,
    lng: 12.5,
    name: 'Rome',
  },
};

export const S3: FunctionComponent = () => {
  const [address, setAddress] = useState<string>('');
  const [lat, setLat] = useState<string>('');
  const [lng, setLng] = useState<string>('');
  const [data, setData] = useState<Record<string, any>>();
  const [set, setSet] = useState<number>(1);
  const [player, setPlayer] = useState<number>(0);

  const navigate = useNavigate();
  const { pass } = useTech();

  const inBetweenTwoNumber = (target: number, ranges: [number, number]) =>
    target >= ranges[0] && target <= ranges[1];

  return player !== 1 ? (
    <div className="flex flex-col justify-center items-center h-screen w-screen p-7">
      <button
        onClick={() => setPlayer(1)}
        className="px-2 py-1 bg-console rounded-xl text-xl font-mono mb-5"
      >
        Change To Submission State
      </button>
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
      <button
        onClick={() => setPlayer(0)}
        className="px-2 py-1 bg-console rounded-xl text-xl font-mono mb-5"
      >
        Change To Query State
      </button>
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
            alert('Correct Answer!');
            pass(3);
            navigate('/tech');
          } else {
            alert('Wrong Answer.');
          }
        }}
        className="border-2 border-console text-white font-mono text-xl px-3 py-2 rounded-xl"
      >
        Submit
      </button>
    </div>
  );
};
