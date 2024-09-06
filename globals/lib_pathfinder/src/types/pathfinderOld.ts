/** Unique vertex ID for indexing it */
export type VertexId = number;

/** Unique vertex edge ID for indexing it */
export type VertexEdgeId = string;

/** Represents a vertex in the graph */
export interface Vertex {
  /** Unique vertex ID for indexing it */
  id: VertexId;
  /** Neighbor vertex IDs of all vertices that are connected to this vertex */
  neighborIds: VertexId[];
}

/** Represents internal information of a vertex in the graph */
export interface VertexInternal {
  /** The closest neighbor vertex (for reconstructing the path) */
  shortestDistanceNeighbor?: VertexId;
  /** The cost function $g$ (shortest distance from start vertex to this vertex) */
  shortestDistanceG: number;
}

/** Represents a edge that connects 2 vertices in the graph */
export interface VertexEdge {
  /** Unique vertex ID for indexing it */
  id: VertexId;
  /** The weight */
  weight: number;
}

export type DefaultVertex = Omit<Vertex, 'id'>;
export type DefaultVertexEdge = Omit<VertexEdge, 'id'>;

export type VertexGraphVertices<VERTEX extends DefaultVertex = DefaultVertex> =
  ReadonlyMap<VertexId, VERTEX>;
export type VertexGraphEdges<
  EDGE extends DefaultVertexEdge = DefaultVertexEdge,
> = ReadonlyMap<VertexEdgeId, EDGE>;

/** Represents a graph consisting of edges and vertices */
export interface VertexGraph<
  VERTEX extends DefaultVertex = DefaultVertex,
  EDGE extends DefaultVertexEdge = DefaultVertexEdge,
> {
  /** The vertices of the graph */
  vertices: VertexGraphVertices<VERTEX>;
  /** The edges of the graph */
  edges: VertexGraphEdges<EDGE>;
}

/** Represents a tuple of a vertex Id and vertex information. */
export type VertexIdPair<VERTEX extends DefaultVertex = DefaultVertex> = [
  VertexId,
  Readonly<VERTEX>,
];

/** Represents a tuple of a vertex Id and vertex information. */
export type VertexTupleInternal<VERTEX extends DefaultVertex = DefaultVertex> =
  [...VertexIdPair<VERTEX>, VertexInternal];

/** Represents a tuple of a vertex Id and vertex information. */
export type VertexEdgeIdPair<
  EDGE extends DefaultVertexEdge = DefaultVertexEdge,
> = [VertexEdgeId, Readonly<EDGE>];
