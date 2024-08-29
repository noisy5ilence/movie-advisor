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
