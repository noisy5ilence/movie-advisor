import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mapFilters = (filters: Record<string, string>) => {
  try {
    return Object.entries(filters).reduce((filters, [key, value]) => {
      filters[key as keyof Filters] = value.split(',');
      return filters;
    }, {} as Partial<Filters>);
  } catch (e) {
    return {};
  }
};

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
