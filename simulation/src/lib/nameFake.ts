// Local imports
// > Globals
import {fetchJson} from '../globals/lib/fetch';
// > Services
import {createLoggerSection} from '../services/logging';

const logger = createLoggerSection('lib', 'nameFake');

const baseUrlNameFakeApi = 'https://api.namefake.com';

export const nameFakeApiRequest = (): Promise<NameFakeApiResponse> => {
  logger.info(`fetch ${baseUrlNameFakeApi}`);
  return fetchJson<NameFakeApiResponse>(baseUrlNameFakeApi);
};

export interface NameFakeApiResponse {
  /** @example 'Rhea McLaughlin' */
  name: string;
  /** @example '77408 Okuneva Springs\nEbertbury, SC 54223' */
  address: string;
  /** @example 36.595078 */
  latitude: number;
  /** @example -135.239646 */
  longitude: number;
  /** @example 'Ryan' */
  maiden_name: string;
  /** @example '1961-10-28' */
  birth_data: string;
  /** @example '467.591.5535' */
  phone_h: string;
  /** @example '472.599.1398' */
  phone_w: string;
  /** @example 'Landen99' */
  email_u: string;
  /** @example 'jetable.pp.ua' */
  email_d: string;
  /** @example 'Hills-Pacocha' */
  company: string;
  /** @example '9female' */
  pict: string;
  /** @example 'http://name-fake.com/english-united-states/female/46e52430e383f36e7365a502b5de7bb6' */
  url: string;
}
