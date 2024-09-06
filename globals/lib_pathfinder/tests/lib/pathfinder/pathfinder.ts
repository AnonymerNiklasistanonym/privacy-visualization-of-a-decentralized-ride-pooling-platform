// Local imports
import {getVertexEdgeKey} from '../../../src/lib/pathfinderOld';
// Type imports
import type {
  DefaultVertex,
  DefaultVertexEdge,
} from '../../../src/types/pathfinderOld';

export type TestNodeId = string;

export interface TestEdge<TEST_NODE_ID = TestNodeId> {
  nodeA: TEST_NODE_ID;
  nodeB: TEST_NODE_ID;
  weight: number;
}

export interface TestCase<TEST_NODE_ID = TestNodeId, TEST_EDGE = TestEdge> {
  edges: ReadonlyArray<TEST_EDGE>;
  start: TEST_NODE_ID;
  target: TEST_NODE_ID;
  expected: null | ReadonlyArray<TEST_NODE_ID>;
  description: string;
}

export const testCases: ReadonlyArray<TestCase> = [
  {
    description: 'Simple straight line graph',
    edges: [
      {nodeA: 'A', nodeB: 'B', weight: 1},
      {nodeA: 'A', nodeB: 'C', weight: 3},
      {nodeA: 'B', nodeB: 'C', weight: 1},
      {nodeA: 'B', nodeB: 'D', weight: 4},
      {nodeA: 'C', nodeB: 'D', weight: 1},
    ],
    start: 'A',
    target: 'D',
    expected: ['A', 'B', 'C', 'D'],
  },
  {
    description: 'No path exists between start and target',
    edges: [
      {nodeA: 'A', nodeB: 'B', weight: 1},
      {nodeA: 'B', nodeB: 'C', weight: 1},
      {nodeA: 'D', nodeB: 'E', weight: 1},
    ],
    start: 'A',
    target: 'E',
    expected: null,
  },
  {
    description: 'Start and target are the same node',
    edges: [
      {nodeA: 'A', nodeB: 'B', weight: 1},
      {nodeA: 'B', nodeB: 'A', weight: 1},
    ],
    start: 'A',
    target: 'A',
    expected: ['A'],
  },
  {
    description: 'Single step path between neighboring nodes',
    edges: [{nodeA: 'A', nodeB: 'B', weight: 1}],
    start: 'A',
    target: 'B',
    expected: ['A', 'B'],
  },
  {
    description: 'Find shortest path in a complex graph',
    edges: [
      {nodeA: 'A', nodeB: 'B', weight: 2},
      {nodeA: 'A', nodeB: 'C', weight: 5},
      {nodeA: 'B', nodeB: 'D', weight: 3},
      {nodeA: 'B', nodeB: 'E', weight: 1},
      {nodeA: 'C', nodeB: 'F', weight: 2},
      {nodeA: 'D', nodeB: 'E', weight: 1},
      {nodeA: 'E', nodeB: 'F', weight: 2},
    ],
    start: 'A',
    target: 'F',
    expected: ['A', 'B', 'E', 'F'],
  },
  {
    description: 'Graph with loops',
    edges: [
      {nodeA: 'A', nodeB: 'B', weight: 2},
      {nodeA: 'B', nodeB: 'C', weight: 3},
      {nodeA: 'C', nodeB: 'A', weight: 1},
      {nodeA: 'C', nodeB: 'D', weight: 1},
    ],
    start: 'A',
    target: 'D',
    expected: ['A', 'C', 'D'],
  },
  {
    description: 'Unreachable target node',
    edges: [
      {nodeA: 'A', nodeB: 'B', weight: 1},
      {nodeA: 'B', nodeB: 'C', weight: 2},
      {nodeA: 'C', nodeB: 'D', weight: 3},
      {nodeA: 'E', nodeB: 'F', weight: 1},
    ],
    start: 'A',
    target: 'F',
    expected: null,
  },
  {
    description: 'Heuristic favors non-optimal path',
    edges: [
      {nodeA: 'A', nodeB: 'B', weight: 1},
      {nodeA: 'A', nodeB: 'C', weight: 4},
      {nodeA: 'B', nodeB: 'D', weight: 1},
      {nodeA: 'C', nodeB: 'D', weight: 1},
    ],
    start: 'A',
    target: 'D',
    expected: ['A', 'B', 'D'],
  },
  {
    description: 'Large graph with many nodes and paths',
    edges: [
      {nodeA: 'A', nodeB: 'B', weight: 1},
      {nodeA: 'A', nodeB: 'C', weight: 5},
      {nodeA: 'A', nodeB: 'D', weight: 10},
      {nodeA: 'B', nodeB: 'E', weight: 2},
      {nodeA: 'B', nodeB: 'F', weight: 3},
      {nodeA: 'C', nodeB: 'G', weight: 2},
      {nodeA: 'D', nodeB: 'H', weight: 1},
      {nodeA: 'E', nodeB: 'I', weight: 1},
      {nodeA: 'F', nodeB: 'J', weight: 1},
      {nodeA: 'G', nodeB: 'I', weight: 3},
      {nodeA: 'H', nodeB: 'J', weight: 4},
      {nodeA: 'I', nodeB: 'J', weight: 2},
    ],
    start: 'A',
    target: 'J',
    expected: ['A', 'B', 'F', 'J'],
  },
  {
    description: 'Empty graph (no nodes)',
    edges: [],
    start: 'A',
    target: 'B',
    expected: null,
  },
];

export const getPathfinderOldEdgeMapFromEdgeList = (
  edges: ReadonlyArray<TestEdge>
) => {
  return {
    edges: edges.reduce((edgeMap, {nodeA, nodeB, weight}) => {
      const edgeKey = getVertexEdgeKey(
        nodeA.charCodeAt(0),
        nodeB.charCodeAt(0)
      );
      if (!edgeMap.has(edgeKey)) {
        edgeMap.set(edgeKey, {weight});
      }
      return edgeMap;
    }, new Map<string, DefaultVertexEdge>()),
    vertices: edges.reduce((vertexMap, {nodeA, nodeB}) => {
      if (!vertexMap.has(nodeA.charCodeAt(0))) {
        vertexMap.set(nodeA.charCodeAt(0), {neighborIds: []});
      }
      if (!vertexMap.has(nodeB.charCodeAt(0))) {
        vertexMap.set(nodeB.charCodeAt(0), {neighborIds: []});
      }
      vertexMap.get(nodeA.charCodeAt(0))!.neighborIds.push(nodeB.charCodeAt(0));
      vertexMap.get(nodeB.charCodeAt(0))!.neighborIds.push(nodeA.charCodeAt(0));
      return vertexMap;
    }, new Map<number, DefaultVertex>()),
  };
};
