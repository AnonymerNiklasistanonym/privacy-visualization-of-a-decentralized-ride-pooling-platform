// Type imports
import type {PartialRecord} from 'lib_globals';

export interface OverpassApiResponse<DATA> {
  version: number;
  generator: string;
  osm3s: {
    timestamp_osm_base: string;
    timestamp_areas_base: string;
    copyright: string;
  };
  elements: DATA;
}

export interface OverpassApiResponseElementAttributeCoordinates {
  lat: number;
  lon: number;
}

export type OverpassApiResponseElements<
  TAGS_KEYS_NODES extends string = string,
  TAGS_KEYS_WAYS extends string = string,
> =
  | OverpassApiResponseElementNode<TAGS_KEYS_NODES>
  | OverpassApiResponseElementWay<TAGS_KEYS_WAYS>;

export interface OverpassApiResponseElement<
  TAGS_KEYS_OPTIONAL extends string = string,
  TAGS_KEYS_REQUIRED extends string = never,
> {
  type: 'area' | 'node' | 'relation' | 'way';
  /** integer (64-bit): Used for identifying the element */
  id: number;
  tags?: PartialRecord<string, TAGS_KEYS_OPTIONAL, TAGS_KEYS_REQUIRED>;
}

/**
 * A node represents a specific point on the earth's surface defined by its latitude and longitude, referred to the World Geodetic System 1984[1]. Each node comprises at least an id number and a pair of coordinates.
 *
 * Nodes can be used to define standalone point features. For example, a node could represent a park bench or a water well.
 *
 * Nodes are also used to define the shape of a way. When used as points along ways, nodes usually have no tags, though some of them could. For example, highway=traffic_signals marks traffic signals on a road, and power=tower represents a pylon along an electric power line.
 *
 * A node can be included as a member of a relation. The relation also may indicate the member's role: that is, the node's function in this particular set of related data elements.
 *
 * https://wiki.openstreetmap.org/wiki/Elements#Node
 */
export interface OverpassApiResponseElementNode<
  TAGS_KEYS_OPTIONAL extends string = string,
  TAGS_KEYS_REQUIRED extends string = never,
> extends OverpassApiResponseElement<TAGS_KEYS_OPTIONAL, TAGS_KEYS_REQUIRED>,
    OverpassApiResponseElementAttributeCoordinates {
  type: 'node';
}

/**
 * A way is an ordered list of between 1 (!) and 2,000 nodes that define a  polyline. Ways are used to represent linear features such as rivers and roads.
 *
 * Ways can also represent the boundaries of areas (solid  polygons) such as buildings or forests. In this case, the way's first and last node will be the same. This is called a "closed way".
 *
 * Note that closed ways occasionally represent loops, such as roundabouts on highways, rather than solid areas. This is usually inferred from tags on the way, for example landuse=* can never pertain to a linear feature. However, some real-life objects (such as man_made=pier) can have both a linear closed way or an areal representation area, and the tag area=yes or area=no can be used to avoid ambiguity or misinterpretation. See also: Way#Differences between linear and area representation of features.
 *
 * Areas with holes, or with boundaries of more than 2,000 nodes, cannot be represented by a single way. Instead, the feature will require a more complex multipolygon relation data structure.
 *
 * https://wiki.openstreetmap.org/wiki/Elements#Way
 */
export interface OverpassApiResponseElementWay<
  TAGS_KEYS_OPTIONAL extends string = string,
  TAGS_KEYS_REQUIRED extends string = never,
> extends OverpassApiResponseElement<TAGS_KEYS_OPTIONAL, TAGS_KEYS_REQUIRED> {
  type: 'way';
  nodes: Array<number>;
  bounds?: OverpassApiResponseElementAttributeBounds;
  geometry?: Array<OverpassApiResponseElementAttributeCoordinates>;
}

export interface OverpassApiResponseElementAttributeBounds {
  minlat: number; // 48.6920188,
  minlon: number; // 9.0386007,
  maxlat: number; // 48.8663994,
  maxlon: number; // 9.3160228
}

export interface OverpassApiResponseElementAttributeMember<
  MEMBER_TYPE extends string = 'node' | 'way',
  ROLES extends string = string,
> {
  type: MEMBER_TYPE;
  ref: number;
  role: ROLES;
}

export interface OverpassApiResponseElementRelation<
  ROLES_NODES extends string = string,
  ROLES_WAYS extends string = string,
> {
  type: 'relation';
  id: number;
  bounds?: OverpassApiResponseElementAttributeBounds;
  members?: Array<
    | OverpassApiResponseElementAttributeMember<'node', ROLES_NODES>
    | OverpassApiResponseElementAttributeMember<'way', ROLES_WAYS>
  >;
}
