// Package imports
import haversine from 'haversine-distance';
import {
  PriorityQueue,
  MinPriorityQueue,
  MaxPriorityQueue,
  ICompare,
  IGetCompareValue,
} from '@datastructures-js/priority-queue';
// Type imports
import type {Coordinates} from '../globals/types/coordinates';
import type {
  OverpassOsmNode,
  OverpassOsmWay,
  OverpassRequestCityDataType,
} from '../config/overpass';

export interface OsmGraphNode {
  coordinates: Coordinates;
  edges: OsmGraphNodeEdge[];
  info: OverpassOsmNode;
}
export interface OsmGraphEdge {
  info: OverpassOsmWay;
}

export interface OsmGraphNodeEdge {
  value: null | number;
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
          coordinates: {lat: a.lat, long: a.lon},
          edges: [],
          info: a,
        },
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [nodeId, node] of graph.nodes) {
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

export const getShortestPath = (
  graph: Readonly<OsmGraph>,
  sourceNodeId: number,
  targetNodeId: number
): void => {
  // TODO
};
