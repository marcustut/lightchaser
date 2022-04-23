/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Icon } from '@iconify/react';
import { Button } from '@nextui-org/react';
import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoadingPage } from '@/components';
import { GameInstruction } from '@/components/GameInstruction';
import { trpc } from '@/lib/trpc';
import { useUser } from '@/store/useUser';
import { fade } from '@/utils/animation';

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
  const [open, setIsOpen] = useState<boolean>(true);
  const [seq, setSeq] = useState<number>();
  const navigate = useNavigate();
  const { user } = useUser();
  const team = trpc.useQuery(['team.get', { id: user?.teamId }]);
  trpc.useSubscription(['team.realtime'], {
    onNext(teams) {
      if (!user) return;
      const team = teams.find((t) => t.id === user.teamId);
      if (!team) return;
      if (team.tgOneCompleted) navigate('/tech', { replace: true });
    },
    onError(err) {
      console.error(err);
    },
  });

  useEffect(() => {
    if (team.isFetching || !team.data || !user) return;
    if (team.data.leaderId === user.identityCardNumber) {
      navigate('/tech/S1', { replace: true });
      return;
    }
    setSeq(
      team.data.User.filter((u) => u.identityCardNumber !== team.data?.leaderId).findIndex(
        (u) => u.identityCardNumber === user.identityCardNumber
      ) + 1
    );
  }, [navigate, team, user]);

  if (team.isFetching || !team.data || !seq) return <LoadingPage />;

  return (
    <div className="w-screen h-screen px-3 pt-7">
      <GameInstruction open={open} text={instructions} onClose={() => setIsOpen(false)} />
      <p
        // onClick={() => setSeq(seq !== 5 ? seq + 1 : 1)}
        className="font-lato font-bold text-3xl text-center w-full mb-10"
      >
        {seq % 5}
      </p>
      <div className="flex justify-center">
        <div className="grid grid-cols-5 gap-1 mb-4">
          {equations[seq % 5].split('').map((c, i) => (
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
          className="rounded-xl border-[6px] border-console h-[100px] font-lato text-3xl text-center w-full bg-black"
        />
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 mt-2 flex justify-center items-center rounded-xl border-2 border-console"
        >
          <p className="font-lato text-lg text-center w-full">Back</p>
        </button>
      </div>
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
