// Package imports
import haversine from 'haversine-distance';
import {getShortestPath} from './shortestPath';
// Type imports
import type {Coordinates} from '../globals/types/coordinates';
import type {
  OverpassOsmNode,
  OverpassRequestCityDataType,
} from '../config/overpass';
import type {Vertex, VertexGraph} from './shortestPath';

export interface OsmVertex extends Vertex {
  /** Coordinates on the map */
  coordinates: Readonly<Coordinates>;
  /** Original information from OSM */
  info: Readonly<OverpassOsmNode>;
}

export type OsmVertexGraph = VertexGraph<OsmVertex>;

export const createOsmVertexGraph = (
  input: ReadonlyArray<OverpassRequestCityDataType>
): OsmVertexGraph => {
  // Create vertices
  const vertices = new Map<number, OsmVertex>(
    input
      .map(a => a.nodes)
      .flat()
      .map(a => [
        a.id,
        {
          id: a.id,
          coordinates: {lat: a.lat, long: a.lon},
          neighbors: [],
          info: a,
        } satisfies OsmVertex,
      ])
  );
  // Add neighbors
  for (const way of input.map(a => a.ways).flat()) {
    for (const nodeId of way.nodes) {
      const vertex = vertices.get(nodeId);
      if (vertex === undefined) {
        continue;
      }
      vertex.neighbors.push(...way.nodes);
    }
  }
  const verticesCountOriginal = vertices.size;
  for (const [vertexId, vertex] of vertices.entries()) {
    // Purge references from vertices to themselves
    vertex.neighbors = vertex.neighbors.filter(a => a !== vertexId);
    // Remove vertices that have no neighbors
    if (vertex.neighbors.length === 0) {
      vertices.delete(vertexId);
    }
  }
  console.log(
    `Added ${vertices.size} nodes while purging ${
      verticesCountOriginal - vertices.size
    } unconnected nodes of originally ${input.reduce(
      (sum, a) => sum + a.nodes.length,
      0
    )} nodes`
  );
  return {
    vertices,
    edges: (vertexA, vertexB) =>
      haversine(
        {lat: vertexA.coordinates.lat, lon: vertexA.coordinates.long},
        {lat: vertexB.coordinates.lat, lon: vertexB.coordinates.long}
      ),
  };
};

export const getClosestVertex = (
  graph: Readonly<OsmVertexGraph>,
  coordinates: Readonly<Coordinates>
): OsmVertex | null => {
  let closestVertex = null;
  let closestDistance = Infinity;
  for (const [, vertex] of graph.vertices) {
    const distanceToCoordinates = haversine(
      {lat: coordinates.lat, lon: coordinates.long},
      {lat: vertex.coordinates.lat, lon: vertex.coordinates.long}
    );
    if (distanceToCoordinates < closestDistance) {
      closestVertex = vertex;
      closestDistance = distanceToCoordinates;
      continue;
    }
  }
  return closestVertex;
};

export const getShortestPathOsmCoordinates = (
  graph: Readonly<OsmVertexGraph>,
  sourceCoordinates: Readonly<Coordinates>,
  targetCoordinates: Readonly<Coordinates>
) => {
  const sourceVertex = getClosestVertex(graph, sourceCoordinates);
  const targetVertex = getClosestVertex(graph, targetCoordinates);
  if (sourceVertex === null || targetVertex === null) {
    console.warn('Could not find a close vertex?');
    return null;
  }
  const shortestPath = getShortestPath(
    graph,
    sourceVertex.id,
    targetVertex.id,
    vertex =>
      haversine(
        {lat: vertex.coordinates.lat, lon: vertex.coordinates.long},
        {lat: targetCoordinates.lat, lon: targetCoordinates.long}
      )
  );
  if (shortestPath === null) {
    console.warn('Could not find a path?');
    return null;
  }
  return shortestPath.map(a => a.coordinates);
};
