import { Button, Input, Loading } from '@nextui-org/react';
import { FunctionComponent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { AppLayout } from '@/components';
import { trpc } from '@/lib/trpc';

export const Timer: FunctionComponent = () => {
  const [input, setInput] = useState<string>('');
  const timer = trpc.useQuery(['timer.get']);
  const mutation = trpc.useMutation('timer.update');

  useEffect(() => {
    if (!timer.data) return;
    if (input === '') setInput(timer.data);
  }, [input, timer]);

  const handleTimerUpdate = async () => {
    await mutation.mutateAsync(new Date(input));
    if (mutation.isError) {
      toast(mutation.error.message, { type: 'error' });
      return;
    }
    await timer.refetch();
    toast('timer is updated ✅', { type: 'success' });
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
      {timer.isLoading || !timer.data ? (
        <Loading />
      ) : (
        <>
          <Input
            width="100%"
            labelPlaceholder="Countdown To"
            initialValue={timer.data}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            size="sm"
            disabled={input === timer.data}
            css={{ marginTop: '$6' }}
            onClick={handleTimerUpdate}
          >
            Change
          </Button>
        </>
      )}
    </AppLayout>
  );
};
