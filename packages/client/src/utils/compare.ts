export const arrayEquals = (a: Array<unknown>, b: Array<unknown>) =>
  JSON.stringify(a) === JSON.stringify(b);
