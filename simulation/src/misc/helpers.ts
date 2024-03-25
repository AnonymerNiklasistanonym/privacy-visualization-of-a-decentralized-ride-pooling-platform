export const getRandomId = (): string => Math.random().toString(36).slice(2);

export const getRandomElement = <TYPE>(array: ReadonlyArray<TYPE>): TYPE => {
  if (array.length === 0) {
    throw Error("Can't get random element because array has a length of 0!");
  }
  return array[Math.floor(Math.random() * array.length)];
};

export const getRandomIntFromInterval = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const getRandomFloatFromInterval = (min: number, max: number): number =>
  Math.random() * (max - min) + min;
