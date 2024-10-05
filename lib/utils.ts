import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const createUniqueRandomGenerator = (max: number) => {
  const numbers = Array.from({ length: max }, (_, i) => i + 1);

  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  let index = 0;

  return () => {
    if (index >= numbers.length) {
      index = 0;
    }

    return numbers[index++];
  };
};
