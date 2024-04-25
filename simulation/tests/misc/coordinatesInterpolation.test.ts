// Package imports
// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
// Local imports
import {
  getTravelTimeInMs,
  interpolateCurrentCoordinatesFromPath,
} from '../../src/misc/coordinatesInterpolation';

describe('Coordinates Interpolation', () => {
  test('getTravelTimeInMs', () => {
    const testData = [
      {
        distanceInM: 1000,
        expectedTimeInMs:
          1 /* hour */ *
          60 /* 1h=60min */ *
          60 /* 1min=60s */ *
          1000 /* 1s=1000ms */,
        speedInKmH: 1,
      },
      {
        distanceInM: 10000,
        expectedTimeInMs:
          1 /* hour */ *
          60 /* 1h=60min */ *
          60 /* 1min=60s */ *
          1000 /* 1s=1000ms */,
        speedInKmH: 10,
      },
    ];
    for (const testDataElement of testData) {
      expect(
        getTravelTimeInMs(
          testDataElement.distanceInM,
          testDataElement.speedInKmH
        )
      ).toEqual(testDataElement.expectedTimeInMs);
    }
  });
  test('interpolateCurrentCoordinatesFromPath', () => {
    const testDataList = [
      {
        expectedTravelTimeInMs: {max: 30 * 1000, min: 29 * 1000},
        path: [
          {
            lat: 48.7302435,
            long: 9.1098744,
          },
          {
            lat: 48.7298343,
            long: 9.1097454,
          },
          {
            lat: 48.7298514,
            long: 9.1124469,
          },
        ],
        speedInKmH: 30,
      },
    ];
    for (const testData of testDataList) {
      const interpolated = interpolateCurrentCoordinatesFromPath(
        testData.path,
        testData.speedInKmH
      );
      expect(interpolated.travelTimeInMs).toBeLessThan(
        testData.expectedTravelTimeInMs.max
      );
      expect(interpolated.travelTimeInMs).toBeGreaterThan(
        testData.expectedTravelTimeInMs.min
      );
      expect(interpolated.getCurrentPosition(0)).toStrictEqual(
        testData.path[0]
      );
      expect(
        interpolated.getCurrentPosition(interpolated.travelTimeInMs / 4)
      ).not.toStrictEqual(testData.path[0]);
      expect(
        interpolated.getCurrentPosition(interpolated.travelTimeInMs / 2)
      ).not.toStrictEqual(testData.path[0]);
      expect(
        interpolated.getCurrentPosition(interpolated.travelTimeInMs / 0.75)
      ).not.toStrictEqual(testData.path[0]);
      expect(
        interpolated.getCurrentPosition(interpolated.travelTimeInMs)
      ).toStrictEqual(testData.path[testData.path.length - 1]);
    }
  });
});
