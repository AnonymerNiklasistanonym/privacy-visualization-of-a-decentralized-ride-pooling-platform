// Package imports
import {MinPriorityQueue} from '@datastructures-js/priority-queue';
// Local imports
import {loggerPathfinder} from '../services/logging';

const logger = loggerPathfinder;

export type VertexId = number;
export type VertexEdgeId = string;

/** Represents a vertex in the graph */
export interface Vertex {
  /** Unique vertex ID for indexing it */
  id: VertexId;
  /** Neighbor vertex IDs of all vertices that are connected to this vertex */
  neighborIds: VertexId[];
}

/** Represents internal information of a vertex in the graph */
export interface VertexInternal {
  /** The closest neighbor vertex (for reconstructing the path) */
  shortestDistanceNeighbor?: VertexId;
  /** The cost function $g$ (shortest distance from start vertex to this vertex) */
  shortestDistanceG: number;
}

/** Represents a edge that connects 2 vertices in the graph */
export interface VertexEdge {
  /** Unique vertex ID for indexing it */
  id: VertexId;
  /** The weight */
  weight: number;
}

export type DefaultVertex = Omit<Vertex, 'id'>;
export type DefaultVertexEdge = Omit<VertexEdge, 'id'>;

export type VertexGraphVertices<VERTEX extends DefaultVertex = DefaultVertex> =
  ReadonlyMap<VertexId, VERTEX>;
export type VertexGraphEdges<
  EDGE extends DefaultVertexEdge = DefaultVertexEdge,
> = ReadonlyMap<VertexEdgeId, EDGE>;

/** Represents a graph consisting of edges and vertices */
export interface VertexGraph<
  VERTEX extends DefaultVertex = DefaultVertex,
  EDGE extends DefaultVertexEdge = DefaultVertexEdge,
> {
  /** The vertices of the graph */
  vertices: VertexGraphVertices<VERTEX>;
  /** The edges of the graph */
  edges: VertexGraphEdges<EDGE>;
}

/** Represents a tuple of a vertex Id and vertex information. */
export type VertexIdPair<VERTEX extends DefaultVertex = DefaultVertex> = [
  VertexId,
  Readonly<VERTEX>,
];

/** Represents a tuple of a vertex Id and vertex information. */
export type VertexEdgeIdPair<
  EDGE extends DefaultVertexEdge = DefaultVertexEdge,
> = [VertexEdgeId, Readonly<EDGE>];

export const getVertexFromGraph = <
  VERTEX extends DefaultVertex = DefaultVertex,
  EDGE extends DefaultVertexEdge = DefaultVertexEdge,
>(
  graph: Readonly<VertexGraph<VERTEX, EDGE>>,
  id: VertexId,
  name?: string
): VertexIdPair<VERTEX> => {
  const vertex = graph.vertices.get(id);
  if (vertex) {
    return [id, vertex];
  }
  throw Error(`Vertex ${id}${name ? ` (${name})` : ''} was not found in graph`);
};

export const getVertexEdgeFromGraph = <
  VERTEX extends DefaultVertex = DefaultVertex,
  EDGE extends DefaultVertexEdge = DefaultVertexEdge,
>(
  graph: Readonly<VertexGraph<VERTEX, EDGE>>,
  id: VertexEdgeId,
  name?: string
): VertexEdgeIdPair<EDGE> => {
  const edge = graph.edges.get(id);
  if (edge) {
    return [id, edge];
  }
  throw Error(
    `Vertex edge ${id}${name ? ` (${name})` : ''} was not found in graph`
  );
};

export const getVertexEdgeFromGraph2 = <
  VERTEX extends DefaultVertex = DefaultVertex,
  EDGE extends DefaultVertexEdge = DefaultVertexEdge,
>(
  graph: Readonly<VertexGraph<VERTEX, EDGE>>,
  idA: VertexId,
  idB: VertexId,
  name?: string
): VertexEdgeIdPair<EDGE> =>
  getVertexEdgeFromGraph<VERTEX, EDGE>(graph, getVertexEdgeKey(idA, idB), name);

