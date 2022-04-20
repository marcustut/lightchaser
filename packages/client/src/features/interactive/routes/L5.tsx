import { FunctionComponent, ReactElement, useState } from 'react';

import { FlyingEmojis } from '@/components';
import { trpc } from '@/lib/trpc';

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

  return (
    <>
      <FlyingEmojis emoji={payload} emojis={payloads} setEmojis={setPayloads} />
      <div className="flex w-full h-screen">
        <div className="w-full h-screen bg-[url('/images/grid.png')] bg-cover text-console font-mono border-2 border-console p-10 rounded-3xl relative">
          <p className="text-[6rem] mb-10">Welcome to YW Light Chaser 🚀✨</p>
        </div>
        {/* <div className="w-1/5 h-screen border-console border-2">XD</div> */}
      </div>
    </>
  );
};
