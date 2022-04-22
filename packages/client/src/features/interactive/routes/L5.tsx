/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FunctionComponent, ReactElement, useState } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { toast, ToastPosition, TypeOptions } from 'react-toastify';

import { FlyingEmojis } from '@/components';
import { trpc } from '@/lib/trpc';

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
  });
  trpc.useSubscription(['presence.realtime'], {
    onNext(payload) {
      toast(`${payload} has joined the chat!`, {
        theme: 'colored',
        pauseOnFocusLoss: false,
        position: toastOrigins[randomNumber(0, 1)] as ToastPosition,
        type: toastTypes[randomNumber(0, 4)] as TypeOptions,
        icon: '🚀',
      });
    },
    onError(err) {
      console.error(err);
    },
  });

  const toastOrigins = ['bottom-left', 'top-left'];

  const randomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  return (
    <>
      <FlyingEmojis emoji={payload} emojis={payloads} setEmojis={setPayloads} />
      <div className="flex w-full h-screen">
        <div className="w-full h-screen flex flex-col items-center justify-center bg-[url('/images/grid.png')] bg-cover text-console  border-2 border-console p-10 rounded-3xl relative">
          {/* <p className="text-[6rem] font-mono mb-2">Welcome</p> */}
          <img
            src="/images/LightChaser_LogoGreen.png"
            className="z-[1] transform translate-1/2 absolute opacity-25 scale-[175%]"
            alt="logo"
          />
          <p className="text-[8rem] font-jbmono font-bold z-[2] tracking-widest">
            <Typewriter
              typeSpeed={100}
              words={['YW Light Chaser', 'Welcome']}
              deleteSpeed={150}
              // delaySpeed={100}
              loop={0}
              cursor
              cursorStyle="█"
            />
          </p>
        </div>
        {/* <div className="w-1/5 h-screen border-console border-2">XD</div> */}
      </div>
    </>
  );
};
