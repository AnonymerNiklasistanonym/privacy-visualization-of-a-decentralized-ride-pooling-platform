// Package imports
import haversine from 'haversine-distance';
// Local imports
import {getShortestPath} from './shortestPath';
// Type imports
import type {
  OverpassOsmNode,
  OverpassRequestCityDataType,
} from '../config/overpass';
import type {
  Vertex,
  VertexEdge,
  VertexEdgeId,
  VertexEdgeMaps,
  VertexGraph,
  VertexId,
} from './shortestPath';
import type {Coordinates} from '../globals/types/coordinates';

export interface OsmVertex extends Vertex {
  /** Coordinates on the map */
  coordinates: Readonly<Coordinates>;
  /** Original information from OSM */
  info: Readonly<OverpassOsmNode>;
}

export interface OsmVertexEdge extends VertexEdge {
  /** The actual way path */
  geometry: Coordinates[];
}

export type OsmVertexGraph = VertexGraph<OsmVertex, OsmVertexEdge>;

export const genericNodeCreator = <
  T,
  Y,
  VERTEX extends Vertex,
  EDGE extends VertexEdge,
>(
  nodes: ReadonlyArray<T>,
  edges: ReadonlyArray<Y>
): VertexGraph<VERTEX, EDGE> => {
  console.log('node#', nodes.length);
  console.log('edges#', edges.length);
  return {
    edges: {
      idMap: new Map(),
      vertexEdgeIdMap: new Map(),
    },
    vertices: new Map(),
  };
};

export const createOsmVertexGraph = (
  input: ReadonlyArray<OverpassRequestCityDataType>
): OsmVertexGraph => {
  // Create vertices
  const nodes = input.map(a => a.nodes).flat();
  const ways = input.map(a => a.ways).flat();
  console.log('node#', nodes.length);
  console.log('way#', ways.length);
  const vertices = new Map<number, OsmVertex>(
    nodes.map(a => [
      a.id,
      {
        coordinates: {lat: a.lat, long: a.lon},
        id: a.id,
        info: a,
        neighbors: [],
      } satisfies OsmVertex,
    ])
  );
  console.log('vertices#', vertices.size);
  for (let index = 0; index < 10; index++) {
    console.log(ways[index]);
  }
  // Add neighbors
  const idMap = new Map<VertexId, Map<VertexId, VertexEdgeId>>();
  const vertexEdgeIdMap = new Map<VertexEdgeId, OsmVertexEdge>();
  let counterUndefined = 0;
  for (const way of ways) {
    let wayWasAdded = false;
    for (let index = 0; index < way.nodes.length; index++) {
      const vertex = vertices.get(way.nodes[index]);
      const currentIdMap = idMap.get(way.nodes[index]);
      if (vertex === undefined) {
        counterUndefined += 1;
      }
      if (vertex !== undefined && index < way.nodes.length - 1) {
        wayWasAdded = true;
        vertex.neighbors.push(way.nodes[index + 1]);
        if (currentIdMap !== undefined) {
          currentIdMap.set(way.nodes[index + 1], way.id);
        } else {
          idMap.set(
            way.nodes[index],
            new Map([[way.nodes[index + 1], way.id]])
          );
        }
      }
      if (vertex !== undefined && index > 1) {
        wayWasAdded = true;
        vertex.neighbors.push(way.nodes[index - 1]);
        if (currentIdMap !== undefined) {
          currentIdMap.set(way.nodes[index - 1], way.id);
        } else {
          idMap.set(
            way.nodes[index],
            new Map([[way.nodes[index - 1], way.id]])
          );
        }
      }
    }
    /*
    for (const nodeId of way.nodes) {
      const vertex = vertices.get(nodeId);
      if (vertex !== undefined) {
        //vertex.neighbors.push(otherNodeId);
        //for (const otherNodeId of way.nodes.filter(a => a !== nodeId)) {
        //  wayWasAdded = true;
        //  vertex.neighbors.push(otherNodeId);
        //  const currentIdMap = idMap.get(nodeId);
        //  if (currentIdMap !== undefined) {
        //    currentIdMap.set(otherNodeId, way.id);
        //  } else {
        //    idMap.set(nodeId, new Map([[otherNodeId, way.id]]));
        //  }
        //}
      }
    }*/
    if (wayWasAdded) {
      if (way.geometry === undefined) {
        console.log(way);
      } else {
        vertexEdgeIdMap.set(way.id, {
          geometry: way.geometry.map(a => ({lat: a.lat, long: a.lon})),
          id: way.id,
          weight: way.geometry
            .map((a, index) =>
              haversine(
                {lat: a.lat, lon: a.lon},
                {
                  lat: way.geometry[
                    index + 1 < way.geometry.length ? index + 1 : index
                  ].lat,
                  lon: way.geometry[
                    index + 1 < way.geometry.length ? index + 1 : index
                  ].lon,
                }
              )
            )
            .reduce((sum, a) => sum + a, 0),
        });
      }
    }
  }
  for (const [vertexId, vertex] of vertices.entries()) {
    // Purge vertices without neighbors
    if (vertex.neighbors.length === 0) {
      vertices.delete(vertexId);
    }
  }
  /*
  const edgeFunc = (
    vertexA: OsmVertex,
    vertexB: OsmVertex
  ): VertexEdge | null => ({
    id: -1,
    weight: haversine(
      {lat: vertexA.coordinates.lat, lon: vertexA.coordinates.long},
      {lat: vertexB.coordinates.lat, lon: vertexB.coordinates.long}
    ),
  });
  */
  const edges: VertexEdgeMaps<OsmVertexEdge> = {
    idMap,
    vertexEdgeIdMap,
  };
  console.log(
    `Found ${vertices.size} vertices of original ${nodes.length} nodes`
  );
  console.log(
    `Found ${edges.vertexEdgeIdMap.size} edges of original ${ways.length} ways`
  );
  console.log(`Undefined vertex counter: ${counterUndefined}`);
  //return {vertices, edges: edgeFunc};
  return {edges, vertices};
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
