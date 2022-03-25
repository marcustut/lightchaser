/**
 * Compare the equality of two input arrays using JSON.stringify().
 * @param a {Array<unknown>} first array to compare
 * @param b {Array<unknown>} second array to compare
 * @returns {boolean} whether array a and b are equals
 */
export const arrayEquals = (a: Array<unknown>, b: Array<unknown>): boolean =>
  JSON.stringify(a) === JSON.stringify(b);
