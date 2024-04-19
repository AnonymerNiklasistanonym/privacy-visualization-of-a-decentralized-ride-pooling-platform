// Package imports
// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
// Local imports
import {getShortestPath} from '../../src/pathfinder/shortestPath';
// Type imports
import type {Vertex} from '../../src/pathfinder/shortestPath';

describe('Pathfinder', () => {
  test('getShortestPath', () => {
    // 1 --10-- 4
    // |     / |
    // 2   6   2  => shortest path: 1,2,3,4 => 2 + 2 + 2 = 6
    // | /     |
    // 2 --2-- 3
    const vertex1: Vertex = {
      id: 1,
      neighbors: [2, 4],
    };
    const vertex2: Vertex = {
      id: 2,
      neighbors: [1, 3, 4],
    };
    const vertex3: Vertex = {
      id: 3,
      neighbors: [2, 4],
    };
    const vertex4: Vertex = {
      id: 4,
      neighbors: [1, 2, 3],
    };
    const vertexMap = new Map<number, Vertex>();
    vertexMap.set(vertex1.id, vertex1);
    vertexMap.set(vertex2.id, vertex2);
    vertexMap.set(vertex3.id, vertex3);
    vertexMap.set(vertex4.id, vertex4);
    const shortestPath = getShortestPath(
      {
        vertices: vertexMap,
        edges(vertexA, vertexB) {
          if (
            (vertexA === vertex4 && vertexB === vertex1) ||
            (vertexB === vertex4 && vertexA === vertex1)
          ) {
            return 10;
          }
          if (
            (vertexA === vertex2 && vertexB === vertex4) ||
            (vertexB === vertex2 && vertexA === vertex4)
          ) {
            return 6;
          }
          return 2;
        },
      },
      1,
      4
    );
    expect(shortestPath).toStrictEqual([vertex1, vertex2, vertex3, vertex4]);
  });
});
