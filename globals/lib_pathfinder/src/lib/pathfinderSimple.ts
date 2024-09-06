// Local imports
import {MinPriorityQueueSimple} from './minPriorityQueue/minPriorityQueueSimple';
import {MinPriorityQueue} from './minPriorityQueue/minPriorityQueue';
// Type imports
import type {
  EdgeSimple,
  GraphAdjacencyListSimple,
  MapCameFrom,
} from '../types/pathfinderSimple';

export function reconstructPathSimple<NODE_ID extends string | number>(
  cameFrom: Readonly<MapCameFrom<NODE_ID>>,
  current: NODE_ID
): Array<NODE_ID> {
  const path: Array<NODE_ID> = [current];
  while (cameFrom.has(current)) {
    current = cameFrom.get(current)!;
    path.unshift(current);
  }
  return path;
}

export function buildGraphAdjacencyListSimple<NODE_ID extends string | number>(
  edges: ReadonlyArray<EdgeSimple<NODE_ID>>
): GraphAdjacencyListSimple<NODE_ID> {
  const graph: GraphAdjacencyListSimple<NODE_ID> = new Map();

  for (const {nodeA: source, nodeB: target, weight} of edges) {
    // Add new nodes to the Map if not yet existing
    if (!graph.has(source)) {
      graph.set(source, []);
    }
    if (!graph.has(target)) {
      graph.set(target, []);
    }
    // Add edge to the Map entry (entry must exist => non null indicator)
    graph.get(source)!.push({node: target, weight});
    graph.get(target)!.push({node: source, weight});
  }

  return graph;
}

export function findShortestPathSimple<NODE_ID extends string | number>(
  graphAdjacencyList: Readonly<GraphAdjacencyListSimple<NODE_ID>>,
  source: NODE_ID,
  target: NODE_ID,
  minPriorityQueue:
    | MinPriorityQueueSimple<NODE_ID>
    | MinPriorityQueue<NODE_ID> = new MinPriorityQueueSimple<NODE_ID>()
): Array<NODE_ID> | null {
  const shortestDistance = new Map<NODE_ID, number>();
  const cameFrom: MapCameFrom<NODE_ID> = new Map();

  minPriorityQueue.enqueue(source, 0);
  shortestDistance.set(source, 0);

  while (!minPriorityQueue.isEmpty()) {
    const current = minPriorityQueue.dequeue()!;

    if (current === target) {
      return reconstructPathSimple(cameFrom, current);
    }

    for (const {node, weight} of graphAdjacencyList.get(current) || []) {
      const newDist = shortestDistance.get(current)! + weight;
      if (newDist < (shortestDistance.get(node) ?? Infinity)) {
        shortestDistance.set(node, newDist);
        minPriorityQueue.enqueue(node, newDist);
        cameFrom.set(node, current);
      }
    }
  }

  return null;
}
