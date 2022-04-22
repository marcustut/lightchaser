import { Button, Input, Loading, Spacer, useInput } from '@nextui-org/react';
import { FunctionComponent, useEffect } from 'react';
import { toast } from 'react-toastify';

import { AppLayout } from '@/components';
import { trpc } from '@/lib/trpc';

export const Timer: FunctionComponent = () => {
  const { value: globalValue, setValue: setGlobalValue } = useInput('');
  const { value: gameValue, setValue: setGameValue } = useInput('');
  const timerGlobal = trpc.useQuery(['timer.get']);
  const mutationGlobal = trpc.useMutation('timer.update');
  const timerGame = trpc.useQuery(['gametimer.get']);
  const mutationGame = trpc.useMutation('gametimer.update');

  useEffect(() => {
    if (!timerGlobal.data) return;
    if (globalValue === '') setGlobalValue(timerGlobal.data);
  }, [globalValue, setGlobalValue, timerGlobal]);

  useEffect(() => {
    if (!timerGame.data) return;
    if (gameValue === '') setGameValue(timerGame.data);
  }, [gameValue, setGameValue, timerGame]);

  const handleGlobalTimerUpdate = async () => {
    await mutationGlobal.mutateAsync(new Date(globalValue));
    if (mutationGlobal.isError) {
      toast(mutationGlobal.error.message, { type: 'error' });
      return;
    }
    await timerGlobal.refetch();
    toast('global timer is updated ✅', { type: 'success' });
  };

  const handleGameTimerUpdate = async () => {
    await mutationGame.mutateAsync(new Date(gameValue));
    if (mutationGame.isError) {
      toast(mutationGame.error.message, { type: 'error' });
      return;
    }
    await timerGame.refetch();
    toast('game timer is updated ✅', { type: 'success' });
  };

  return (
    <AppLayout
      bottomAppBarProps={{
        options: [
          {
            href: '/admin/timer',
            icon: 'heroicons-outline:clock',
            text: 'Timer (Admin)',
          },
          {
            href: '/admin/help',
            icon: 'heroicons-outline:phone-outgoing',
            text: 'Help (Admin)',
          },
        ],
      }}
      css={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 84px)',
      }}
    >
      {timerGlobal.isLoading || !timerGlobal.data ? (
        <Loading />
      ) : (
        <>
          <Input
            width="100%"
            label="🌎 Global Countdown"
            initialValue={timerGlobal.data}
            onChange={(e) => setGlobalValue(e.target.value)}
          />
          <Button
            size="sm"
            disabled={globalValue === timerGlobal.data}
            css={{ marginTop: '$6' }}
            onClick={handleGlobalTimerUpdate}
          >
            Change
          </Button>
          <Spacer y={2} />
          <Input
            width="100%"
            label="🕹 Game Countdown"
            initialValue={timerGame.data}
            onChange={(e) => setGameValue(e.target.value)}
          />
          <Button
            size="sm"
            disabled={gameValue === timerGame.data}
            css={{ marginTop: '$6' }}
            onClick={handleGameTimerUpdate}
          >
            Change
          </Button>
        </>
      )}
    </AppLayout>
  );
};
