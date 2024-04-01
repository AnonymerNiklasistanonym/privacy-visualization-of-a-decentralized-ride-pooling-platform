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

export const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const distanceInKmBetweenEarthCoordinates = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  // https://stackoverflow.com/a/365853
  const earthRadiusKm = 6371;

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};
