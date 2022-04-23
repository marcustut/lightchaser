import { Icon } from '@iconify/react';
import { Button, Loading, Text } from '@nextui-org/react';
import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { LoadingPage } from '@/components';
import { trpc } from '@/lib/trpc';
import { useUser } from '@/store/useUser';
import { fade } from '@/utils/animation';

const tasks = [
  { task: 1, taskName: 'Task 1', to: '/tech/S1' },
  { task: 2, taskName: 'Task 2', to: '/tech/S2' },
  { task: 3, taskName: 'Task 3', to: '/tech/S3' },
];

const ONE_HOUR = 3600;

export const TechDashboard: FunctionComponent = () => {
  const [seconds, setSeconds] = useState<number>();
  const [disabled, setDisabled] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();
  const team = trpc.useQuery(['team.get', { id: user?.teamId }]);
  trpc.useSubscription(['gametimer.realtime'], {
    onNext(data) {
      const seconds = Math.round(
        (new Date(data.replace('Z', '+08:00')).getTime() - new Date().getTime()) / 1000
      );
      if (seconds < ONE_HOUR) setDisabled(false);
      else setDisabled(true);
      setSeconds(seconds);
    },
    onError(err) {
      console.error(err);
      toast('A server error has occured 🥲', { type: 'error' });
    },
  });

  useEffect(() => {
    if (!seconds) return;
    const interval = setInterval(() => {
      setSeconds(seconds != 0 ? seconds - 1 : seconds);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const timeLeft = () => {
    if (!seconds) return;
    const splittedMin = (seconds / 60).toString().split('.')[0];
    const splittedSec = seconds - parseInt(splittedMin) * 60;

    return `${splittedMin}:${
      splittedSec < 10 ? '0' + splittedSec.toString() : splittedSec.toString()
    }`;
  };

  if (!team.data) return <LoadingPage />;

  return (
    <>
      {disabled && (
        <div
          style={{
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loading type="points" color="error" css={{ w: '100%' }} />
          <Text color="error" css={{ marginTop: '$8', letterSpacing: '$wide' }}>
            Infinity City is not open yet
          </Text>
        </div>
      )}
      <div
        className="w-screen h-screen flex-col p-7"
        style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}
      >
        <div className="grid-cols-3 gap-10 flex justify-center mb-7">
          {tasks.map((c, i) =>
            !team.data ? (
              <Loading />
            ) : (
              <TaskButton
                completion={
                  c.task === 1
                    ? team.data.tgOneCompleted
                    : c.task === 2
                    ? team.data.tgTwoCompleted
                    : team.data.tgThreeCompleted
                }
                key={i}
                task={c.taskName}
                onClick={() => navigate(c.to)}
              />
            )
          )}
        </div>
        <div className="border-2 border-console rounded-2xl w-full h-[100px] flex items-center">
          <p className="w-full text-center font-lato font-bold text-3xl tracking-wider">
            {timeLeft() ? timeLeft() : <Loading />}
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
          onClick={() =>
            window.open(
              `https://wa.me/+60172412866?text=${encodeURI(
                `*Infinity City*\nIssue: (Task 1, 2, 3, Login etc.)\nDescription: Lorem Ipsum ..`
              )}`
            )
          }
        >
          <Icon
            icon="heroicons-outline:phone-outgoing"
            width="16"
            style={{ marginRight: '12px' }}
          />{' '}
          Tech Support
        </Button>
        {/* <div
        className={`border-2 border-disabled rounded-2xl w-full h-[100px] flex justify-center items-center mt-7`}
      >
        <AiFillLock color="#087814" size={30} />
      </div> */}
      </div>
    </>
  );
};

interface TaskButtonProps {
  completion: boolean;
  task: string;
  onClick: () => void;
}

const TaskButton: FunctionComponent<TaskButtonProps> = ({ completion, task, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={completion}
      className="flex-col items-center border-console border-2 rounded-2xl w-full py-2 justify-center disabled:border-disabled"
    >
      <div className="text-console text-center h-[40px] mt-2 text-xl">{task}</div>
      <div className="text-center">{completion ? '✔️' : '❌'}</div>
    </button>
  );
};
