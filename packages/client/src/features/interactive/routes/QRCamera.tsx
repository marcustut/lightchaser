import QrReader from 'modern-react-qr-reader';
import { FunctionComponent, useState } from 'react';

export const QRCamera: FunctionComponent = () => {
  const [data, setData] = useState<string>('');
  const [error, setError] = useState<string>('');
  return (
    <div className="p-10">
      <QrReader
        className="rounded-full"
        delay={5000}
        onScan={(d: string) => {
          console.log(d);
          setData(d);
        }}
        onError={(e: string) => {
          console.error(e);
          setError(e);
        }}
      />
      <p className="font-lato text-xl font-bold w-full text-center">
        Data
        <br />
        {data}
      </p>
      <p className="font-lato text-lg text-yellow w-full text-center">
        Error
        <br />
        {error}
      </p>
      <p>{error}</p>
    </div>
  );
};
