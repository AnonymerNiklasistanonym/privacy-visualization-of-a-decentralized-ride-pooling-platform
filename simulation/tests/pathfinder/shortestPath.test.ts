// Package imports
// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
// Local imports
import {getShortestPath} from '../../src/pathfinder/shortestPath';
// Type imports
import type {Vertex, VertexEdge} from '../../src/pathfinder/shortestPath';

describe('Pathfinder', () => {
  describe('getShortestPath', () => {
    // 1 --10-- 4
    // |     /  |
    // 2   6    2  => shortest path: 1,2,3,4 => 2 + 2 + 2 = 6
    // | /      |
    // 2 ---2-- 3
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
    const vertices = new Map<number, Vertex>();
    vertices.set(vertex1.id, vertex1);
    vertices.set(vertex2.id, vertex2);
    vertices.set(vertex3.id, vertex3);
    vertices.set(vertex4.id, vertex4);
    test('edge function', () => {
      const shortestPath = getShortestPath(
        {
          vertices,
          edges(vertexA, vertexB) {
            const id = -1;
            let weight = 2;
            if (
              (vertexA === vertex4 && vertexB === vertex1) ||
              (vertexB === vertex4 && vertexA === vertex1)
            ) {
              weight = 10;
            } else if (
              (vertexA === vertex2 && vertexB === vertex4) ||
              (vertexB === vertex2 && vertexA === vertex4)
            ) {
              weight = 6;
            }
            return {id, weight};
          },
        },
        1,
        4
      );
      expect(shortestPath).toStrictEqual([vertex1, vertex2, vertex3, vertex4]);
    });
    test('edge maps', () => {
      const idMap = new Map<number, Map<number, number>>();
      idMap.set(
        1,
        new Map([
          [2, 1],
          [4, 5],
        ])
      );
      idMap.set(
        2,
        new Map([
          [3, 2],
          [4, 4],
        ])
      );
      idMap.set(3, new Map([[4, 3]]));
      const vertexEdgeIdMap = new Map<number, VertexEdge>();
      vertexEdgeIdMap.set(1, {id: 1, weight: 2});
      vertexEdgeIdMap.set(2, {id: 2, weight: 2});
      vertexEdgeIdMap.set(3, {id: 3, weight: 2});
      vertexEdgeIdMap.set(4, {id: 4, weight: 6});
      vertexEdgeIdMap.set(5, {id: 5, weight: 10});
      const shortestPath = getShortestPath(
        {
          vertices,
          edges: {idMap, vertexEdgeIdMap},
        },
        1,
        4
      );
      expect(shortestPath).toStrictEqual([vertex1, vertex2, vertex3, vertex4]);
    });
  });
});
