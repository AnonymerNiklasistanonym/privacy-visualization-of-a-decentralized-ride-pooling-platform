// Package imports
import {describe, expect, test} from '@jest/globals';
// Local imports
import {
  buildGraphAdjacencyListAdvanced,
  findShortestPathAdvanced,
} from '../../../src/lib/pathfinderAdvanced';
import {
  buildGraphAdjacencyListSimple,
  findShortestPathSimple,
} from '../../../src/lib/pathfinderSimple';
import {getShortestPath} from '../../../src/lib/pathfinderOld';
import {MinPriorityQueue} from '../../../src/lib/minPriorityQueue/minPriorityQueue';
import {getPathfinderOldEdgeMapFromEdgeList, testCases} from './pathfinder';
// Type imports
import type {DefaultVertex} from '../../../src/types/pathfinderOld';

describe('Pathfinder (NEW)', () => {
  describe('findShortestPathSimple', () => {
    for (const {description, edges, expected, start, target} of testCases) {
      const graphAdjacencyList = buildGraphAdjacencyListSimple(edges);
      test(`${description} [Default/MinPriorityQueueSimple]`, () => {
        const shortestPath = findShortestPathSimple(
          graphAdjacencyList,
          start,
          target
        );
        expect(shortestPath).toStrictEqual(expected);
      });
      test(`${description} [MinPriorityQueue]`, () => {
        const shortestPath = findShortestPathSimple(
          graphAdjacencyList,
          start,
          target,
          new MinPriorityQueue()
        );
        expect(shortestPath).toStrictEqual(expected);
      });
    }
  });
  describe('findShortestPathAdvanced', () => {
    for (const {description, edges, expected, start, target} of testCases) {
      const graphAdjacencyList = buildGraphAdjacencyListAdvanced(
        edges.map(a => ({...a, data: undefined}))
      );
      test(`${description} [Default/MinPriorityQueueSimple]`, () => {
        const shortestPath = findShortestPathAdvanced(
          graphAdjacencyList,
          start,
          target
        );
        expect(shortestPath).toStrictEqual(
          expected?.map(a => [a, undefined]) ?? null
        );
      });
      test(`${description} [MinPriorityQueue]`, () => {
        const shortestPath = findShortestPathAdvanced(
          graphAdjacencyList,
          start,
          target,
          new MinPriorityQueue()
        );
        expect(shortestPath).toStrictEqual(
          expected?.map(a => [a, undefined]) ?? null
        );
      });
    }
  });
});

export const getVertexEdgeKey = (a: number, b: number) =>
  (a >= b ? [b, a] : [a, b]).join(':');

describe('Pathfinder (OLD)', () => {
  describe('getShortestPath', () => {
    for (const {description, edges, expected, start, target} of testCases) {
      const edgeMap = getPathfinderOldEdgeMapFromEdgeList(edges);
      test(`${description}`, () => {
        let result: null | Array<[number, DefaultVertex]> | null;
        try {
          result = getShortestPath(
            edgeMap,
            start.charCodeAt(0),
            target.charCodeAt(0)
          );
        } catch (err) {
          console.warn(`Warning: Error was thrown ${(err as Error).message}`);
          result = null;
        }

        // Fix result
        const fixedResult: null | Array<string> | null =
          result !== null ? result.map(a => String.fromCharCode(a[0])) : null;

        expect(fixedResult).toStrictEqual(expected);
      });
    }
  });
});
