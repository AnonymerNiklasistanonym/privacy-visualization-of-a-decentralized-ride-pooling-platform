// Local imports
import {MinPriorityQueue} from './minPriorityQueue';
import {loggerPathfinder} from '../services/logging';

const logger = loggerPathfinder;

/** Unique vertex ID for indexing it */
export type VertexId = number;

/** Unique vertex edge ID for indexing it */
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
export type VertexTupleInternal<VERTEX extends DefaultVertex = DefaultVertex> =
  [...VertexIdPair<VERTEX>, VertexInternal];

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
  // A vertex (besides the source and target vertex) can have 3 possible states:
  // > 1. Unknown:  It is unknown if the vertex is even connected to the source/target
  // >              - Stored in the *graph* [Map<ID,vertex>]
  // > 2. Known:    It is connected to a vertex that was checked but at this point still
  // >              may be on a suboptimal path (not the shortest distance)
  // >              - Stored in the *open list* [PriorityQueue<vertex>]
  // > 3. Explored: The shortest path to this vertex is known
  // >              - Stored in the *closed list* to prevent being loaded into the
  // >                *open list* again [Set<ID>]
  // 0. Setup
  /** Store timings for analysis */
  const timings: Map<string, number> = new Map();
  /** Vertex from which the path starts */
  const sourceVertex = getVertexFromGraph(graph, sourceId, 'source');
  /** Vertex to which the path goes */
  const targetVertex = getVertexFromGraph(graph, targetId, 'target');
  let timingCalculateCost = 0;
  let timesCalculatedHeuristic = 0;
  /** Function to calculate vertex cost */
  function getVertexCost([
    vertexId,
    vertex,
    vertexInternal,
  ]: VertexTupleInternal<VERTEX>) {
    timesCalculatedHeuristic++;
    const timingsCalculateCostStart = performance.now();
    const result =
      // if heuristic is found use A*, otherwise just plain dijkstra:
      // f = g  + h   (A*)
      // f = g (+ 0)  (dijkstra)
      (vertexInternal.shortestDistanceG ?? Infinity) +
      (heuristic ? heuristic([vertexId, vertex], targetVertex) : 0);
    timingCalculateCost += performance.now() - timingsCalculateCostStart;
    return result;
  }
  // 0. Initialize the necessary data structures
  const openList = new MinPriorityQueue<VertexTupleInternal<VERTEX>>();
  const closedList = new Map<number, VertexInternal>();
  // 1. Insert the source vertex into the priority queue
  const sourceVertexInternal: VertexInternal = {shortestDistanceG: 0};
  openList.enqueue(
    [...sourceVertex, sourceVertexInternal],
    getVertexCost([...sourceVertex, sourceVertexInternal])
  );
  // 2. Loop while there are to the start vertex connected vertices in the queue
  let foundPath = false;
  let timingSumRemove = 0;
  const timingsWhileLoopStart = performance.now();
  do {
    const [currentVertexId, currentVertex, currentVertexInternal] =
      openList.dequeue();
    closedList.set(currentVertexId, currentVertexInternal);
    // 2.1 Early exit when the target vertex is popped
    if (currentVertexId === targetId) {
      foundPath = true;
      break;
    }
    // 2.2 Check neighboring vertices
    for (const neighborVertexId of currentVertex.neighborIds) {
      if (neighborVertexId === currentVertexId) {
        continue;
      }
      // 2.2a If vertex was already explored skip it
      if (closedList.has(neighborVertexId)) {
        continue;
      }
      // 2.2b If vertex was not found either throw error or ignore
      //      > This enables running this on graphs that reference vertices
      //        unknown to it as the neighbors
      const neighborVertex = getVertexFromGraph(
        graph,
        neighborVertexId,
        `neighbor of ${currentVertexId}`
      );
      // 2.2c Update the neighbor vertex distance/neighbor if a smaller one is found
      const [, edge] = getVertexEdgeFromGraph2(
        graph,
        currentVertexId,
        neighborVertexId,
        `Expected edge between vertex ${currentVertexId} and vertex ${neighborVertexId}`
      );
      const distanceToNeighbor =
        (currentVertexInternal.shortestDistanceG ?? Infinity) + edge.weight;
      const neighborVertexInternal = {
        shortestDistanceG: distanceToNeighbor,
        shortestDistanceNeighbor: currentVertexId,
      };
      // 2.2d Enqueue the neighbor vertex to the priority queue
      //openList.remove(([id]) => id === neighborVertex[0]);
      const timingRemoveStart = performance.now();
      openList.removeAll(
        ([vertexId, , vertexInternal]) =>
          vertexId === neighborVertexId &&
          vertexInternal.shortestDistanceG >
            neighborVertexInternal.shortestDistanceG
      );
      timingSumRemove += performance.now() - timingRemoveStart;
      openList.enqueue(
        [...neighborVertex, neighborVertexInternal],
        getVertexCost([...neighborVertex, neighborVertexInternal])
      );
    }
  } while (!openList.isEmpty());
  timings.set('while loop', performance.now() - timingsWhileLoopStart);
  timings.set('remove (sum)', timingSumRemove);
  timings.set('cost (sum)', timingCalculateCost);
  let result: null | Array<VertexIdPair<VERTEX>> = null;
  if (foundPath) {
    const timingReconstructStart = performance.now();
    result = reconstructShortestPath(graph, closedList, targetId);
    timings.set('reconstruct', performance.now() - timingReconstructStart);
  }
  logger.info(
    `Timings: ${Array.from(timings.entries())
      .map(([name, timing]) => `${name}: ${timing}ms`)
      .join(', ')} while closing ${
      closedList.size
    } vertices and having ${openList.size()} vertices in the queue while doing ${timesCalculatedHeuristic} cost calculations`
  );
  return result;
}

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
