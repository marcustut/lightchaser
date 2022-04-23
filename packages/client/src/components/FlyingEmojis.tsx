/* eslint-disable jsx-a11y/media-has-caption */
import { styled } from '@nextui-org/react';
import {
  FunctionComponent,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
  createElement,
  ReactElement,
  useState,
} from 'react';

import { fadeToLeft } from '@/utils/animation';
import { getRandomNumber } from '@/utils/random';

const Div = styled('div');

const count = function* count(start = 0, step = 1) {
  while (true) {
    start += step;
    yield start;
  }
};

interface FlyingEmojiProps {
  emoji: string;
  top: number;
  rotate: number;
  onAnimationEnd: () => void;
}

const FlyingEmoji: FunctionComponent<FlyingEmojiProps> = ({
  emoji,
  top,
  rotate,
  onAnimationEnd,
}) => {
  const [opacity, setOpacity] = useState<number>(1);
  useEffect(() => {
    const timer = setTimeout(onAnimationEnd, 5000);
    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  const randomEasterEgg = () => {
    const easterEggs = [
      'africanSmile.png',
      'andyLau.png',
      'boomHead.png',
      'love.png',
      'loveDiff.png',
      'ohNo.png',
      'mlgCat.mp4',
    ];
    const index = parseInt(getRandomNumber(0, 6).toFixed(0));
    const src = easterEggs[index];
    console.log(index);
    if (src == 'mlgCat.mp4') {
      return <video src="/easterEggs/mlgCat.mp4" className="w-[300px] h-[300px]" autoPlay loop />;
    } else {
      return (
        <img src={`/easterEggs/${src}`} alt={src} className="object-cover w-[300px] h-[300px]" />
      );
    }
  };

  return (
    <Div
      css={{
        position: 'absolute',
        zIndex: '$1',
        fontSize: 'xxx-large',
        top,
        opacity,
        right: 50,
        animation: `${fadeToLeft} 5s linear`,
      }}
      onAnimationEnd={() => setOpacity(0)}
    >
      <div style={{ transform: `rotate(${rotate}deg)` }}>
        {emoji === '🔥🔥🔥' ? randomEasterEgg() : emoji}
      </div>
    </Div>
  );
};

interface FlyingEmojisProps {
  emoji?: string;
  emojis: ReactElement[];
  setEmojis: Dispatch<SetStateAction<ReactElement[]>>;
}

export const FlyingEmojis: FunctionComponent<FlyingEmojisProps> = ({
  emoji,
  emojis,
  setEmojis,
}) => {
  const counter = useRef(count()).current;
  const objectKeys = useRef(new Set()).current;

  useEffect(() => {
    if (!emoji) return;
    const key = counter.next().value;
    objectKeys.add(key);
    const flyingObject = createElement(FlyingEmoji, {
      key,
      emoji,
      top: getRandomNumber(50, 900),
      rotate: getRandomNumber(-30, 30),
      onAnimationEnd: () => objectKeys.delete(key),
    });
    setEmojis((prev) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      [...prev, flyingObject].filter((object) => objectKeys.has(parseInt(object.key)))
    );
  }, [counter, emoji, objectKeys, setEmojis]);

  return createElement('div', { style: { position: 'relative' } }, emojis);
};
