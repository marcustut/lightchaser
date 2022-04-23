import { Icon } from '@iconify/react';
import { Button } from '@nextui-org/react';
import QrReader from 'modern-react-qr-reader';
import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoadingPage } from '@/components';
import { GameInstruction } from '@/components/GameInstruction';
import { trpc } from '@/lib/trpc';
import { useUser } from '@/store/useUser';
import { fade } from '@/utils/animation';

export const QRCamera: FunctionComponent = () => {
  const [data, setData] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(true);
  const { user } = useUser();
  const navigate = useNavigate();
  const team = trpc.useQuery(['team.get', { id: user?.teamId }]);
  trpc.useSubscription(['team.realtime'], {
    onNext(teams) {
      console.log(teams);
      if (!user) return;
      const team = teams.find((t) => t.id === user.teamId);
      if (!team) return;
      if (team.tgTwoCompleted) {
        navigate('/tech', { replace: true });
      }
    },
    onError(err) {
      console.error(err);
    },
  });

  useEffect(() => {
    if (team.isFetching || !team.data || !user) return;
    if (team.data.leaderId === user.identityCardNumber) {
      navigate('/tech/S2', { replace: true });
      return;
    }
  }, [navigate, team, user]);

  if (team.isFetching || !team.data) return <LoadingPage />;

  return (
    <div className="flex flex-col justify-center items-center p-10">
      <GameInstruction
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        text={[
          '组员们需在众多 QR码\n中得到相对应的价格',
          '并在界面中完整的使用你的钱\n购买你所找到的价格',
          'P/S: 若玩家看错或写错价格, 系统将不会警告玩家, 玩家们需自行警惕 😏',
        ]}
      />
      <QrReader
        className="w-full h-full"
        delay={500}
        onScan={(d: string) => {
          console.log(d);
          if (!d) return;
          setData(d);
        }}
        onError={(e: string) => {
          console.error(e);
        }}
      />
      <div className="w-full mt-2 flex justify-center items-center rounded-xl border-2 border-console p-1">
        {data ? (
          <img
            src={`https://firebasestorage.googleapis.com/v0/b/light-chaser.appspot.com/o/${data}.png?alt=media&token=278190b7-ba13-4452-a365-4d503a676db0`}
            alt=""
          />
        ) : (
          <p className="font-chi text-2xl">请扫描 QR 码</p>
        )}
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
