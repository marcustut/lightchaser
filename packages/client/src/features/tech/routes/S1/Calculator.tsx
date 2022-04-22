/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GameInstruction } from '@/components/GameInstruction';

const equations: Record<number, string> = {
  1: '3+5*7-19+100/25-4*1=',
  2: '185*3/5-11+1*45-35*2=',
  3: '112+90/2-5+21-23*6+12-25=',
  4: '169-23+7*3-12*7+222/6*2-38*4=',
  5: '57/3+12*5*8+1-14*20-4*5*5*2-100/20=',
};

const instructions = [
  '每个组员都会得到一串方程式',
  '组长需在电话里输入方程式后的答案',
  'P/S: 答案可没有那么简单哦, 大家动动脑筋吧!',
  '😜',
];

export const S1Calculator: FunctionComponent = () => {
  const [seq, setSeq] = useState(1);
  const [open, setIsOpen] = useState<boolean>(true);
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen px-3 pt-7">
      <GameInstruction open={open} text={instructions} onClose={() => setIsOpen(false)} />
      <p
        onClick={() => setSeq(seq !== 5 ? seq + 1 : 1)}
        className="font-lato font-bold text-3xl text-center w-full mb-10"
      >
        {seq}
      </p>
      <div className="flex justify-center">
        <div className="grid grid-cols-5 gap-1 mb-4">
          {equations[seq].split('').map((c, i) => (
            <div
              key={i}
              className="w-[60px] h-[70px] flex justify-center items-center rounded-xl border-2 border-console"
            >
              <p className="font-lato text-lg text-center w-full">{c}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <input
          onChange={(e) => e.currentTarget.value.slice(0, 2)}
          type="number"
          className="rounded-xl border-[6px] border-console w-[100px] h-[100px] font-lato text-3xl text-center w-full bg-black"
        ></input>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 mt-2 flex justify-center items-center rounded-xl border-2 border-console"
        >
          <p className="font-lato text-lg text-center w-full">Back</p>
        </button>
      </div>
    </div>
  );
};
