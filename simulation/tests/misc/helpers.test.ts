// Package imports
// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
// Local imports
import {getRandomId} from '../../src/misc/helpers';

describe('Example function', () => {
  test('Returns a string', () => {
    expect(typeof getRandomId()).toBe('string');
  });
});
