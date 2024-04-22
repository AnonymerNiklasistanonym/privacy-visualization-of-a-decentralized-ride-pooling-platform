import fs from 'fs/promises';
import path from 'path';

export const overpassRequest = async <JsonResponseType>(
  query: string
): Promise<JsonResponseType> => {
  const result = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    // The body contains the query
    // to understand the query language see "The Programmatic Query Language" on
    // https://wiki.openstreetmap.org/wiki/Overpass_API#The_Programmatic_Query_Language_(OverpassQL)
    body: 'data=' + encodeURIComponent('[out:json][timeout:90];' + query),
  }).then(data => data.json() as Promise<JsonResponseType>);
  return result;
};

const checkFileExists = (file: string) =>
  fs
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);

export const overpassRequestOrCache = async <JsonResponseType>(
  query: string,
  cacheDir: string,
  cacheFile: string,
  verbose = false
): Promise<JsonResponseType> => {
  const requestCache = path.join(cacheDir, cacheFile);
  if (await checkFileExists(requestCache)) {
    if (verbose) {
      console.info(`Use cached web request ${requestCache}`);
    }
    const content = await fs.readFile(requestCache, {encoding: 'utf-8'});
    return JSON.parse(content) as JsonResponseType;
  }
  const request = await overpassRequest<JsonResponseType>(query);
  await fs.mkdir(cacheDir, {recursive: true});
  await fs.writeFile(requestCache, JSON.stringify(request));
  if (verbose) {
    console.info(`Cache web request ${requestCache}`);
  }
  return request;
};

export const overpassRequestCityData = async (
  city: string,
  countryCode: string,
  cacheDir: string,
  verbose = false
): Promise<OverpassRequestCityDataType> => {
  const requestNodeArea = await overpassRequestOrCache<
    OverpassApiResponse<
      [OverpassApiResponseDataCityNode, OverpassApiResponseDataCityArea]
    >
  >(
    `area["name:${countryCode}"="${city}"];
           node(area)[place~"^(town|city)$"];
           foreach(
               out;
               is_in;
               area._[admin_level~"6|8"];
               out;
           );`,
    cacheDir,
    `cache_${city}_node_area.json`,
    verbose
  );
  const requestBbRelation = await overpassRequestOrCache<
    OverpassApiResponse<[OverpassApiResponseDataCityBoundingBoxRelation]>
  >(
    `relation["name:${countryCode}"="${city}"][boundary=administrative];
            out skel bb qt;`,
    cacheDir,
    `cache_${city}_bb_relation.json`,
    verbose
  );

  const area = requestNodeArea.elements.find(a => a.type === 'area');
  const node = requestNodeArea.elements.find(a => a.type === 'node');
  const boundingBoxRelation = requestBbRelation.elements.find(
    a => a.type === 'relation'
  );
  if (
    area?.type !== 'area' ||
    node?.type !== 'node' ||
    boundingBoxRelation?.type !== 'relation'
  ) {
    throw Error(
      `City data could not be fetched for "${city}" (${countryCode})`
    );
  }

  const requestBbNodes = await overpassRequestOrCache<
    OverpassApiResponse<
      (
        | OverpassApiResponseDataCityBoundingBoxWay
        | OverpassApiResponseDataCityBoundingBoxNode
      )[]
    >
  >(
    `nwr["addr:street"](${boundingBoxRelation.bounds.minlat},${boundingBoxRelation.bounds.minlon},${boundingBoxRelation.bounds.maxlat},${boundingBoxRelation.bounds.maxlon});
    out geom;`,
    cacheDir,
    `cache_${city}_bb_nodes.json`,
    verbose
  );

  return {
    area,
    boundingBoxRelation,
    node,
    nodes: requestBbNodes.elements.filter(
      a => a.type === 'node'
    ) as OverpassApiResponseDataCityBoundingBoxNode[],
    ways: requestBbNodes.elements.filter(
      a => a.type === 'way'
    ) as OverpassApiResponseDataCityBoundingBoxWay[],
    places: requestBbNodes.elements.map(
      a =>
        ({
          city: a.tags['addr:city'],
          housenumber: a.tags['addr:housenumber'],
          postcode: a.tags['addr:postcode'],
          street: a.tags['addr:street'],
          name: a.type === 'node' ? a.tags['name'] : undefined,
          lat: a.type === 'node' ? a.lat : a.bounds.maxlat,
          lon: a.type === 'node' ? a.lon : a.bounds.maxlon,
        }) satisfies OverpassApiResponseDataCityPlace
    ),
  };
};

