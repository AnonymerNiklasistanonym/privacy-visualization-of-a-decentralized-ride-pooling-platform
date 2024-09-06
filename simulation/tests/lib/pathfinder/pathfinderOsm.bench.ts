// Package imports
import {beforeAll, describe} from '@jest/globals';
import {benchmarkSuite} from 'jest-bench';
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
import {getShortestPathOsmCoordinates} from '../../../src/lib/pathfinderOsm';
// Type imports
import type {OsmVertex, OsmVertexGraph} from '../../../src/lib/pathfinderOsm';

// eslint-disable-next-line no-console
console.log('Warning: This takes quite a long time to execute (≈5 min)');

describe('Pathfinder (NEW) [Benchmark]', () => {
  for (const {description, location, samples} of testCases) {
    describe(`getShortestPath ${description} benchmark`, () => {
      let graph: OsmVertexGraph;
      let pairs: Array<
        | [
            [number, Omit<OsmVertex, 'neighborIds'>],
            [number, Omit<OsmVertex, 'neighborIds'>],
          ]
        | null
      >;
      beforeAll(async () => {
        fs.mkdirSync(cacheDirTests, {recursive: true});
        const locationData =
          location.type === 'city'
            ? overpassRequestBbDataCity(
                location.name,
                location.countryCode,
                cacheDirTests,
                cacheIgnoreTests
              )
            : overpassRequestBbData(location, cacheDirTests, cacheIgnoreTests);
        graph = await createOsmVertexGraph([await locationData]);
        pairs = Array.from({length: samples}, () => {
          const element = getRandomPairFromMap(graph.vertices);
          if (element === null) {
            return null;
          }
          const [[index1, vertex1], [index2, vertex2]] = element;
          return [
            [index1, {...vertex1, neighborIds: undefined}],
            [index2, {...vertex2, neighborIds: undefined}],
          ];
        });
        // eslint-disable-next-line no-console
        console.log(
          JSON.stringify({
            description,
            graph,
            pairs: pairs.map((a, index) => ({index, ...a})),
          })
        );
      });
      benchmarkSuite(`getShortestPath ${description} benchmark`, {
        ...Array.from({length: samples}, (_, i) => i + 1).reduce(
          (acc, _, index) => {
            acc[`${description}_sample#${index}_getShortestPath`] = () => {
              const pair = pairs.at(index);
              if (pair === null || pair === undefined) {
                return;
              }
              try {
                getShortestPath(graph, pair[0][0], pair[1][0]);
              } catch (err) {
                //
              }
            };
            acc[
              `${description}_sample#${index}_getShortestPathOsmCoordinates`
            ] = () => {
              const pair = pairs.at(index);
              if (pair === null || pair === undefined) {
                return;
              }
              try {
                getShortestPathOsmCoordinates(graph, pair[0][1], pair[1][1]);
              } catch (err) {
                //
              }
            };
            return acc;
          },
          {} as Record<string, () => void>
        ),
      });
    });
  }
});
