// Local imports
import {createLoggerSection} from '../services/logging';
import {fetchJson} from '../globals/lib/fetch';

const logger = createLoggerSection('nameFake');
const baseUrlNameFakeApi = 'https://api.namefake.com';

export const nameFakeRequest = (): Promise<NameFakeResponse> => {
  logger.debug(`fetch ${baseUrlNameFakeApi}`);
  return fetchJson<NameFakeResponse>(baseUrlNameFakeApi);
};

export interface NameFakeResponse {
  name: string; // 'Rhea McLaughlin';
  address: string; // '77408 Okuneva Springs\nEbertbury, SC 54223';
  latitude: number; // 36.595078;
  longitude: number; // -135.239646;
  maiden_name: string; // 'Ryan';
  birth_data: string; // '1961-10-28';
  phone_h: string; // '467.591.5535';
  phone_w: string; // '472.599.1398';
  email_u: string; // 'Landen99';
  email_d: string; // 'jetable.pp.ua';
  company: string; // 'Hills-Pacocha';
  pict: string; // '9female';
  url: string; // 'http://name-fake.com/english-united-states/female/46e52430e383f36e7365a502b5de7bb6';
}
