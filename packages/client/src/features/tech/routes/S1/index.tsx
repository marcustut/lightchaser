import { Icon } from '@iconify/react';
import { Button, Loading } from '@nextui-org/react';
import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { GameInstruction } from '@/components/GameInstruction';
import { trpc } from '@/lib/trpc';
import { useUser } from '@/store/useUser';
import { fade } from '@/utils/animation';

const instructions = [
  '每个组员都会得到一串方程式',
  '组长需在电话里输入方程式后的答案',
  'P/S: 答案可没有那么简单哦, 大家动动脑筋吧!',
  '😜',
];

export const S1: FunctionComponent = () => {
  const [x1, setx1] = useState<string>('');
  const [x2, setx2] = useState<string>('');
  const [x3, setx3] = useState<string>('');
  const [x4, setx4] = useState<string>('');
  const [x5, setx5] = useState<string>('');
  const [modalOpen, setOpen] = useState<boolean>(true);
  const { user } = useUser();
  const navigate = useNavigate();
  const team = trpc.useQuery(['team.get', { id: user?.teamId }]);
  const mutation = trpc.useMutation(['team.update']);

  useEffect(() => {
    if (team.isFetching || !team.data || !user) return;
    if (team.data.tgOneCompleted) {
      navigate('/tech', { replace: true });
      return;
    }
    if (team.data.leaderId !== user.identityCardNumber) {
      navigate('/tech/S1/Calculator', { replace: true });
    }
  }, [navigate, team, user]);

  if (!team.data) return <Loading />;

  return (
    <div className="flex h-screen justify-center items-center p-3">
      <GameInstruction text={instructions} open={modalOpen} onClose={() => setOpen(false)} />
      <div className="flex flex-col gap-2 justify-center items-center w-full h-full">
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
          onClick={async () => {
            if (!team.data) {
              toast('error updating team data', { type: 'error' });
              return;
            }

            if ((x1 + x2 + x3 + x4 + x5).toUpperCase() !== 'SEVEN') {
              toast(false);
            } else {
              try {
                await mutation.mutateAsync({
                  id: team.data.id,
                  newPoints: team.data.points + 10,
                  newTgOneCompleted: true,
                });
              } catch (e) {
                console.error(e);
                toast('failed to update team', { type: 'error' });
                return;
              }
              toast(true);
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
