// Package imports
import {describe, test, expect} from '@jest/globals';
// Local imports
import {getRandomId} from '../../src/misc/helpers';

describe('Example function', () => {
  test('Returns a string', () => {
    expect(typeof getRandomId()).toBe('string');
  });
});
