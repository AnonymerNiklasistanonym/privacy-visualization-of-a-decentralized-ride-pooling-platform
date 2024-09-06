export interface GraphAdjacencyListAdvancedEdge<
  NODE_ID extends string | number,
  EDGE_DATA,
> {
  node: NODE_ID;
  weight: number;
  data: EDGE_DATA;
}

export type GraphAdjacencyListAdvanced<
  NODE_ID extends string | number,
  EDGE_DATA,
> = Map<NODE_ID, Array<GraphAdjacencyListAdvancedEdge<NODE_ID, EDGE_DATA>>>;

export interface EdgeAdvanced<NODE_ID extends string | number, EDGE_DATA> {
  nodeA: NODE_ID;
  nodeB: NODE_ID;
  weight: number;
  data: EDGE_DATA;
}

export interface MapCameFromAdvancedEntry<
  NODE_ID extends string | number,
  EDGE_DATA,
> {
  node: NODE_ID;
  data: EDGE_DATA;
}

export type MapCameFromAdvanced<
  NODE_ID extends string | number,
  EDGE_DATA,
> = Map<NODE_ID, MapCameFromAdvancedEntry<NODE_ID, EDGE_DATA>>;
