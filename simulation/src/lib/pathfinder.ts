// Package imports
import {MinPriorityQueue} from '@datastructures-js/priority-queue';
// Local imports
import {loggerPathfinder} from '../services/logging';

const logger = loggerPathfinder;

export type VertexId = number;
export type VertexEdgeId = string;

export interface Vertex {
  /** Unique vertex ID for indexing it in a map */
  id: VertexId;
  /** The closest neighbor vertex (for reconstructing the path) */
  shortestDistanceNeighbor?: VertexId;
  /** The closest neighbor vertex edge (for reconstructing the path) */
  shortestDistanceEdge?: VertexEdgeId;
  /** Cost function $g$ (shortest distance from start vertex to this vertex) */
  shortestDistanceG?: number;
  /** Neighbor vertices of this vertex */
  neighbors: VertexId[];
}

export interface VertexEdge {
  /** The vertex edge weight */
  weight: number;
}

export type VertexGraphVertices<VERTEX extends Vertex = Vertex> = Map<
  VertexId,
  Omit<VERTEX, 'id'>
>;

export type VertexGraphEdges<
  VERTEX extends Vertex = Vertex,
  EDGE extends VertexEdge = VertexEdge,
> = VertexGraphEdgesFunc<VERTEX, EDGE> | VertexGraphEdgesMap<EDGE>;

export type VertexGraphEdgesFunc<
  VERTEX extends Vertex = Vertex,
  EDGE extends VertexEdge = VertexEdge,
> = (
  vertexA: Readonly<VertexPair<VERTEX>>,
  vertexB: Readonly<VertexPair<VERTEX>>
) => Omit<EDGE, 'id'> | null;

export type VertexGraphEdgesMap<EDGE extends VertexEdge = VertexEdge> = Map<
  VertexEdgeId,
  Omit<EDGE, 'id'>
>;

export interface VertexGraph<
  VERTEX extends Vertex = Vertex,
  EDGE extends VertexEdge = VertexEdge,
> {
  /** The vertices of the graph. */
  vertices: VertexGraphVertices<VERTEX>;
  /**
   * The edges of the graph.
   * This can either be:
   * - A function that returns the vertex edge between 2 vertices (or null if no edge)
   * - A map that contains all edges
   */
  edges: VertexGraphEdges<VERTEX, EDGE>;
}

export type VertexPair<VERTEX extends Vertex = Vertex> = [
  VertexId,
  Omit<VERTEX, 'id'>,
];

export const getVertexFromGraphError = <
  VERTEX extends Vertex = Vertex,
  EDGE extends VertexEdge = VertexEdge,
>(
  graph: Readonly<VertexGraph<VERTEX, EDGE>>,
  id: VertexId,
  name?: string
): VertexPair<VERTEX> => {
  const vertexOrError = getVertexFromGraph(graph, id, name);
  if (vertexOrError instanceof Error) {
    throw vertexOrError;
  }
  return vertexOrError;
};

export const getVertexFromGraph = <
  VERTEX extends Vertex = Vertex,
  EDGE extends VertexEdge = VertexEdge,
>(
  graph: Readonly<VertexGraph<VERTEX, EDGE>>,
  id: VertexId,
  name?: string
): VertexPair<VERTEX> | Error => {
  const vertex = graph.vertices.get(id);
  if (vertex !== undefined) {
    return [id, vertex];
  }
  const error = `Vertex ${id}${
    name ? ` (${name})` : ''
  } was not found in graph`;
  logger.warn(error);
  return Error(error);
};

export const getVertexEdgeKey = (a: VertexId, b: VertexId) =>
  (a >= b ? [b, a] : [a, b]).join(':');

export interface GetShortestPathOptions {
  /** Ignore when a vertex ID cannot be found (default = false). */
  ignoreMissingIds?: boolean;
}

export const getVertexEdge = <
  VERTEX extends Vertex = Vertex,
  EDGE extends VertexEdge = VertexEdge,
>(
  graph: Readonly<VertexGraph<VERTEX, EDGE>>,
  vertexA: Readonly<VertexPair<VERTEX>>,
  vertexB: Readonly<VertexPair<VERTEX>>
): Omit<EDGE, 'id'> | null =>
  graph.edges instanceof Function
    ? graph.edges(vertexA, vertexB)
    : graph.edges.get(getVertexEdgeKey(vertexA[0], vertexB[0])) ?? null;

