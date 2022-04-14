// import { animated, useSpring } from '@react-spring/web';
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

import { getRandomNumber } from '@/utils/random';

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

  return emoji === '🔥🔥🔥' ? (
    <></>
  ) : (
    <div
      className="absolute z-10 text-6xl"
      style={{
        top,
        opacity,
        right: 50,
        animation: `emoji 5s linear`,
      }}
      onAnimationEnd={() => setOpacity(0)}
    >
      <div style={{ transform: `rotate(${rotate}deg)` }}>{emoji}</div>
    </div>
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