export const getVertexEdgeKey = (a: VertexId, b: VertexId) =>
  (a >= b ? [b, a] : [a, b]).join(':');

export const reconstructShortestPath = <
  VERTEX extends DefaultVertex = DefaultVertex,
  EDGE extends DefaultVertexEdge = DefaultVertexEdge,
>(
  graph: Readonly<VertexGraph<VERTEX, EDGE>>,
  closedList: ReadonlyMap<VertexId, Readonly<VertexInternal>>,
  targetId: VertexId
): Array<VertexIdPair<VERTEX>> => {
  let currentVertex = getVertexFromGraph(graph, targetId, 'target:reconstruct');
  let currentVertexInternal = closedList.get(targetId);
  const reconstructedPath = [currentVertex];
  while (
    currentVertex !== undefined &&
    currentVertexInternal !== undefined &&
    currentVertexInternal.shortestDistanceNeighbor !== undefined
  ) {
    currentVertex = getVertexFromGraph(
      graph,
      currentVertexInternal.shortestDistanceNeighbor
    );
    currentVertexInternal = closedList.get(
      currentVertexInternal.shortestDistanceNeighbor
    );
    reconstructedPath.push(currentVertex);
  }
  return reconstructedPath.reverse();
};

/**
 * Generic A* path finder.
 *
 * Other resources:
 * - http://theory.stanford.edu/~amitp/GameProgramming/ImplementationNotes.html
 */
export function getShortestPath<
  VERTEX extends DefaultVertex = DefaultVertex,
  EDGE extends DefaultVertexEdge = DefaultVertexEdge,
