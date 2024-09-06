// Package imports
import {benchmarkSuite} from 'jest-bench';
import {describe} from '@jest/globals';
// Local imports
import {getPathfinderOldEdgeMapFromEdgeList, testCases} from './pathfinder';
import {
  buildGraphAdjacencyListSimple,
  findShortestPathSimple,
} from '../../../src/lib/pathfinderSimple';
import {MinPriorityQueue} from '../../../src/lib/minPriorityQueue/minPriorityQueue';
import {
  buildGraphAdjacencyListAdvanced,
  findShortestPathAdvanced,
} from '../../../src/lib/pathfinderAdvanced';
import {getShortestPath} from '../../../src/lib/pathfinderOld';

console.log('Warning: This takes quite a long time to execute (≈5 min)');

describe('Pathfinder (NEW) [Benchmark]', () => {
  benchmarkSuite('findShortestPathSimple ', {
    //setup() {
    //  // setup data before test run
    //},
    //teardown() {
    //  // clear data after test run
    //},
    ...testCases.reduce(
      (acc, {description, edges, start, target}) => {
        const graphAdjacencyList = buildGraphAdjacencyListSimple(edges);
        acc[`${description} [Default/MinPriorityQueueSimple]`] = () => {
          findShortestPathSimple(graphAdjacencyList, start, target);
        };
        acc[`${description} [MinPriorityQueue]`] = () => {
          findShortestPathSimple(
            graphAdjacencyList,
            start,
            target,
            new MinPriorityQueue()
          );
        };
        return acc;
      },
      {} as Record<string, () => void>
    ),
  });
  benchmarkSuite('findShortestPathAdvanced ', {
    //setup() {
    //  // setup data before test run
    //},
    //teardown() {
    //  // clear data after test run
    //},
    ...testCases.reduce(
      (acc, {description, edges, start, target}) => {
        const graphAdjacencyList = buildGraphAdjacencyListAdvanced(
          edges.map(a => ({...a, data: undefined}))
        );
        acc[`${description} [Default/MinPriorityQueueSimple]`] = () => {
          findShortestPathAdvanced(graphAdjacencyList, start, target);
        };
        acc[`${description} [MinPriorityQueue]`] = () => {
          findShortestPathAdvanced(
            graphAdjacencyList,
            start,
            target,
            new MinPriorityQueue()
          );
        };
        return acc;
      },
      {} as Record<string, () => void>
    ),
  });
});

describe('Pathfinder (OLD) [Benchmark]', () => {
  benchmarkSuite('getShortestPath ', {
    //setup() {
    //  // setup data before test run
    //},
    //teardown() {
    //  // clear data after test run
    //},
    ...testCases.reduce(
      (acc, {description, edges, start, target}) => {
        const edgeMap = getPathfinderOldEdgeMapFromEdgeList(edges);
        acc[`${description}`] = () => {
          try {
            getShortestPath(edgeMap, start.charCodeAt(0), target.charCodeAt(0));
          } catch (err) {
            /* empty */
          }
        };
        return acc;
      },
      {} as Record<string, () => void>
    ),
  });
});
