import { toast as toastify } from 'react-toastify';

export const toast = (correct: boolean) => {
  toastify(correct ? 'Correct Answer!' : 'Wrong Answer.', {
    type: correct ? 'success' : 'error',
    position: 'bottom-center',
  });
};
