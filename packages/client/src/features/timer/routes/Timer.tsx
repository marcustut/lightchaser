import { FunctionComponent, useEffect, useState } from 'react';

import { AppLayout } from '@/components';

const digitSegments = [
  [1, 2, 3, 4, 5, 6],
  [2, 3],
  [1, 2, 7, 5, 4],
  [1, 2, 7, 3, 4],
  [6, 7, 2, 3],
  [1, 6, 7, 3, 4],
  [1, 6, 5, 4, 3, 7],
  [1, 2, 3],
  [1, 2, 3, 4, 5, 6, 7],
  [1, 2, 7, 3, 6],
];

export const Timer: FunctionComponent = () => {
  const [endDate] = useState<Date>(new Date('April 14, 2022 23:00:00'));

  useEffect(() => {
    const _hours = document.querySelectorAll('.hours');
    const _minutes = document.querySelectorAll('.minutes');
    const _seconds = document.querySelectorAll('.seconds');

    const interval = setInterval(function () {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setNumber(_hours[0], Math.floor(hours / 10));
      setNumber(_hours[1], hours % 10);

      setNumber(_minutes[0], Math.floor(minutes / 10));
      setNumber(_minutes[1], minutes % 10);

      setNumber(_seconds[0], Math.floor(seconds / 10));
      setNumber(_seconds[1], seconds % 10);
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  const setNumber = (digit: Element, number: number) => {
    const segments = digit.querySelectorAll('.segment');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const current = parseInt(digit.getAttribute('data-value'));

    // only switch if number has changed or wasn't set
    if (!isNaN(current) && current != number) {
      // unset previous number
      digitSegments[current].forEach(function (digitSegment, index) {
        setTimeout(function () {
          segments[digitSegment - 1].classList.remove('on');
        }, index * 45);
      });
    }

    if (isNaN(current) || current != number) {
      // set new number after
      setTimeout(function () {
        digitSegments[number].forEach(function (digitSegment, index) {
          setTimeout(function () {
            segments[digitSegment - 1].classList.add('on');
          }, index * 45);
        });
      }, 250);
      digit.setAttribute('data-value', `${number}`);
    }
  };

  return (
    <AppLayout
      css={{
        height: 'calc(100vh - 84px)',
      }}
    >
      <div className="clock">
        <div className="digit hours" style={{ marginRight: '-18px' }}>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
        </div>

        <div className="digit hours">
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
        </div>

        <div className="separator">
          <div className="separator"></div>
        </div>

        <div className="digit minutes" style={{ marginRight: '-18px' }}>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
        </div>

        <div className="digit minutes">
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
        </div>

        <div className="separator">
          <div className="separator"></div>
        </div>

        <div className="digit seconds" style={{ marginRight: '-18px' }}>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
        </div>

        <div className="digit seconds">
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
        </div>
      </div>
    </AppLayout>
  );
};
