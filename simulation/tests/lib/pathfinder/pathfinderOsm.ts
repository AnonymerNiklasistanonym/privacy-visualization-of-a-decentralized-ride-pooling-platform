// Package imports
import path from 'path';
// Type imports
import type {
  SimulationConfigBBox,
  SimulationConfigCity,
} from '../../../src/simulation/config/simulationConfig';

export interface TestCase {
  location: Readonly<SimulationConfigCity | SimulationConfigBBox>;
  samples: number;
  description: string;
}

export const testCases: ReadonlyArray<TestCase> = [
  {
    description: 'Small Bounding Box',
    location: {
      maxLat: 48.7,
      maxLong: 9.1,
      minLat: 48.65,
      minLong: 9.05,
      type: 'bbox',
    },
    samples: 10,
  },
  {
    description: 'Bounding Box City',
    location: {
      maxLat: 48.8663994,
      maxLong: 9.3160228,
      minLat: 48.6920188,
      minLong: 9.0386007,
      type: 'bbox',
    },
    samples: 5,
  },
  {
    description: 'City',
    location: {
      countryCode: 'DE',
      name: 'Stuttgart',
      type: 'city',
    },
    samples: 5,
  },
];

export const cacheDirTests = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'cache',
  'tests'
);

export const cacheIgnoreTests = false;

export const getRandomPairFromMap = <T>(
  map: ReadonlyMap<number, T>
): [[number, T], [number, T]] | null => {
  const keys = Array.from(map.keys());

  // Ensure we have at least two elements to choose a pair from
  if (keys.length < 2) {
    return null;
  }

  // Randomly pick the first key
  const firstKey = keys[Math.floor(Math.random() * keys.length)];

  // Filter out the first key to avoid selecting the same element twice
  const remainingKeys = keys.filter(key => key !== firstKey);

  // Randomly pick the second key from the remaining keys
  const secondKey =
    remainingKeys[Math.floor(Math.random() * remainingKeys.length)];

  // Get the corresponding values for the two keys
  const firstValue = map.get(firstKey)!;
  const secondValue = map.get(secondKey)!;

  return [
    [firstKey, firstValue],
    [secondKey, secondValue],
  ];
};
