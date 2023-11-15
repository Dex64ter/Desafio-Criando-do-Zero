/* eslint-disable prettier/prettier */

export function getEstimatedTime(words: number): number {
  const wordsPerMinute = 200;
  const time = words / wordsPerMinute;
  
  return Math.ceil(time);
}