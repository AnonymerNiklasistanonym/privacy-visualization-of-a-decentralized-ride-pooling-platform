// Package imports
import fs from 'fs/promises';
import path from 'path';
// Local imports
// > Globals
import {cacheWrapper} from 'lib_globals_fs';
// > Libs
import {overpassApiRequest} from '../../lib/overpass';
// > Services
import {createLoggerSection} from '../../services/logging';
// Type imports
import type {Coordinates, PartialRecord, WithRequired} from 'lib_globals';
import type {
  OverpassApiResponse,
  OverpassApiResponseElementNode,
  OverpassApiResponseElementRelation,
  OverpassApiResponseElementWay,
  OverpassApiResponseElements,
  TagsNodesRelevant,
  TagsWaysRelevant,
} from '../../lib/overpass';

const logger = createLoggerSection('overpass');

export const overpassCachedRequest = async <JsonResponseType extends {}>(
  query: string,
  cacheFilePath: string,
  ignoreCache = false
): Promise<OverpassApiResponse<JsonResponseType>> =>
  cacheWrapper.getJsonCacheWrapper(
    () => {
      logger.info(`cache web request ${cacheFilePath} (${query})`);
      return overpassApiRequest<JsonResponseType>(query);
    },
    cacheFilePath,
    {
      callbackUseCache: () => {
        logger.debug(`use cached web request ${cacheFilePath} (${query})`);
      },
      ignoreCache,
    }
  );

export const bboxToOverpassString = (
  minLat: number,
  minLong: number,
  maxLat: number,
  maxLong: number
) => [minLat, minLong, maxLat, maxLong].join(',');

export const overpassRequestBbDataCity = async (
  city: string,
  countryCode: string,
  cacheDir: string,
  ignoreCache = false
): Promise<OverpassRequestBbData> => {
  logger.debug(`get city data for ${city} (${countryCode})`);
  const requestBbRelationCachePath = path.join(
    cacheDir,
    `cache_${city}_bb_relation.json`
  );
  const requestBbRelation = await overpassCachedRequest<OverpassCityBoundsData>(
    getCityBoundsQuery(countryCode, city),
    requestBbRelationCachePath,
    ignoreCache
  );
  const boundingBoxRelations = requestBbRelation.elements.filter(
    (a): a is WithRequired<OverpassApiResponseElementRelation, 'bounds'> =>
      a.type === 'relation' && a.bounds !== undefined
  );
  if (boundingBoxRelations.length === 0) {
    fs.rm(requestBbRelationCachePath);
    throw Error(`Fetched city data is bad "${city}" (${countryCode})`);
  }
  return overpassRequestBbData(
    {
      maxLat: boundingBoxRelations[0].bounds.maxlat,
      maxLong: boundingBoxRelations[0].bounds.maxlon,
      minLat: boundingBoxRelations[0].bounds.minlat,
      minLong: boundingBoxRelations[0].bounds.minlon,
    },
    cacheDir,
    ignoreCache
  );
};

export interface OverpassRequestBbDataElement {
  /** The unique element ID */
  id: number;
}

export interface OverpassRequestBbDataNode
  extends Coordinates,
    OverpassRequestBbDataElement {}

export interface OverpassRequestBbDataWay extends OverpassRequestBbDataElement {
  /** List of node IDs that define this way */
  nodes: Array<number>;
}

export interface OverpassRequestBbDataBuilding
  extends Coordinates,
    OverpassRequestBbDataElement {
  tags: PartialRecord<string, TagsWaysRelevant, 'building'>;
}

export interface OverpassRequestBbData {
  /** The way nodes (for the pathfinder algorithm) in the bounding box */
  wayNodes: Array<OverpassRequestBbDataNode>;
  /** The ways (for the pathfinder algorithm) in the bounding box */
  ways: Array<OverpassRequestBbDataWay>;
  /** The computed building locations of actual places in the bounding box */
  buildings: Array<OverpassRequestBbDataBuilding>;
  /** The middle of the bounding box */
  startPos: Coordinates;
}

export interface LocationBoundingBox {
  minLat: number;
  maxLat: number;
  minLong: number;
  maxLong: number;
}

export const overpassGetBuildingName = (
  a: Readonly<OverpassRequestBbDataBuilding>
) => {
  const addressList = [
    a.tags['addr:country'],
    a.tags['addr:state'],
    a.tags['addr:postcode'],
    a.tags['addr:city'],
    a.tags['addr:town'],
    a.tags['addr:street'],
    a.tags['addr:housenumber'],
    a.tags['addr:housename'],
    a.tags.name !== undefined ? `(${a.tags.name})` : undefined,
    a.tags.building !== 'yes' ? `[${a.tags.building}]` : undefined,
  ].filter(a => a !== undefined);
  if (addressList.length > 0) {
    return addressList.join(' ');
  }
  return undefined;
};

