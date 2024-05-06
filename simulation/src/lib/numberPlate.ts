// Based on: https://github.com/unicodeveloper/plate-number

import {getRandomElement, getRandomIntFromInterval} from '../misc/helpers';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const generateRandomNumberPlate = (locations: ReadonlyArray<string>) => {
  return (
    getRandomElement(locations) +
    ' ' +
    getRandomElement(alphabet) +
    getRandomElement(alphabet) +
    ' ' +
    getRandomIntFromInterval(1000, 9999)
  );
};
