/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FunctionComponent, useState, useEffect } from 'react';

import { getRandomNumber } from '@/utils/random';

export const Interaction: FunctionComponent = () => {
  const [degree, setDegree] = useState<number>(0);
  const [scale, setScale] = useState<number>(50);

  useEffect(() => {
    console.log('Degree: ' + degree);
    console.log('Scale: ' + scale);
    const interval = setInterval(() => {
      if (scale > 100) {
        setScale(scale - 15);
        setDegree(parseFloat(getRandomNumber(-10, 10).toFixed(2)));
      } else if (scale == 100 || scale < 100) {
        setDegree(0);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [degree, scale]);

  return (
    <div className={`h-screen w-screen overflow-hidden flex justify-center items-center`}>
      <img
        src="/images/title.png"
        alt="title"
        style={{ transform: `rotate(${degree}deg) scale(${scale}%)` }}
        onClick={() => {
          setDegree(parseFloat(getRandomNumber(-10, 10).toFixed(2)));
          setScale(scale + 5);
        }}
      />
    </div>
  );
};
