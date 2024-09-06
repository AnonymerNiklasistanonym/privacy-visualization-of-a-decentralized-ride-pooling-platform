export type GraphAdjacencyListSimple<NODE_ID extends string | number> = Map<
  NODE_ID,
  Array<{node: NODE_ID; weight: number}>
>;

export interface EdgeSimple<NODE_ID extends string | number> {
  nodeA: NODE_ID;
  nodeB: NODE_ID;
  weight: number;
}

export type MapCameFrom<NODE_ID extends string | number> = Map<
  NODE_ID,
  NODE_ID
>;
