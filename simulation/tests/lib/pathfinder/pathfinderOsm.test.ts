// Package imports
import {describe, expect, test} from '@jest/globals';
import fs from 'fs';
// Local imports
import {
  cacheDirTests,
  cacheIgnoreTests,
  getRandomPairFromMap,
  testCases,
} from './pathfinderOsm';
import {
  overpassRequestBbData,
  overpassRequestBbDataCity,
} from '../../../src/simulation/config/overpass';
import {createOsmVertexGraph} from '../../../src/simulation/config/createOsmVertexGraph';
import {getShortestPath} from 'lib_pathfinder';
// Type imports
import type {OsmVertex} from '../../../src/lib/pathfinderOsm';

describe('Pathfinder OSM (OLD)', () => {
  describe('getShortestPath', () => {
    fs.mkdirSync(cacheDirTests, {recursive: true});
    for (const {description, location, samples} of testCases) {
      const locationData =
        location.type === 'city'
          ? overpassRequestBbDataCity(
              location.name,
              location.countryCode,
              cacheDirTests,
              cacheIgnoreTests
            )
          : overpassRequestBbData(location, cacheDirTests, cacheIgnoreTests);
      const graphPromise = locationData.then(a => createOsmVertexGraph([a]));
      test(
        `${description}`,
        async () => {
          const graph = await graphPromise;
          for (let i = 0; i < samples; i++) {
            const pair = getRandomPairFromMap(graph.vertices);
            if (pair === null) {
              continue;
            }
            let result: null | Array<[number, OsmVertex]> | null;
            try {
              result = getShortestPath(graph, pair[0][0], pair[1][0]);
            } catch (err) {
              result = null;
            }
            expect(result).toBeDefined();
          }
        },
        20 * 60 * 1000
      );
    }
  });
});
