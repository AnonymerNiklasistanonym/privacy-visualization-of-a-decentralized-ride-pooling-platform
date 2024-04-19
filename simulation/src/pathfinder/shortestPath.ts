// Package imports
import {MinPriorityQueue} from '@datastructures-js/priority-queue';

export type VertexId = number;
export type VertexEdgeId = number;

export interface Vertex {
  /** Unique vertex ID for indexing it in a map */
  id: VertexId;
  /** The closest neighbor vertex (for reconstructing the path) */
  shortestDistanceNeighbor?: VertexId;
  /** Cost function $g$ (shortest distance from start vertex to this vertex) */
  shortestDistanceG?: number;
  /** Neighbor vertices of this vertex */
  neighbors: VertexId[];
}

export interface VertexEdge {
  /** Unique vertex edge ID for indexing it in a map */
  id: VertexEdgeId;
  /** The vertex edge weight */
  weight: number;
  vertexA: VertexId;
  vertexB: VertexId;
}

export interface VertexGraph<
  T extends Vertex = Vertex,
  U extends VertexEdge = VertexEdge,
> {
  vertices: Map<VertexId, T>;
  edges: ((vertexA: T, vertexB: T) => number) | Map<VertexEdgeId, U>;
}

export const getVertexFromGraphError = <
  T extends Vertex = Vertex,
  U extends VertexEdge = VertexEdge,
>(
  graph: Readonly<VertexGraph<T, U>>,
  id: VertexId,
  name?: string
): T => {
  const vertexOrError = getVertexFromGraph(graph, id, false, name);
  if (vertexOrError instanceof Error) {
    throw vertexOrError;
  }
  return vertexOrError;
};

export const getVertexFromGraph = <
  T extends Vertex = Vertex,
  U extends VertexEdge = VertexEdge,
>(
  graph: Readonly<VertexGraph<T, U>>,
  id: VertexId,
  warn = true,
  name?: string
): T | Error => {
  const vertex = graph.vertices.get(id);
  if (vertex) {
    return vertex;
  }
  const error = `Vertex ${id}${
    name ? ` (${name})` : ''
  } was not found in graph`;
  if (warn) {
    console.warn(error);
  }
  return Error(error);
};

export interface GetShortestPathOptions {
  /** Ignore when a vertex ID cannot be found (default = false). */
  ignoreMissingIds?: boolean;
}

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
export const getShortestPath = <
  T extends Vertex = Vertex,
  U extends VertexEdge = VertexEdge,
>(
  graph: Readonly<VertexGraph<T, U>>,
  sourceId: VertexId,
  targetId: VertexId,
  heuristic?: (currentNode: Readonly<T>, targetNode: Readonly<T>) => number,
  options: GetShortestPathOptions = {}
): T[] | null => {
  // A vertex (besides the source and target vertex) can have 3 possible states:
  // 1. Unknown:  It is unknown if the vertex is even connected to the source/target
  //              - Stored in the *graph* [Map<ID,vertex>]
  // 2. Known:    It is connected to a vertex that was checked but at this point still
  //              may be on a suboptimal path (not the shortest distance)
  //              - Stored in the *open list* [PriorityQueue<vertex>]
  // 3. Explored: The shortest path to this vertex is known
  //              - Stored in the *closed list* to prevent being loaded into the
  //                *open list* again [Set<ID>]
  if (graph.edges instanceof Map) {
    throw Error('Shortest path does not yet support edge maps');
  }
  const source = getVertexFromGraphError(graph, sourceId, 'source');
  const target = getVertexFromGraphError(graph, targetId, 'target');
  // Reset cost function g and the connected neighbor
  for (const [, vertex] of graph.vertices) {
    delete vertex.shortestDistanceG;
    delete vertex.shortestDistanceNeighbor;
  }
  // 0. Initialize the necessary data structures
  const openList = new MinPriorityQueue<T>(
    node =>
      // if heuristic is found use A*, otherwise just plain dijkstra:
      // f = g  + h   (A*)
      // f = g (+ 0)  (dijkstra)
      (node.shortestDistanceG ?? Infinity) +
      (heuristic ? heuristic(node, target) : 0)
  );
  const closedList = new Set<number>();
  // 1. Insert the source vertex into the priority queue
  source.shortestDistanceG = 0;
  openList.enqueue(source);
  // 2. Loop while there are to the start vertex connected vertices in the queue
  while (!openList.isEmpty()) {
    const currentVertex = openList.pop();
    // 2.1 Early exit when the target vertex is popped
    if (currentVertex.id === targetId) {
      return reconstructShortestPath(graph, targetId);
    }
    // 2.2 Check neighboring vertices
    for (const neighbor of currentVertex.neighbors) {
      if (neighbor === currentVertex.id) {
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
        options.ignoreMissingIds !== true,
        `neighbor of ${currentVertex.id}`
      );
      if (neighborVertex instanceof Error) {
        if (options.ignoreMissingIds !== true) {
          continue;
        } else {
          throw neighborVertex;
        }
      }
      // 2.2c Update the neighbor vertex distance/neighbor if a smaller one is found
      const distanceToNeighbor =
        (currentVertex.shortestDistanceG ?? Infinity) +
        graph.edges(currentVertex, neighborVertex);
      if (distanceToNeighbor < (neighborVertex.shortestDistanceG ?? Infinity)) {
        neighborVertex.shortestDistanceG = distanceToNeighbor;
        neighborVertex.shortestDistanceNeighbor = currentVertex.id;
      }
      // 2.2d Enqueue the neighbor vertex to the priority queue
      openList.remove(a => a.id === neighborVertex.id);
      openList.enqueue(neighborVertex);
    }
    // 2.3 Add current vertex to closed list since it is now explored
    closedList.add(currentVertex.id);
  }
  return null;
};

export const reconstructShortestPath = <
  T extends Vertex = Vertex,
  U extends VertexEdge = VertexEdge,
>(
  graph: Readonly<VertexGraph<T, U>>,
  targetId: VertexId
): T[] => {
  let currentVertex: T = getVertexFromGraphError(
    graph,
    targetId,
    'target:reconstruct'
  );
  const reconstructedPath = [currentVertex];
  while (currentVertex.shortestDistanceNeighbor !== undefined) {
    currentVertex = getVertexFromGraphError(
      graph,
      currentVertex.shortestDistanceNeighbor
    );
    reconstructedPath.push(currentVertex);
  }
  return reconstructedPath.reverse();
};
