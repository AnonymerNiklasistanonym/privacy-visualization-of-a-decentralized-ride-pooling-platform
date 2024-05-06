// Local imports
// > Globals
import {fetchJson} from '../../globals/lib/fetch';
// > Services
import {createLoggerSection} from '../../services/logging';
// Type imports
import type {OverpassApiResponse} from './overpassApi';

const logger = createLoggerSection('lib', 'overpass');

const baseUrlOverpassApi = 'https://overpass-api.de/api/interpreter';

/** Overpass API prefix to get a JSON response and timeout after 90ms */
const overpassApiPrefixJsonTimeout = '[out:json][timeout:90];';

export const overpassApiRequest = async <JsonResponseType>(
  query: string
): Promise<OverpassApiResponse<JsonResponseType>> => {
  const method = 'POST';
  const body = `data=${encodeURIComponent(
    `${overpassApiPrefixJsonTimeout}${query}`
  )}`;
  logger.info(`fetch ${method} ${baseUrlOverpassApi} body=${body}...`);
  return fetchJson<OverpassApiResponse<JsonResponseType>>(baseUrlOverpassApi, {
    fetchOptions: {
      // The body contains the query
      // to understand the query language see "The Programmatic Query Language" on
      // https://wiki.openstreetmap.org/wiki/Overpass_API#The_Programmatic_Query_Language_(OverpassQL)
      body,
      method,
    },
  });
};