/**
 * A* implementation between 2 nodes in an OSM graph.
 *
 * Background:
 *
 * Given a graph consisting of nodes that have a unique ID and are connected via
 * edges with weights (that represent for example how "hard" it is go go from
 * one node to the connected one).
 *
 * - Start node S
 * - End node E
 * - Other nodes A1, ..., An
 *
 *  ```
 *             8---A3----1----E
 *            /   /          /
 * S---4----A1   /          /
 *           |  4          2
 *           2 /          /
 *           |/          /
 *          A2----6----A4
 * ```
 *
 * Dijkstra: Get the shortest path from one source node S to any other given
 *           that there are no negative edge weights
 * -----------------------------------------------------------------------------
 * 1. First we initialize all nodes as a triple:
 *    (node, shortest distance from the start node, shortest path via node)
 *    [shortest path via node is necessary to reconstruct the path]
 *    So we get:
 *    - (S, 0, null) Since the distance is 0 and there is no previous node
 *    - (A1, Infinity, null), ..., (An, Infinity, null)
 *      [Infinity meaning it might be impossible to even reach that node]
 * 2. Now we put the start node (S, 0, null) in a priority queue that
 *    always pops the tuple with the shortest distance from the start node
 * 3. In a loop until the priority queue is empty we now pop the current node
 *    3.1 And check all its neighbors:
 *        3.1.1 When the neighboring node was visited before ignore it
 *        3.1.2 If the shortest distance from the popped node + path weight to
 *              the neighboring node is smaller than the current shortest
 *              distance of the neighboring node update it and set its
 *              "shortest path via node" in the triple to the current (parent)
 *              node
 *    3.2 Now put that node into a list so we can avoid visiting it again
 * 4. While this algorithm can run until all nodes are visited for an early
 *    exist it can just terminate as soon as the target node E is popped from
 *    the priority queue
 *    Using the "shortest path via node" the shortest path can now be
 *    reconstructed
 *
 *  ```
 *             8---A3----1----E
 *            /   /          /
 * S---4----A1   /          /
 *           |  4          2    => E
 *           2 /          /
 *           |/          /
 *          A2----6----A4
 * ```
 *
 * Example:
 * - Initialize:
 *   - PriorityQueue = [(S, 0, null)]
 *   - OtherNodes    = [(A1, Infinity, null);...;(E, Infinity, null)]
 *   - ClosedList    = []
 * - Pop (S, 0, null) and check the child nodes [A1]
 *   - (S, 0, null) --4-> (A1, Infinity, null):
 *     - Update distance: Infinity > 0 + 4
 *     - Put into PriorityQueue = [(A1, 4, S)]
 *   - Put into ClosedList = [S]
 * - Pop (A1, 4, S) and check the child nodes [A2, A3]
 *   - (A1, 4, S) --2-> (A2, Infinity, null):
 *     - Update distance: Infinity > 4 + 2
 *     - Put into PriorityQueue = [(A2, 6, A1)]
 *   - (A1, 4, S) --8-> (A3, Infinity, null):
 *     - Update distance: Infinity > 4 + 8
 *     - Put into PriorityQueue = [(A2, 6, A1), (A3, 12, A1)]
 *   - Put into ClosedList = [S,A1]
 * - Pop (A2, 6, A1) and check the child nodes [A1,A3,A4] => [A3,A4]
 *   - (A2, 6, A1) --4-> (A3, 12, A1):
 *     - Update distance: 12 > 4 + 6
 *     - Put into PriorityQueue = [(A3, 10, A2)]
 *   - (A2, 6, A1) --6-> (A4, Infinity):
 *     - Update distance: Infinity > 6 + 6
 *     - Put into PriorityQueue = [(A3, 10, A2), (A4, 12, A2)]
 *   - Put into ClosedList = [S,A1,A2]
 * - Pop (A3, 10, A2) and check the child nodes [A1,A2,E] => [E]
 *   - (A3, 10, A2) --1-> (E, Infinity, null):
 *     - Update distance: Infinity > 10 + 1
 *     - Put into PriorityQueue = [(E, 11, A3), (A4, 12, A2)]
 *   - Put into ClosedList = [S,A1,A2,A3]
 * - Pop target node (E, 11, A3) and early exit / reconstruct path:
 *   - (E, 11, A3)
 *   - (A3, 10, A2)
 *   - (A2, 6, A1)
 *   - (A1, 4, S)
 *   - (S, 0, null)
 */
export function getShortestPath<
  VERTEX extends Vertex = Vertex,
  EDGE extends VertexEdge = VertexEdge,