>(
  graph: Readonly<VertexGraph<VERTEX, EDGE>>,
  sourceId: VertexId,
  targetId: VertexId,
  heuristic?: (
    current: Readonly<VertexIdPair<VERTEX>>,
    target: Readonly<VertexIdPair<VERTEX>>
  ) => number
): Array<VertexIdPair<VERTEX>> | null {
  // 0. Setup
  /** Store timings for analysis */
  const timings: Map<string, number> = new Map();
  /** Vertex from which the path starts */
  const sourceVertex = getVertexFromGraph(graph, sourceId, 'source');
  /** Vertex to which the path goes */
  const targetVertex = getVertexFromGraph(graph, targetId, 'target');
  /** Function to calculate vertex cost */
  function getVertexCost([vertexId, vertex, vertexInternal]: [
    ...VertexIdPair<VERTEX>,
    VertexInternal,
  ]) {
    return (
      vertexInternal.shortestDistanceG +
      (heuristic ? heuristic([vertexId, vertex], targetVertex) : 0)
    );
  }
  /** Open list min priority queue for vertices that may be part of the shortest path */
  const openListMinPriorityQueue = new MinPriorityQueue<
    [...VertexIdPair<VERTEX>, VertexInternal]
  >(getVertexCost);
  /** Open list set to quickly find the smallest cost of any vertex in the priority queue */
  const openListMapBest = new Map<VertexId, Readonly<VertexInternal>>();
  /** Closed list for explored vertices */
  const closedList = new Map<VertexId, Readonly<VertexInternal>>();
  // 1. Initialization
  //    > Insert start vertex into open list min priority queue
  const startVertexInternal: VertexInternal = {shortestDistanceG: 0};
  openListMinPriorityQueue.enqueue([...sourceVertex, startVertexInternal]);
  openListMapBest.set(sourceVertex[0], startVertexInternal);
  // 2. Find shortest path
  const timingsWhileLoopStart = performance.now();
  let foundShortestPath = false;
  //    > While the priority queue is not empty
  do {
    // Get vertex with the shortest path
    const [currentVertexId, currentVertex, currentVertexInternal] =
      openListMinPriorityQueue.pop();
    // 2.2 Add current vertex to the explored list since it's the shortest path to that vertex
    closedList.set(currentVertexId, currentVertexInternal);
    // If the vertex has a higher cost than the smallest one found skip it
    if (
      openListMapBest.get(currentVertexId)?.shortestDistanceG ??
      Infinity < currentVertexInternal.shortestDistanceG
    ) {
      logger.warn(
        `Skip current vertex since the best shortest distance is smaller ${currentVertexId}`
      );
      continue;
    }
    // Early exit when the target vertex is found
    if (currentVertexId === targetId) {
      // > A* terminates when the cost of the best path to the goal that you've actually found is less than or equal to
      // > the best possible cost of any other path.
      // > Since an admissible heuristic function never overestimates the cost, this is accomplished just by putting the
      // > goal vertex into the priority queue when you find it, with its estimated cost equal to its actual cost.
      // >
      // > https://stackoverflow.com/a/55433299
      // > https://www.redblobgames.com/pathfinding/a-star/introduction.html
      // > http://theory.stanford.edu/~amitp/GameProgramming/ImplementationNotes.html
      foundShortestPath = true;
      break;
    }
    // 2.3 Check neighboring vertices
    for (const neighborVertexId of currentVertex.neighborIds) {
      // 2.3a Skip neighbor vertex if it's the same id
      if (neighborVertexId === currentVertexId) {
        logger.warn(`Vertex neighbor had same ID as vertex ${currentVertexId}`);
        continue;
      }
      // 2.3b If vertex was not found either throw error or ignore
      //      > This enables running this on graphs that reference vertices
      //        unknown to it as the neighbors
      const neighborVertex = getVertexFromGraph(
        graph,
        neighborVertexId,
        `${currentVertexId} neighbor`
      );
      const [, edge] = getVertexEdgeFromGraph2(
        graph,
        currentVertexId,
        neighborVertexId,
        'neighbor edge'
      );
      // 2.3c Calculate the cost of the current neighbor vertex
      const shortestDistanceG =
        currentVertexInternal.shortestDistanceG + edge.weight;
      const neighborVertexInternal: VertexInternal = {
        shortestDistanceG,
        shortestDistanceNeighbor: currentVertexId,
      };
      // If there is a neighbor in the open list with a smaller cost
      const neighborOpenListSmallestCost =
        openListMapBest.get(neighborVertexId);
      const neighborClosedList = closedList.get(neighborVertexId);
      // Skip neighbor if the cost is greater than the existing smallest cost
      if (neighborOpenListSmallestCost ?? Infinity < shortestDistanceG) {
        continue;
        // TODO Remove neighbor from open list because new path is better
      }
      if (
        neighborClosedList?.shortestDistanceG ??
        Infinity < shortestDistanceG
      ) {
        // TODO Remove neighbor from closed list
      }
      if (
        neighborOpenListSmallestCost !== undefined ||
        neighborClosedList !== undefined
      ) {
        continue;
      }
      if (shortestDistanceG < neighborVertexInternal.shortestDistanceG) {
        neighborVertexInternal.shortestDistanceG = shortestDistanceG;
        neighborVertexInternal.shortestDistanceNeighbor = currentVertexId;
      }
      openListMinPriorityQueue.enqueue([
        ...neighborVertex,
        neighborVertexInternal,
      ]);
    }
  } while (!openListMinPriorityQueue.isEmpty());
  // Return null if no path is found or otherwise reconstruct the path
  timings.set('while loop', performance.now() - timingsWhileLoopStart);
  let result: Array<VertexIdPair<VERTEX>> | null = null;
  if (foundShortestPath) {
    const timingReconstructStart = performance.now();
    result = reconstructShortestPath(graph, closedList, targetId);
    timings.set('reconstruct', performance.now() - timingReconstructStart);
  }
  logger.info(
    `Timings: ${Array.from(timings.entries())
      .map(([name, timing]) => `${name}: ${timing}ms`)
      .join(', ')} while closing ${closedList.size} vertices`
  );
  return result;
}
