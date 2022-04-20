/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FunctionComponent, ReactElement, useState } from 'react';
import { toast, ToastPosition, TypeOptions } from 'react-toastify';

import { FlyingEmojis } from '@/components';
import { trpc } from '@/lib/trpc';

const fakeUsers = ['Adam', 'Eve', 'Cain', 'Abel'];
const toastTypes = ['default', 'error', 'info', 'warning', 'success'];

export const L5Screen: FunctionComponent = () => {
  const [payload, setPayload] = useState<string>();
  const [payloads, setPayloads] = useState<ReactElement[]>([]);
  trpc.useSubscription(['onEmoji'], {
    onNext(payload) {
      setPayload(payload);
    },
    onError(err) {
      console.error(err);
    },
    enabled: true,
  });

  const toastOrigins = [
    'bottom-center',
    'bottom-left',
    'bottom-right',
    'top-center',
    'top-left',
    'top-right',
  ];

  const randomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  return (
    <>
      <FlyingEmojis emoji={payload} emojis={payloads} setEmojis={setPayloads} />
      <div
        className="flex w-full h-screen"
        onClick={() =>
          toast(`${fakeUsers[randomNumber(1, 4)]}  has joined the chat!}`, {
            position: toastOrigins[randomNumber(1, 6)] as ToastPosition,
            type: toastTypes[randomNumber(1, 5)] as TypeOptions,
          })
        }
      >
        <div className="w-full relative h-screen flex flex-col items-center justify-center bg-[url('/images/grid.png')] bg-cover text-console  border-2 border-console p-10 rounded-3xl relative">
          {/* <p className="text-[6rem] font-mono mb-2">Welcome</p> */}
          <img
            src="/images/LightChaser_LogoGreen.png"
            className="z-[1] transform translate-1/2 absolute opacity-25 scale-[175%]"
            alt="logo"
          />
          <p className="text-[8rem] font-montserrat font-black italic z-[2] tracking-widest">
            YW Light Chaser 🚀✨
          </p>
        </div>
        {/* <div className="w-1/5 h-screen border-console border-2">XD</div> */}
      </div>
    </>
  );
};
