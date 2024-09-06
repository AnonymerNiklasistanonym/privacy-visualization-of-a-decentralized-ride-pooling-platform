// Local imports
import {MinPriorityQueueSimple} from './minPriorityQueue/minPriorityQueueSimple';
import {MinPriorityQueue} from './minPriorityQueue/minPriorityQueue';
// Type imports
import type {
  EdgeAdvanced,
  GraphAdjacencyListAdvanced,
  MapCameFromAdvanced,
} from '../types/pathfinderAdvanced';

export function reconstructPathAdvanced<
  NODE_ID extends string | number,
  EDGE_DATA,
>(
  cameFrom: MapCameFromAdvanced<NODE_ID, EDGE_DATA>,
  current: NODE_ID
): Array<[NODE_ID, EDGE_DATA | undefined]> {
  const path: Array<[NODE_ID, EDGE_DATA | undefined]> = [[current, undefined]];
  while (cameFrom.has(current)) {
    const {node, data} = cameFrom.get(current)!;
    path[0][1] = data;
    current = node;
    path.unshift([current, undefined]);
  }
  return path;
}

export function buildGraphAdjacencyListAdvanced<
  NODE_ID extends string | number,
  EDGE_DATA,
>(
  edges: ReadonlyArray<EdgeAdvanced<NODE_ID, EDGE_DATA>>
): GraphAdjacencyListAdvanced<NODE_ID, EDGE_DATA> {
  const graph: GraphAdjacencyListAdvanced<NODE_ID, EDGE_DATA> = new Map();

  for (const {nodeA: source, nodeB: target, weight, data} of edges) {
    // Add new nodes to the Map if not yet existing
    if (!graph.has(source)) {
      graph.set(source, []);
    }
    if (!graph.has(target)) {
      graph.set(target, []);
    }
    // Add edge to the Map entry (entry must exist => non null indicator)
    graph.get(source)!.push({node: target, weight, data});
    graph.get(target)!.push({node: source, weight, data});
  }

  return graph;
}

export function findShortestPathAdvanced<
  NODE_ID extends string | number,
  EDGE_DATA,
>(
  graphAdjacencyList: Readonly<GraphAdjacencyListAdvanced<NODE_ID, EDGE_DATA>>,
  source: NODE_ID,
  target: NODE_ID,
  minPriorityQueue:
    | MinPriorityQueueSimple<NODE_ID>
    | MinPriorityQueue<NODE_ID> = new MinPriorityQueueSimple<NODE_ID>()
): Array<[NODE_ID, EDGE_DATA | undefined]> | null {
  const shortestDistance = new Map<NODE_ID, number>();
  const cameFrom: MapCameFromAdvanced<NODE_ID, EDGE_DATA> = new Map();

  minPriorityQueue.enqueue(source, 0);
  shortestDistance.set(source, 0);

  while (!minPriorityQueue.isEmpty()) {
    const current = minPriorityQueue.dequeue()!;

    if (current === target) {
      return reconstructPathAdvanced(cameFrom, current);
    }

    for (const {node, weight, data} of graphAdjacencyList.get(current) || []) {
      const newDist = shortestDistance.get(current)! + weight;
      if (newDist < (shortestDistance.get(node) ?? Infinity)) {
        shortestDistance.set(node, newDist);
        minPriorityQueue.enqueue(node, newDist);
        cameFrom.set(node, {node: current, data});
      }
    }
  }

  return null;
}
