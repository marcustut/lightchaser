import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GameInstruction } from '@/components/GameInstruction';
import { useTech } from '@/store/useTech';
import { toast } from '@/utils/toast';

const instructions = ['每个组员都会得到一串方程式', '组长需在电话里输入方程式后的答案'];

export const S1: FunctionComponent = () => {
  const [x1, setx1] = useState<string>('');
  const [x2, setx2] = useState<string>('');
  const [x3, setx3] = useState<string>('');
  const [x4, setx4] = useState<string>('');
  const [x5, setx5] = useState<string>('');

  const [modalOpen, setOpen] = useState<boolean>(true);

  const navigate = useNavigate();
  const { pass } = useTech();

  return (
    <div className="flex h-screen justify-center items-center p-3">
      <GameInstruction text={instructions} open={modalOpen} onClose={() => setOpen(false)} />
      <div className="flex flex-col gap-2 justify-center items-center w-full h-full">
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
        {/* <p className="text-gray-600 font-lato w-full text-center italic mt-2">Hint</p> */}
        <p className="text-gray-600 font-lato w-full text-center italic mt-2">
          It&apos;s not just about numbers, maybe letters too?
        </p>
      </div>
    </div>
  );
};
