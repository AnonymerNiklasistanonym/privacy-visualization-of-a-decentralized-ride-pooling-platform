// Package imports
import haversine from 'haversine-distance';
// Local imports
import {createLoggerSection} from '../services/logging';
import {getShortestPath} from './shortestPath';
// Type imports
import type {
  Vertex,
  VertexEdge,
  VertexEdgeId,
  VertexEdgeMaps,
  VertexGraph,
  VertexId,
} from './shortestPath';
import type {Coordinates} from '../globals/types/coordinates';
import type {OverpassRequestBbData} from '../config/overpass';

const logger = createLoggerSection('pathfinder', 'osm');

export interface OsmVertex extends Vertex, Coordinates {}

export interface OsmVertexEdge extends VertexEdge {
  /** The actual way path */
  geometry: Array<Coordinates>;
}

export type OsmVertexGraph = VertexGraph<OsmVertex, OsmVertexEdge>;

export const createOsmVertexGraph = (
  input: ReadonlyArray<OverpassRequestBbData>
): OsmVertexGraph => {
  // Create vertices
  const nodes = input.flatMap(a => a.wayNodes);
  const ways = input.flatMap(a => a.ways);
  logger.debug('node#', nodes.length);
  logger.debug('way#', ways.length);
  /** Object that contains all edge information in Maps */
  const edges: VertexEdgeMaps<OsmVertexEdge> = {
    idMap: new Map<VertexId, Map<VertexId, VertexEdgeId>>(),
    vertexEdgeIdMap: new Map<VertexEdgeId, OsmVertexEdge>(),
  };
  /** Map that contains all vertices */
  const vertices = new Map(
    nodes.map<[number, OsmVertex]>(a => [
      a.id,
      {
        id: a.id,
        lat: a.lat,
        long: a.long,
        neighbors: [],
      },
    ])
  );
  // Add neighbors
  for (const way of ways) {
    let wayWasAdded = false;
    for (let index = 0; index < way.nodes.length; index++) {
      const currentVertexId = way.nodes[index];
      const vertex = vertices.get(currentVertexId);
      if (vertex === undefined) {
        // If a vertex is not found skip it but warn since this should not happen!
        logger.warn(`Could not find vertex ${currentVertexId}!`);
        continue;
      }
      // If there is a next or previous vertex in the list add it
      const validNeighborVertexIds = [];
      if (index < way.nodes.length - 1) {
        validNeighborVertexIds.push(way.nodes[index + 1]);
      }
      if (index > 0) {
        validNeighborVertexIds.push(way.nodes[index - 1]);
      }
      for (const validNeighborVertexId of validNeighborVertexIds) {
        wayWasAdded = true;
        vertex.neighbors.push(validNeighborVertexId);
        const currentIdMap = edges.idMap.get(currentVertexId);
        if (currentIdMap !== undefined) {
          currentIdMap.set(validNeighborVertexId, way.id);
        } else {
          edges.idMap.set(
            currentVertexId,
            new Map([[validNeighborVertexId, way.id]])
          );
        }
      }
    }
    if (wayWasAdded) {
      edges.vertexEdgeIdMap.set(way.id, {
        geometry: way.nodes
          .map<undefined | Coordinates>(a => vertices.get(a))
          .filter((a): a is Coordinates => a !== undefined),
        // TODO: Makes no sense right now since the edge is a polyline connecting multiple nodes so the weight is different for every node => function
        id: way.id,
        weight: 0,
      });
    }
  }
  const verticesSizeOriginal = vertices.size;
  for (const [vertexId, vertex] of vertices.entries()) {
    // Purge vertices without neighbors
    if (vertex.neighbors.length === 0) {
      vertices.delete(vertexId);
      continue;
    }
  }
  logger.debug(
    `Found ${vertices.size} vertices of original ${
      nodes.length
    } nodes (purged ${verticesSizeOriginal - vertices.size} vertices)`
  );
  logger.debug(
    `Found ${edges.vertexEdgeIdMap.size} edges of original ${ways.length} ways`
  );
  return {edges, vertices};
};

export const getClosestVertex = (
  graph: Readonly<OsmVertexGraph>,
  coordinates: Readonly<Coordinates>
): OsmVertex | null => {
  let closestVertex = null;
  let closestVertexId = null;
  let closestDistance = Infinity;
  for (const [vertexId, vertex] of graph.vertices) {
    const distanceToCoordinates = haversine(
      {lat: coordinates.lat, lon: coordinates.long},
      {lat: vertex.lat, lon: vertex.long}
    );
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
  return {...closestVertex, id: closestVertexId};
};

export const getShortestPathOsmCoordinates = (
  graph: Readonly<OsmVertexGraph>,
  sourceCoordinates: Readonly<Coordinates>,
  targetCoordinates: Readonly<Coordinates>
) => {
  const sourceVertex = getClosestVertex(graph, sourceCoordinates);
  const targetVertex = getClosestVertex(graph, targetCoordinates);
  if (sourceVertex === null || targetVertex === null) {
    logger.error(Error('Could not find a close vertex?'));
    return null;
  }
  const shortestPath = getShortestPath(
    graph,
    sourceVertex.id,
    targetVertex.id,
    // Use the air-line distance as heuristic
    vertex =>
      haversine(
        {lat: vertex.lat, lon: vertex.long},
        {lat: targetCoordinates.lat, lon: targetCoordinates.long}
      )
  );
  if (shortestPath === null) {
    logger.error(
      Error(
        `Could not find a path between ${sourceVertex.id} and ${targetVertex.id}?`
      )
    );
    return null;
  }
  return shortestPath.map(a => a);
};
