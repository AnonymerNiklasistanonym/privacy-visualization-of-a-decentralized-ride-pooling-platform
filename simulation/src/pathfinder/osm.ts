// Package imports
import haversine from 'haversine-distance';
import {MaxPriorityQueue} from '@datastructures-js/priority-queue';
// Type imports
import type {Coordinates} from '../globals/types/coordinates';
import type {
  OverpassOsmNode,
  OverpassOsmWay,
  OverpassRequestCityDataType,
} from '../config/overpass';

export interface OsmGraphNode {
  id: number;
  /** cost function from start to the current grid point */
  shortestDistanceNeighbor: OsmGraphNodeNeighbor | null;
  /** cost function from start to the current grid point */
  shortestDistanceG: number;
  /** coordinates on the map */
  coordinates: Readonly<Coordinates>;
  /** neighbors of the current node */
  neighbors: OsmGraphNodeNeighbor[];
  /** original information from OSM */
  info: Readonly<OverpassOsmNode>;
}
export interface OsmGraphEdge {
  info: OverpassOsmWay;
}

export interface OsmGraphNodeNeighbor {
  nodeId: number;
  edgeId: number;
}

export interface OsmGraph {
  nodes: ReadonlyMap<number, OsmGraphNode>;
  edges: ReadonlyMap<number, OsmGraphEdge>;
}

export const createGraphOverpass = (
  input: Readonly<OverpassRequestCityDataType>
): OsmGraph => {
  const graph: OsmGraph = {
    nodes: new Map(
      input.nodes.map(a => [
        a.id,
        {
          id: a.id,
          shortestDistanceNeighbor: null,
          shortestDistanceG: Infinity,
          coordinates: {lat: a.lat, long: a.lon},
          neighbors: [],
          info: a,
        } satisfies OsmGraphNode,
      ])
    ),
    edges: new Map(
      input.ways.map(a => [
        a.id,
        {
          info: a,
        },
      ])
    ),
  };
  for (const way of input.ways) {
    for (const nodeId of way.nodes) {
      const node = graph.nodes.get(nodeId);
      if (node === undefined) {
        continue;
      }
      if (node === undefined) {
        continue;
      }
      node.edges.push(
        ...way.nodes.map(a => ({
          value: null,
          nodeId: a,
          edgeId: way.id,
        }))
      );
      node.edges = [...new Set(node.edges.filter(a => a.nodeId !== nodeId))];
    }
  }
  return graph;
};

export const getClosestNode = (
  graph: Readonly<OsmGraph>,
  coordinates: Readonly<Coordinates>
): OsmGraphNode | null => {
  let closestNode = null;
  let closestDistance = Infinity;
  for (const [, node] of graph.nodes) {
    const distanceToCoordinates = haversine(
      {lat: coordinates.lat, lon: coordinates.long},
      {lat: node.coordinates.lat, lon: node.coordinates.long}
    );
    if (distanceToCoordinates < closestDistance) {
      closestNode = node;
      closestDistance = distanceToCoordinates;
      continue;
    }
  }
  return closestNode;
};

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
export const getShortestPath = (
  graph: Readonly<OsmGraph>,
  sourceNodeId: number,
  targetNodeId: number,
  heuristic:
    | null
    | ((
        currentNode: Readonly<OsmGraphNode>,
        targetNode: Readonly<OsmGraphNode>
      ) => number) = (currentNode, targetNode) =>
    haversine(
      {lat: currentNode.coordinates.lat, lon: currentNode.coordinates.long},
      {lat: targetNode.coordinates.lat, lon: targetNode.coordinates.long}
    )
): OsmGraphNode | null => {
  // 3 kinds of nodes:
  // - 1. Unknown nodes (at the start all nodes besides the start node are unknown)
  //      - Can be found in the graph
  // - 2. Known nodes (nodes that were visited before but may be on a suboptimal path)
  //      - Stored in the *open list*
  // - 3. Finished nodes (shortest path to this node is known)
  //      - Stored in the *closed list* to prevent them from being put into the *open list* again
  const sourceNode = graph.nodes.get(sourceNodeId);
  const targetNode = graph.nodes.get(targetNodeId);
  if (sourceNode === undefined) {
    throw Error('Source node was not found in graph!');
  }
  if (targetNode === undefined) {
    throw Error('Target node was not found in graph!');
  }
  // Reset node weights
  for (const [, node] of graph.nodes) {
    node.shortestDistanceG = Infinity;
    node.shortestDistanceNeighbor = null;
  }
  // Initialize the 2 lists
  /** TODO */
  const openListMaxPriorityQ = new MaxPriorityQueue<OsmGraphNode>(
    node =>
      // f = g + h (A*) or just f = g (dijkstra)
      node.shortestDistanceG +
      (heuristic === null ? 0 : heuristic(node, targetNode))
  );
  sourceNode.shortestDistanceG = 0;
  openListMaxPriorityQ.enqueue(sourceNode);
  /** Store all */
  const closedList = new Set<number>();
  // Loop
  while (!openListMaxPriorityQ.isEmpty()) {
    const currentNode = openListMaxPriorityQ.pop();
    if (currentNode.id === targetNodeId) {
      return currentNode;
    }
    for (const neighbor of currentNode.neighbors) {
      if (closedList.has(neighbor.nodeId)) {
        continue;
      }
      const neighborNode = graph.nodes.get(neighbor.nodeId);
      if (neighborNode === undefined) {
        console.warn('neighbor node was not found', neighbor);
        continue;
      }
      const edge = graph.edges.get(neighbor.edgeId);
      if (edge === undefined) {
        console.warn('neighbor node edge was not found', neighbor);
        continue;
      }
      const distanceToNeighbor =
        currentNode.shortestDistanceG +
        haversine(
          {lat: currentNode.coordinates.lat, lon: currentNode.coordinates.long},
          {
            lat: neighborNode.coordinates.lat,
            lon: neighborNode.coordinates.long,
          }
        );
      if (distanceToNeighbor < neighborNode.shortestDistanceG) {
        neighborNode.shortestDistanceG = distanceToNeighbor;
      }
      openListMaxPriorityQ.enqueue(neighborNode);
    }
  }
  console.warn('no path was found');
  return null;
};
