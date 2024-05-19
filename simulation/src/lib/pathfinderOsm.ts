// Local imports
import {getShortestPath, getVertexEdgeFromGraph2} from './pathfinder';
import {createLoggerSection} from '../services/logging';
import {haversineDistance} from './haversineDistance';
// Type imports
import type {
  DefaultVertex,
  DefaultVertexEdge,
  VertexGraph,
  VertexIdPair,
} from './pathfinder';
import type {Coordinates} from '../globals/types/coordinates';

const logger = createLoggerSection('lib', 'pathfinderOsm');

export interface OsmVertex extends DefaultVertex, Coordinates {}

export interface OsmVertexEdge extends DefaultVertexEdge {
  /**
   * Contains intermediate nodes that were removed for performance reasons.
   * They are sorted from lesser ID to bigger ID!
   */
  geometry: Array<Coordinates>;
}

export type OsmVertexGraph = VertexGraph<OsmVertex, OsmVertexEdge>;

export const getClosestVertex = (
  graph: Readonly<OsmVertexGraph>,
  coordinates: Readonly<Coordinates>
): [number, OsmVertex] | null => {
  let closestVertex = null;
  let closestVertexId = null;
  let closestDistance = Infinity;
  for (const [vertexId, vertex] of graph.vertices) {
    const distanceToCoordinates = haversineDistance(coordinates, vertex);
    if (distanceToCoordinates < closestDistance) {
      closestVertex = vertex;
      closestVertexId = vertexId;
      closestDistance = distanceToCoordinates;
      continue;
    }
  }
  if (closestVertex === null || closestVertexId === null) {
    return null;
  }
  return [closestVertexId, closestVertex];
};

export const getShortestPathOsmCoordinates = (
  graph: Readonly<OsmVertexGraph>,
  sourceCoordinates: Readonly<Coordinates>,
  targetCoordinates: Readonly<Coordinates>
): Array<Coordinates> | null => {
  const sourceVertex = getClosestVertex(graph, sourceCoordinates);
  const targetVertex = getClosestVertex(graph, targetCoordinates);
  if (sourceVertex === null || targetVertex === null) {
    logger.error(Error('Could not find a close vertex?'));
    return null;
  }
  const shortestPath = getShortestPath(
    graph,
    sourceVertex[0],
    targetVertex[0],
    // Use the air-line distance as heuristic
    ([, vertex]) => haversineDistance(vertex, targetCoordinates)
  );
  if (shortestPath === null || shortestPath.length === 0) {
    logger.error(
      Error(
        `Could not find a path between ${sourceVertex[0]} and ${targetVertex[0]}?`
      )
    );
    return null;
  }
  let lastVertexPair: VertexIdPair<OsmVertex> = shortestPath[0];
  return shortestPath.reduce((prev, curr) => {
    if (lastVertexPair[0] === curr[0]) {
      return [...prev, curr[1]];
    }
    const edge = getVertexEdgeFromGraph2(graph, lastVertexPair[0], curr[0]);
    if (edge[1].geometry === undefined) {
      lastVertexPair = curr;
      return [...prev, curr[1]];
    }
    // LAST ---- CURR
    // Geometry should be sorted like [1,2,3,4] if ID(LAST) < ID(CURR)
    const result = [
      ...prev,
      ...(lastVertexPair[0] < curr[0]
        ? edge[1].geometry
        : edge[1].geometry.slice().reverse()),
      curr[1],
    ];
    lastVertexPair = curr;
    return result;
  }, [] as Array<Coordinates>);
};
