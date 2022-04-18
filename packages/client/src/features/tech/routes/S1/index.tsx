import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTech } from '@/store/useTech';
import { toast } from '@/utils/toast';

export const S1: FunctionComponent = () => {
  const [x1, setx1] = useState<string>('');
  const [x2, setx2] = useState<string>('');
  const [x3, setx3] = useState<string>('');
  const [x4, setx4] = useState<string>('');
  const [x5, setx5] = useState<string>('');

  const navigate = useNavigate();
  const { pass } = useTech();

  return (
    <div className="flex h-screen justify-center items-center p-7">
      <div className="grid grid-cols-1 gap-2">
        <button
          onClick={() => {
            navigate('./Calculator');
          }}
          className="rounded-xl border-[6px] border-console w-[100px] h-[60px] font-lato text-2xl text-center w-full bg-console"
        >
          CGM
        </button>
        <input
          onChange={(event) => setx1(event.target.value)}
          maxLength={2}
          className="rounded-xl border-[6px] border-console w-[100px] h-[100px] font-lato text-3xl text-center w-full bg-black"
        ></input>
        <input
          onChange={(event) => setx2(event.target.value)}
          maxLength={2}
          className="rounded-xl border-[6px] border-console w-[100px] h-[100px] font-lato text-3xl text-center w-full bg-black"
        ></input>
        <input
          onChange={(event) => setx3(event.target.value)}
          maxLength={2}
          className="rounded-xl border-[6px] border-console w-[100px] h-[100px] font-lato text-3xl text-center w-full bg-black"
        ></input>
        <input
          onChange={(event) => setx4(event.target.value)}
          maxLength={2}
          className="rounded-xl border-[6px] border-console w-[100px] h-[100px] font-lato text-3xl text-center w-full bg-black"
        ></input>
        <input
          onChange={(event) => setx5(event.target.value)}
          maxLength={2}
          className="rounded-xl border-[6px] border-console w-[100px] h-[100px] font-lato text-3xl text-center w-full bg-black"
        ></input>
        <button
          onClick={() => {
            if ((x1 + x2 + x3 + x4 + x5).toUpperCase() !== 'SEVEN') {
              toast(false);
            } else {
              toast(true);
              pass(1);
              navigate('/tech');
            }
          }}
          className="rounded-xl border-[6px] border-console w-[100px] h-[100px] font-lato text-2xl text-center w-full bg-console"
        >
          Submit
        </button>
        <p className="text-gray-600 font-lato w-full text-center italic">YW = 2523</p>
      </div>
    </div>
  );
};