>(
  graph: Readonly<VertexGraph<VERTEX, EDGE>>,
  sourceId: VertexId,
  targetId: VertexId,
  heuristic?: (
    current: Readonly<VertexPair<VERTEX>>,
    target: Readonly<VertexPair<VERTEX>>
  ) => number,
  options: Readonly<GetShortestPathOptions> = {}
): Array<VertexPair<VERTEX>> | null {
  const timings: Map<string, number> = new Map();
  // A vertex (besides the source and target vertex) can have 3 possible states:
  // 1. Unknown:  It is unknown if the vertex is even connected to the source/target
  //              - Stored in the *graph* [Map<ID,vertex>]
  // 2. Known:    It is connected to a vertex that was checked but at this point still
  //              may be on a suboptimal path (not the shortest distance)
  //              - Stored in the *open list* [PriorityQueue<vertex>]
  // 3. Explored: The shortest path to this vertex is known
  //              - Stored in the *closed list* to prevent being loaded into the
  //                *open list* again [Set<ID>]
  const source = getVertexFromGraphError(graph, sourceId, 'source');
  const target = getVertexFromGraphError(graph, targetId, 'target');
  // Reset cost function g and the connected neighbor
  const timingDeleteShortestDistanceStart = performance.now();
  for (const [, vertex] of graph.vertices) {
    if (vertex.shortestDistanceG !== undefined) {
      delete vertex.shortestDistanceG;
      delete vertex.shortestDistanceNeighbor;
    }
    //delete vertex.shortestDistanceNeighbor;
  }
  timings.set(
    'delete vertex.shortestDistance',
    performance.now() - timingDeleteShortestDistanceStart
  );
  //const timingSetShortestDistanceInfinityStart = performance.now();
  //for (const [, vertex] of graph.vertices) {
  //  vertex.shortestDistanceG = Infinity;
  //  // => Results in heap limit LOL
  //}
  //timings.set(
  //  'set vertex.shortestDistance to infinity',
  //  performance.now() - timingSetShortestDistanceInfinityStart
  //);
  // 0. Initialize the necessary data structures
  const openList = new MinPriorityQueue<[VertexId, Omit<VERTEX, 'id'>]>(
    ([id, vertex]) =>
      // if heuristic is found use A*, otherwise just plain dijkstra:
      // f = g  + h   (A*)
      // f = g (+ 0)  (dijkstra)
      (vertex.shortestDistanceG ?? Infinity) +
      (heuristic ? heuristic([id, vertex], target) : 0)
  );
  const closedList = new Set<number>();
  // 1. Insert the source vertex into the priority queue
  source[1].shortestDistanceG = 0;
  openList.enqueue(source);
  // 2. Loop while there are to the start vertex connected vertices in the queue
  const timingsWhileLoopStart = performance.now();
  while (!openList.isEmpty()) {
    const [currentVertexId, currentVertex] = openList.pop();
    // 2.1 Early exit when the target vertex is popped
    if (currentVertexId === targetId) {
      timings.set('while loop', performance.now() - timingsWhileLoopStart);
      const timingReconstructStart = performance.now();
      const result = reconstructShortestPath(graph, targetId);
      timings.set('reconstruct', performance.now() - timingReconstructStart);
      logger.info(
        `Timings: ${Array.from(timings.entries())
          .map(([name, timing]) => `${name}: ${timing}ms`)
          .join(', ')} while closing ${closedList.size} vertices`
      );
      return result;
    }
    // 2.2 Check neighboring vertices
    for (const neighbor of currentVertex.neighbors) {
      if (neighbor === currentVertexId) {
        continue;
      }
      // 2.2a If vertex was already explored skip it
      if (closedList.has(neighbor)) {
        continue;
      }
      // 2.2b If vertex was not found either throw error or ignore
      //      > This enables running this on graphs that reference vertices
      //        unknown to it as the neighbors
      const neighborVertex = getVertexFromGraph(
        graph,
        neighbor,
        `neighbor of ${currentVertexId}`
      );
      if (neighborVertex instanceof Error) {
        if (options.ignoreMissingIds === true) {
          continue;
        } else {
          throw neighborVertex;
        }
      }
      // 2.2c Update the neighbor vertex distance/neighbor if a smaller one is found
      const edge = getVertexEdge(
        graph,
        [currentVertexId, currentVertex],
        neighborVertex
      );
      if (edge === null) {
        throw Error(
          `Expected edge between vertex ${currentVertexId} and vertex ${neighborVertex[0]}`
        );
      }
      const distanceToNeighbor =
        (currentVertex.shortestDistanceG ?? Infinity) + edge.weight;
      if (
        distanceToNeighbor < (neighborVertex[1].shortestDistanceG ?? Infinity)
      ) {
        neighborVertex[1].shortestDistanceG = distanceToNeighbor;
        neighborVertex[1].shortestDistanceNeighbor = currentVertexId;
        //neighborVertex.shortestDistanceEdge = edge.id;
      }
      // 2.2d Enqueue the neighbor vertex to the priority queue
      openList.remove(([id]) => id === neighborVertex[0]);
      openList.enqueue(neighborVertex);
    }
    // 2.3 Add current vertex to closed list since it is now explored
    closedList.add(currentVertexId);
  }
  timings.set('while loop', performance.now() - timingsWhileLoopStart);
  logger.info(
    `Timings: ${Array.from(timings.entries())
      .map(([name, timing]) => `${name}: ${timing}ms`)
      .join(', ')}`
  );
  return null;
}

export const reconstructShortestPath = <
  VERTEX extends Vertex = Vertex,
  EDGE extends VertexEdge = VertexEdge,
>(
  graph: Readonly<VertexGraph<VERTEX, EDGE>>,
  targetId: VertexId
): Array<VertexPair<VERTEX>> => {
  let currentVertex = getVertexFromGraphError(
    graph,
    targetId,
    'target:reconstruct'
  );
  const reconstructedPath = [currentVertex];
  while (
    currentVertex !== undefined &&
    currentVertex[1].shortestDistanceNeighbor !== undefined
  ) {
    currentVertex = getVertexFromGraphError(
      graph,
      currentVertex[1].shortestDistanceNeighbor
    );
    reconstructedPath.push(currentVertex);
  }
  return reconstructedPath.reverse();
};
