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
    transform: 'translateX(0px)',
    opacity: 1,
  },
  '50%': {
    transform: 'translateX(-1000px)',
  },
  '75%': {
    transform: 'translateX(-1500px)',
  },
  '100%': {
    transform: 'translateX(-2000px)',
    opacity: 0,
  },
});
