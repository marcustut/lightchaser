import { Loading, Text } from '@nextui-org/react';
import { FunctionComponent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { AppLayout } from '@/components';
import { trpc } from '@/lib/trpc';
import { animatedText } from '@/utils/animation';

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
  const [endDate, setEndDate] = useState<Date>();
  trpc.useSubscription(['timer.realtime'], {
    onNext(data) {
      setEndDate(new Date(data.replace('Z', '+08:00')));
    },
    onError(err) {
      console.error(err);
      toast('A server error has occured 🥲', { type: 'error' });
    },
  });

  useEffect(() => {
    if (!endDate) return;
    if (endDate < new Date()) return;

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

  const LEDTimer = () => (
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
  );

  const renderLEDTimer = () => {
    if (!endDate) return <Loading />;
    if (endDate < new Date())
      return (
        <>
          <Text
            weight="bold"
            color="primary"
            size="xx-large"
            css={{
              background: 'linear-gradient(-45deg, $primary, $primary, #e74b3c, #e74b3c)',
              backgroundSize: '300%',
              backgroundClip: 'text',
              color: 'transparent',
              animation: `${animatedText} 10s ease-in-out infinite`,
            }}
          >
            Countdown Ended
          </Text>
        </>
      );
    return LEDTimer();
  };

  return (
    <AppLayout
      css={{
        height: 'calc(100vh - 84px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {renderLEDTimer()}
    </AppLayout>
  );
};
