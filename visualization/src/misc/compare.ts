export const stringComparator = (a: string, b: string) => {
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  return x > y ? 1 : x < y ? -1 : 0;
};
