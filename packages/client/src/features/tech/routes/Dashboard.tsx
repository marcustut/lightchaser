import { Loading } from '@nextui-org/react';
import { FunctionComponent, useEffect, useState } from 'react';
// import { AiFillLock } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { trpc } from '@/lib/trpc';
import { useTech } from '@/store/useTech';

const tasks = [
  { task: 1, taskName: 'Task 1', to: '/tech/S1' },
  { task: 2, taskName: 'Task 2', to: '/tech/S2' },
  { task: 3, taskName: 'Task 3', to: '/tech/S3' },
];

export const TechDashboard: FunctionComponent = () => {
  const [seconds, setSeconds] = useState<number>();
  const { gameState } = useTech();
  trpc.useSubscription(['gametimer.realtime'], {
    onNext(data) {
      const seconds = Math.round(
        (new Date(data.replace('Z', '+08:00')).getTime() - new Date().getTime()) / 1000
      );
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

  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex-col p-7">
      <div className="grid-cols-3 gap-10 flex justify-center mb-7">
        {tasks.map((c, i) => (
          <TaskButton
            completion={gameState[c.task]}
            key={i}
            task={c.taskName}
            onClick={() => navigate(c.to)}
          />
        ))}
      </div>
      <div className="border-2 border-console rounded-2xl w-full h-[100px] flex items-center">
        <p className="w-full text-center font-lato font-bold text-3xl tracking-wider">
          {timeLeft() ? timeLeft() : <Loading />}
        </p>
      </div>
      {/* <div
        className={`border-2 border-disabled rounded-2xl w-full h-[100px] flex justify-center items-center mt-7`}
      >
        <AiFillLock color="#087814" size={30} />
      </div> */}
    </div>
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
