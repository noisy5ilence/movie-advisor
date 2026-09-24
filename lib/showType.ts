export const parseShowType = (value: string | string[] | null | undefined): Show['type'] =>
  value === 'tv' ? 'tv' : 'movie';