export const overpassRequestBbData = async (
  locationBoundingBox: Readonly<LocationBoundingBox>,
  cacheDir: string,
  ignoreCache = false
): Promise<OverpassRequestBbData> => {
  const boundingBox = bboxToOverpassString(
    locationBoundingBox.minLat,
    locationBoundingBox.minLong,
    locationBoundingBox.maxLat,
    locationBoundingBox.maxLong
  );
  logger.debug(`request bounding box data for ${boundingBox}`);

  const requestBbWays = await overpassCachedRequest<OverpassGetWaysQueryData>(
    getWaysQueryBB(boundingBox),
    path.join(cacheDir, `cache_${boundingBox}_bb_ways.json`),
    ignoreCache
  );

  const requestBbPlaces =
    await overpassCachedRequest<OverpassGetPlacesQueryData>(
      getPlacesQueryBB(boundingBox),
      path.join(cacheDir, `cache_${boundingBox}_bb_places.json`),
      ignoreCache
    );

  analyzeApiResponse(`bb_${boundingBox}_ways`, requestBbWays);

  analyzeApiResponse(`bb_${boundingBox}_places`, requestBbPlaces);

  const nodeMapPlaces = new Map<number, Coordinates>(
    requestBbPlaces.elements
      .filter((a): a is OverpassApiResponseElementNode => a.type === 'node')
      .map<[number, Coordinates]>(a => [
        a.id,
        {
          lat: a.lat,
          long: a.lon,
        },
      ])
  );

  type hasBuilding = WithRequired<
    OverpassApiResponseElementWay<TagsWaysRelevant, 'building'>,
    'tags'
  >;

  return {
    buildings: requestBbPlaces.elements
      .filter(
        (a): a is OverpassApiResponseElementWay<TagsWaysRelevant> =>
          a.type === 'way'
      )
      .filter(
        (a): a is hasBuilding =>
          a.tags !== undefined && a.tags?.building !== undefined
      )
      .map<[hasBuilding, Array<undefined | Coordinates>]>(a => [
        a,
        a.nodes.map((b: number) => nodeMapPlaces.get(b)),
      ])
      .filter(
        (a): a is [hasBuilding, Array<Coordinates>] =>
          a[1].filter(b => b !== undefined).length > 0
      )
      .map<OverpassRequestBbDataBuilding>(([a, coordinates]) => ({
        ...coordinates[0],
        id: a.id,
        tags: a.tags,
      })),
    startPos: {
      lat:
        (locationBoundingBox.maxLat - locationBoundingBox.minLat) / 2 +
        locationBoundingBox.minLat,
      long:
        (locationBoundingBox.maxLong - locationBoundingBox.minLong) / 2 +
        locationBoundingBox.minLong,
    },
    wayNodes: requestBbWays.elements
      .filter(
        (a): a is OverpassApiResponseElementNode<TagsNodesRelevant> =>
          a.type === 'node'
      )
      .map<OverpassRequestBbDataNode>(a => ({
        id: a.id,
        lat: a.lat,
        long: a.lon,
      })),
    ways: requestBbWays.elements
      .filter(
        (a): a is OverpassApiResponseElementWay<TagsWaysRelevant> =>
          a.type === 'way'
      )
      .map<OverpassRequestBbDataWay>(a => ({
        id: a.id,
        nodes: a.nodes,
      })),
  };
};

export const analyzeApiResponse = <TAGS extends string = string>(
  name: string,
  responseData: OverpassApiResponse<
    ReadonlyArray<OverpassApiResponseElements<TAGS>>
  >
): void => {
  const countNodes = responseData.elements.filter(
    a => a.type === 'node'
  ).length;
  const countWays = responseData.elements.filter(a => a.type === 'way').length;
  const a: Record<string, string> = {};
  a.test = 'true';
  const buildings = responseData.elements.filter(
    a =>
      a.tags !== undefined &&
      'building' in a.tags &&
      a.tags.building !== undefined
  );
  const buildingTypes = new Set<string>(
    buildings
      .filter(
        a =>
          a.tags !== undefined &&
          'building' in a.tags &&
          typeof a.tags.building === 'string'
      )
      .map(
        a =>
          (a.tags as unknown as Record<string, string>)
            .building as unknown as string
      )
  );
  const tagCountNodes = responseData.elements.filter(
    a => a.type === 'node' && a.tags !== undefined
  ).length;
  const tagCountWays = responseData.elements.filter(
    a => a.type === 'way' && a.tags !== undefined
  ).length;
  const tagTypesNodes = new Set(
    responseData.elements
      .filter(a => a.type === 'node')
      .flatMap(a => (a.tags !== undefined ? Object.keys(a.tags) : []))
  );
  const tagTypesWays = new Set(
    responseData.elements
      .filter(a => a.type === 'way')
      .flatMap(a => (a.tags !== undefined ? Object.keys(a.tags) : []))
  );
  const countBuildings = buildings.length;

  const countLocationNodes = responseData.elements.filter(
    a => a.type === 'node' && a.lat !== undefined && a.lon !== undefined
  ).length;

  if (process.env.NODE_ENV !== 'production') {
    try {
      fs.writeFile(
        path.join(process.cwd(), `delete_${name}_analyze.json`),
        JSON.stringify(
          {
            ...responseData,
            elements: {
              nodes: responseData.elements
                .filter(a => a.type === 'node')
                .slice(0, 20),
              ways: responseData.elements
                .filter(a => a.type === 'way')
                .slice(0, 20),
            },
          },
          undefined,
          4
        )
      );
    } catch (err) {
      logger.error(err as Error);
    }
  }

  const getTypescriptStringType = (list: Array<string>) =>
    list
      .sort()
      .map(a => `'${a}'`)
      .join(' | ');

  logger.debug(name, {
    countNodes,
    countWays,

    countBuildings,
    countLocationNodes,

    tagCountNodes,
    tagCountWays,

    buildingTypes: getTypescriptStringType(Array.from(buildingTypes)),
    tagTypesNodes: getTypescriptStringType(Array.from(tagTypesNodes)),
    tagTypesWays: getTypescriptStringType(Array.from(tagTypesWays)),
  });
};

