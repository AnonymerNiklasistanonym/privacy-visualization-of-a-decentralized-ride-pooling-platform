// Package imports
// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
// Local imports
import {getShortestPath} from '../../src/lib/pathfinder';
// Type imports
import type {
  Vertex,
  VertexGraph,
  VertexGraphEdgesFunc,
  VertexGraphEdgesMap,
  VertexGraphVertices,
} from '../../src/lib/pathfinder';

const buildGraph = (
  edgeList: Array<{a: number; b: number; weight: number}>
): VertexGraph => {
  const createEdgeKey = (a: number, b: number) =>
    (a >= b ? [b, a] : [a, b]).join(':');
  const vertices: VertexGraphVertices = new Map();
  const edgesMap: VertexGraphEdgesMap = new Map();
  for (const inputElement of edgeList) {
    const edgeKey = createEdgeKey(inputElement.a, inputElement.b);
    edgesMap.set(edgeKey, {weight: inputElement.weight});
    for (const node of [inputElement.a, inputElement.b]) {
      const vertex = vertices.get(node);
      if (vertex !== undefined) {
        vertex.neighbors.push(
          ...[inputElement.a, inputElement.b].filter(a => a !== node)
        );
      } else {
        vertices.set(node, {
          neighbors: [inputElement.a, inputElement.b].filter(a => a !== node),
        });
      }
    }
  }
  for (const [id, vertex] of vertices) {
    vertex.neighbors = [...new Set(vertex.neighbors.filter(a => a !== id))];
  }
  const edges: VertexGraphEdgesFunc = (a, b) =>
    edgesMap.get(createEdgeKey(a[0], b[0])) ?? null;
  return {edges, vertices};
};

describe('Pathfinder', () => {
  describe('getShortestPath', () => {
    // 1 --10-- 4
    // |     /  |
    // 2   6    2  => shortest path: 1,2,3,4 => 2 + 2 + 2 = 6
    // | /      |
    // 2 ---2-- 3
    test('edge map', () => {
      const shortestPath = getShortestPath(
        buildGraph([
          {a: 1, b: 4, weight: 10},
          {a: 1, b: 2, weight: 2},
          {a: 2, b: 3, weight: 2},
          {a: 3, b: 4, weight: 2},
          {a: 2, b: 4, weight: 6},
        ]),
        1,
        4
      );
      expect(shortestPath?.map(([id]) => id)).toStrictEqual([1, 2, 3, 4]);
    });
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
          edges([vertexAId], [vertexBId]) {
            const id = -1;
            let weight = 2;
            if (
              (vertexAId === vertex4.id && vertexBId === vertex1.id) ||
              (vertexBId === vertex4.id && vertexAId === vertex1.id)
            ) {
              weight = 10;
            } else if (
              (vertexAId === vertex2.id && vertexBId === vertex4.id) ||
              (vertexBId === vertex2.id && vertexAId === vertex4.id)
            ) {
              weight = 6;
            }
            return {id, weight};
          },
          vertices,
        },
        1,
        4
      );
      expect(shortestPath?.map(([id]) => id)).toStrictEqual([1, 2, 3, 4]);
    });
  });
});
