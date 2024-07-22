// Package imports
// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
// Local imports
import {getShortestPath} from '../../src/lib/pathfinder';
import {testCases} from './pathfinder';
// Type imports
import type {
  DefaultVertex,
  DefaultVertexEdge,
  VertexEdgeId,
  VertexGraph,
  VertexId,
} from '../../src/lib/pathfinder';

const buildGraph = (
  edgeList: Array<{a: number; b: number; weight: number}>
): VertexGraph => {
  const createEdgeKey = (a: number, b: number) =>
    (a >= b ? [b, a] : [a, b]).join(':');
  const vertices: Map<VertexId, DefaultVertex> = new Map();
  const edges: Map<VertexEdgeId, DefaultVertexEdge> = new Map();
  for (const inputElement of edgeList) {
    const edgeKey = createEdgeKey(inputElement.a, inputElement.b);
    edges.set(edgeKey, {weight: inputElement.weight});
    for (const node of [inputElement.a, inputElement.b]) {
      const vertex = vertices.get(node);
      if (vertex !== undefined) {
        vertex.neighborIds.push(
          ...[inputElement.a, inputElement.b].filter(a => a !== node)
        );
      } else {
        vertices.set(node, {
          neighborIds: [inputElement.a, inputElement.b].filter(a => a !== node),
        });
      }
    }
  }
  for (const [id, vertex] of vertices) {
    vertex.neighborIds = [...new Set(vertex.neighborIds.filter(a => a !== id))];
  }
  return {edges, vertices};
};

describe('Pathfinder', () => {
  for (const testCase of testCases) {
    for (const testCaseGoal of testCase.goals) {
      const name = `${testCase.name} (start: ${testCaseGoal.start}, end: ${testCaseGoal.end})`;
      describe(`getShortestPath ${name}`, () => {
        test('edge map', () => {
          const shortestPath = getShortestPath(
            buildGraph(testCase.edges),
            testCaseGoal.start,
            testCaseGoal.end
          );
          expect(shortestPath?.map(([id]) => id)).toStrictEqual(
            testCaseGoal.expected
          );
        });
      });
    }
  }
});
