/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FunctionComponent, useState, useEffect } from 'react';

import { getRandomNumber } from '@/utils/random';

export const Interaction: FunctionComponent = () => {
  const [degree, setDegree] = useState<number>(0);
  const [scale, setScale] = useState<number>(100);
  const [color, setColor] = useState<string>('000');

  useEffect(() => {
    console.log('Degree: ' + degree);
    console.log('Scale: ' + scale);
    console.log('Color: ' + color);
    const interval = setInterval(() => {
      if (scale > 100 && scale < 130) {
        setScale(scale - 15);
        setDegree(parseFloat(getRandomNumber(-20, 20).toFixed(2)));
      } else if (scale == 100 || scale < 100) {
        setDegree(0);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [color, degree, scale]);

  return (
    <div
      className={`h-screen w-screen overflow-hidden flex justify-center items-center transition`}
      style={{ backgroundColor: `#${color}` }}
    >
      <img
        src="/images/title.png"
        alt="title"
        className="transition-transform w-[70%] h-[70%] md:w-[40%] md:h-[40%] object-contain"
        style={{ transform: `rotate(${degree}deg) scale(${scale}%)` }}
        onClick={() => {
          setDegree(parseFloat(getRandomNumber(-20, 20).toFixed(2)));
          scale > 130 ? setScale(130) : setScale(scale + 5);
          scale == 130 ? setColor((Math.random().toString(16) + '000000').substring(2, 8)) : null;
        }}
      />
    </div>
  );
};
