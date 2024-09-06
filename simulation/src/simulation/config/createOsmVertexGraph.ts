// Local imports
import {createLoggerSection} from '../../services/logging';
import {haversineDistance} from '../../lib/haversineDistance';
// > Globals
import {getVertexEdgeKey} from 'lib_pathfinder';
// Type imports
import type {
  OsmVertex,
  OsmVertexEdge,
  OsmVertexGraph,
} from '../../lib/pathfinderOsm';
import type {OverpassRequestBbData} from './overpass';
import type {VertexEdgeId} from 'lib_pathfinder';

const logger = createLoggerSection('simulation', 'config#pathfinderOsm');

export const createOsmVertexGraph = (
  input: ReadonlyArray<OverpassRequestBbData>
): OsmVertexGraph => {
  // Create vertices
  const nodes = input.flatMap(a => a.wayNodes);
  const ways = input.flatMap(a => a.ways);
  logger.debug('node#', nodes.length);
  logger.debug('way#', ways.length);
  /** Object that contains all edge information in Maps */
  const edges: Map<VertexEdgeId, Omit<OsmVertexEdge, 'id'>> = new Map();
  /** Map that contains all vertices */
  const vertices = new Map(
    nodes.map<[number, OsmVertex]>(a => [
      a.id,
      {
        lat: a.lat,
        long: a.long,
        neighborIds: [],
      },
    ])
  );
  // Add neighborIds
  for (const way of ways) {
    for (let index = 0; index < way.nodes.length; index++) {
      const currentVertexId = way.nodes[index];
      const vertex = vertices.get(currentVertexId);
      if (vertex === undefined) {
        // If a vertex is not found skip it but warn since this should not happen!
        logger.warn(`Could not find vertex ID=${currentVertexId}!`);
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
        vertex.neighborIds.push(validNeighborVertexId);
        const neighborVertex = vertices.get(validNeighborVertexId);
        if (neighborVertex === undefined) {
          // If a neighbor vertex is not found skip it but warn since this should not happen!
          logger.warn(
            `neighbor vertex could not be found ID=${validNeighborVertexId}!`
          );
          continue;
        }
        edges.set(getVertexEdgeKey(currentVertexId, validNeighborVertexId), {
          geometry: [],
          weight: haversineDistance(vertex, neighborVertex),
        });
      }
    }
  }
  const verticesSizeOriginal = vertices.size;
  for (const [vertexId, vertex] of vertices.entries()) {
    // Purge vertices without neighborIds
    if (vertex.neighborIds.length === 0) {
      vertices.delete(vertexId);
      continue;
    }
  }
  const verticesSizePurge = vertices.size;
  // Purge intermediate vertices that connect 2 neighborIds but have no other neighbor (do that multiple times)
  let previousVerticesSize: number;
  let counterPurgeIntermediateVertices = 0;
  do {
    previousVerticesSize = vertices.size;
    counterPurgeIntermediateVertices++;
    for (const [vertexId, vertex] of vertices.entries()) {
      if (vertex.neighborIds.length === 2) {
        const vertexNAId = vertex.neighborIds[0];
        const vertexNBId = vertex.neighborIds[1];
        const vertexNA = vertices.get(vertexNAId);
        const vertexNB = vertices.get(vertexNBId);
        if (vertexNA === undefined || vertexNB === undefined) {
          logger.warn('vertex neighborIds could not be found!', {
            vertex,
            vertexNA,
            vertexNB,
          });
          continue;
        }
        const edgeNA = edges.get(getVertexEdgeKey(vertexId, vertexNAId));
        const edgeNB = edges.get(getVertexEdgeKey(vertexId, vertexNBId));
        const edgeNAB = edges.get(getVertexEdgeKey(vertexNAId, vertexNBId));
        if (edgeNA === undefined || edgeNB === undefined) {
          logger.warn('vertex neighborIds edges could not be found!', {
            vertex,
            vertexNA,
            vertexNB,
          });
          continue;
        }
        // Fix the neighbor IDs
        vertexNA.neighborIds = vertexNA.neighborIds.filter(c => c !== vertexId);
        vertexNB.neighborIds = vertexNB.neighborIds.filter(c => c !== vertexId);
        vertexNA.neighborIds.push(vertex.neighborIds[1]);
        vertexNB.neighborIds.push(vertex.neighborIds[0]);
        // Fix the edges
        // > In case there is an already existing edge check if it's weight is less
        const weight = edgeNA.weight + edgeNB.weight;
        if (edgeNAB === undefined || weight < edgeNAB.weight) {
          /**
           * Contains the coordinates for the path between:
           *
           * NA ---- VERTEX ---- NB
           */
          const geometryTemp = [];
          // NA ---- VERTEX
          // => Intermediate coordinates between NA ---- VERTEX are sorted from lower ID to highest
          //    -> [1,2,3,4] if ID(NA) < ID(VERTEX)
          geometryTemp.push(
            ...(vertexNAId < vertexId
              ? edgeNA.geometry
              : edgeNA.geometry.reverse())
          );
          // VERTEX
          geometryTemp.push(vertex);
          // VERTEX ---- NB
          // => Intermediate coordinates between VERTEX ---- NB are sorted from lower ID to highest
          //    -> [1,2,3,4] if ID(VERTEX) < ID(NB)
          geometryTemp.push(
            ...(vertexId < vertexNBId
              ? edgeNB.geometry
              : edgeNB.geometry.reverse())
          );
          edges.set(getVertexEdgeKey(vertexNAId, vertexNBId), {
            // The current geometry [1,2,3,4] is sorted assuming ID(NA) < ID(NB)
            // If that isn't the case reverse the list
            geometry:
              vertexNAId < vertexNBId ? geometryTemp : geometryTemp.reverse(),
            weight,
          });
        }
        // Delete the intermediate vertex from the map
        vertices.delete(vertexId);
        // Delete the intermediate edged from the map
        edges.delete(getVertexEdgeKey(vertexId, vertexNAId));
        edges.delete(getVertexEdgeKey(vertexId, vertexNBId));
      }
    }
  } while (vertices.size < previousVerticesSize);
  logger.info(
    `Found ${vertices.size} vertices of original ${
      nodes.length
    } nodes (purged ${
      verticesSizeOriginal - verticesSizePurge
    } vertices and removed intermediate vertices ${
      verticesSizePurge - vertices.size
    } [${counterPurgeIntermediateVertices} purges])`
  );
  logger.debug(`Found ${edges.size} edges of original ${ways.length} ways`);
  return {edges, vertices};
};
