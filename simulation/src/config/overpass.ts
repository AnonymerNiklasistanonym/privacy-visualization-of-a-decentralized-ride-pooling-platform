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

export interface OverpassRequestCityDataType {
  node: OverpassApiResponseDataCityNode;
  area: OverpassApiResponseDataCityArea;
  boundingBoxRelation: OverpassApiResponseDataCityBoundingBoxRelation;
  places: OverpassApiResponseDataCityPlace[];
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

export interface OverpassApiResponseDataCityBoundingBoxWay {
  type: 'way';
  id: number; // 263066852,
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

export interface OverpassApiResponseDataCityBoundingBoxNode {
  type: 'node';
  id: number; // 263066852,
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
