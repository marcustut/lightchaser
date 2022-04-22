import { keyframes } from '@nextui-org/react';

export const levitating = keyframes({
  '0%': {
    transform: 'translateY(0)',
  },
  '30%': {
    transform: 'translateY(-10px)',
  },
  '50%': {
    transform: 'translateY(4px)',
  },
  '70%': {
    transform: 'translateY(-15px)',
  },
  '100%': {
    transform: 'translateY(0)',
  },
});

export const appears = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

export const fadeToLeft = keyframes({
  '0%': {
    transform: 'translateX(0px) scale(1.7)',
    opacity: 1,
  },
  '25%': {
    transform: 'translateX(-1000px) scale(1.5)',
  },
  '50%': {
    transform: 'translateX(-1750px)',
  },
  '75%': {
    transform: 'translateX(-2500px)',
  },
  '100%': {
    transform: 'translateX(-3250px) scale(1)',
    opacity: 0,
  },
});

export const animatedText = keyframes({
  '0%': { backgroundPositionX: '0px', backgroundPositionY: '50%' },
  '50%': { backgroundPositionX: '100%', backgroundPositionY: '50%' },
  '100%': { backgroundPosition: '0px', backgroundPositionY: '50%' },
});