export interface OverpassOsmElement {
  type: 'node' | 'way' | 'relation';
  /** integer (64-bit): Used for identifying the element */
  id: number;
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
export interface OverpassOsmNode extends OverpassOsmElement {
  type: 'node';
  lat: number;
  lon: number;
  tags: OverpassOsmTags;
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
export interface OverpassOsmWay extends OverpassOsmElement {
  type: 'way';
  bounds: {minlat: number; minlon: number; maxlat: number; maxlon: number};
  geometry: {lat: number; lon: number}[];
  nodes: number[];
  tags: OverpassOsmTags;
}

export interface OverpassOsmTags {
  'addr:city'?: string;
  'addr:country'?: string;
  'addr:housenumber'?: string;
  'addr:postcode'?: string;
  'addr:street'?: string;
  amenity?: string;
  'contact:email'?: string;
  'contact:phone'?: string;
  'contact:website'?: string;
  name?: string;
  operator?: string;
  tourism?: string;
  website?: string;
  wheelchair?: string;
  'wheelchair:description'?: string;
  wikidata?: string;
  'building:levels'?: string;
  'roof:levels'?: string;
  'roof:shape'?: string;
  source?: string;
}

export interface OverpassRequestCityDataType {
  node: OverpassApiResponseDataCityNode;
  area: OverpassApiResponseDataCityArea;
  boundingBoxRelation: OverpassApiResponseDataCityBoundingBoxRelation;
  places: OverpassApiResponseDataCityPlace[];
  // TODO
  nodes: OverpassOsmNode[];
  ways: OverpassOsmWay[];
}

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
export interface OverpassApiResponseDataCityNode {
  type: 'node';
  id: number; // 1674026139,
  lat: number; // 48.7784485,
  lon: number; // 9.1800132,
  tags: {
    name: string; // "Stuttgart",
    place: string; // "city",
    population: string; // "613392",
    'ref:LOCODE': string; // "DESTR",
    website: string; // "https://www.stuttgart.de/",
    wikidata: string; // "Q1022",
    wikipedia: string; // "de:Stuttgart"
  };
}
export interface OverpassApiResponseDataCityArea {
  type: 'area';
  id: number; // 3602793104,
  tags: {
    admin_level: string; // "6",
    boundary: string; // "administrative",
    license_plate_code: string; // "S",
    name: string; // "Stuttgart",
    note: string; // "kreisfrei, Stadtkreis Stuttgart",
    place: string; // "city",
    'ref:nuts:3': string; // "DE111",
    source: string; // "LGL, www.lgl-bw.de",
    type: string; // "boundary",
    wikidata: string; // "Q1022",
    wikipedia: string; // "de:Stuttgart"
  };
}
export interface OverpassApiResponseDataCityBoundingBoxRelation {
  type: 'relation';
  id: number; // 3602793104,
  bounds: {
    minlat: number; // 48.6920188,
    minlon: number; // 9.0386007,
    maxlat: number; // 48.8663994,
    maxlon: number; // 9.3160228
  };
  members: (
    | {
        type: 'node';
        ref: number;
        role: 'admin_centre';
      }
    | {
        type: 'way';
        ref: number;
        role: 'outer';
      }
  )[];
}

export interface OverpassApiResponseDataCityBoundingBoxObject {
  type: string;
  id: number;
}

export interface OverpassApiResponseDataCityBoundingBoxWay
  extends OverpassApiResponseDataCityBoundingBoxObject {
  type: 'way';
  bounds: {
    minlat: number; // 48.6920188,
    minlon: number; // 9.0386007,
    maxlat: number; // 48.8663994,
    maxlon: number; // 9.3160228
  };
  nodes: number[];
  geometry: {lat: number; lon: number}[];
  tags: {
    'addr:city': string; // "London",
    'addr:housenumber': string; // "21",
    'addr:postcode': string; // "E14 9WE",
    'addr:street': string; // "Severnake Close",
    building: string; // "house",
  };
}

export interface OverpassApiResponseDataCityBoundingBoxNode
  extends OverpassApiResponseDataCityBoundingBoxObject {
  type: 'node';
  lat: number;
  lon: number;
  tags: {
    'addr:city': string; // "London",
    'addr:housenumber': string; // "21",
    'addr:postcode': string; // "E14 9WE",
    'addr:street': string; // "Severnake Close",
    name: string; // "Ladywell Center",
  };
}
export interface OverpassApiResponseDataCityPlace {
  lat: number;
  lon: number;
  city: string;
  housenumber: string;
  postcode: string;
  street: string;
  name?: string;
}