/**
 * https://overpass-turbo.eu/?Q=%5Bout%3Ajson%5D%5Btimeout%3A90%5D%3B%0A%28area%5B%22ISO3166-1%3Aalpha2%22%3D%22US%22%5D%3B%29+-%3E.a%3B%0Arel%5Bname%3D%22Stuttgart%22%5D%28area.a%29%3B%0A%28._%3B%3E%3B%29%3B%0Aout+bb%3B&C=34.496795%3B-91.477146%3B12
 */
export type OverpassCityBoundsData = Array<
  | OverpassApiResponseElementNode
  | OverpassApiResponseElementWay
  | WithRequired<OverpassApiResponseElementRelation, 'bounds'>
>;

/**
 * Get the relation of a city that contains the city bounds.
 * @example getCityBoundsQuery('de', 'Stuttgart');
 */
export const getCityBoundsQuery = (countryCode: string, city: string) =>
  `(area["ISO3166-1:alpha2"="${countryCode}"];) ->.a;` +
  `rel[name="${city}"](area.a);` +
  '(._;>;);' +
  'out bb;';

/**
 * https://overpass-turbo.eu/?q=W291dDpqc29uXVt0aW1lxIHEgzkwXTsKKHdheVsiaGlnaMSXeSLEiSJhcmVhIiF-Inllc8SixJphY2PErsSvxKoicHJpdmF0ZcSwxJvEncSfxJjEqcSrYWJhbmTEh2VkfGLEumRsZcSgxY91c19ndWlkxZTEmHxjxIdzdHJ1Y8SLxIfFoG9yxZHFq8WgeWPFk8WVZcWTxLx0xa7ErmNhbMS9xa5mb290xZVub3xwxL1oxobFjcSuxaRpxYnGhsW8bm7FjcaQxL3Fv3JtxoZyb3Bvc8aUcsSyxZ55fMahesaUxp9ydmnEtHzFo2Vwc3zFpMSya8WAbcaBxatfdmXEnMWxxL_Et8aExrfGuXLFunLFhSLHgsSjxqnGq8S0x4jFu8WTxqRkxLrGvMWzxI1yZ2VuY3lfxLLEtHPGssaHcmtpbmfGhsSlx6XHp8eeaXPFk8aaxLvEvcS_XSh7e2Jib3h9fSk7PjvHv8SPOw&c=AnO0zBRs5S
 */
export type OverpassGetWaysQueryData = Array<
  OverpassApiResponseElements<TagsNodesRelevant, TagsWaysRelevant>
>;

/**
 * Get all streets in a given bounding box (contains all streets as ways and all the nodes that are referenced by the ways).
 */
export const getWaysQueryBB = (boundingBox: string) =>
  `(way["highway"]["area"!~"yes"]["access"!~"private"]["highway"!~"abandoned|bridleway|bus_guideway|construction|corridor|cycleway|elevator|escalator|footway|no|path|pedestrian|planned|platform|proposed|raceway|razed|service|steps|track"]["motor_vehicle"!~"no"]["motorcar"!~"no"]["service"!~"alley|driveway|emergency_access|parking|parking_aisle|private"](${boundingBox});>;);` +
  'out;';

/**
 * https://overpass-turbo.eu/?Q=%5Bout%3Ajson%5D%5Btimeout%3A90%5D%3B%0A%28way%5B%22building%22%5D%5B%22addr%3Ahousenumber%22%21%7E%22true%22%5D%28%7B%7Bbbox%7D%7D%29%3B%3E%3B%29%3Bout%3B&C=41.548733%3B-84.143024%3B18
 */
export type OverpassGetPlacesQueryData = Array<
  OverpassApiResponseElements<TagsNodesRelevant, TagsWaysRelevant>
>;

/**
 * Get all buildings in a given bounding box (contains all buildings as ways and all the nodes that are referenced by the ways).
 */
export const getPlacesQueryBB = (boundingBox: string) =>
  `(way["building"]["addr:housenumber"!~"true"](${boundingBox});>;);` + 'out;';
