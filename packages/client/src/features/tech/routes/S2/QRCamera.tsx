import QrReader from 'modern-react-qr-reader';
import { FunctionComponent, useState } from 'react';

import { GameInstruction } from '@/components/GameInstruction';

export const QRCamera: FunctionComponent = () => {
  const [data, setData] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(true);

  return (
    <div className="flex flex-col justify-center items-center p-10">
      <GameInstruction
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        text={[
          '组员们需在众多 QR码 中得到相对应的价格',
          '并在界面中完整的使用你的钱购买你所找到的价格',
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
    </div>
  );
};
