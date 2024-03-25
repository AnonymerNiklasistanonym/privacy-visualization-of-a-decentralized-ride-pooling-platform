import fs from 'fs/promises';
import path from 'path';

export const nameFakeRequest = async (): Promise<NameFakeResponse> => {
  const result = await fetch('https://api.namefake.com').then(
    data => data.json() as Promise<NameFakeResponse>
  );
  console.log(result);
  return result;
};

const checkFileExists = (file: string) =>
  fs
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);

export const nameFakeRequestOrCache = async (
  count: number,
  cacheDir: string,
  cacheFile: string
): Promise<NameFakeResponse[]> => {
  const requestCache = path.join(cacheDir, cacheFile);
  if (await checkFileExists(requestCache)) {
    console.debug(
      `Use cached file ${requestCache} instead of doing a web request`
    );
    const content = await fs.readFile(requestCache, {encoding: 'utf-8'});
    return JSON.parse(content) as NameFakeResponse[];
  }
  const requests = await Promise.all(
    [...Array(count).keys()].map(() => nameFakeRequest())
  );
  await fs.mkdir(cacheDir, {recursive: true});
  await fs.writeFile(requestCache, JSON.stringify(requests));
  console.debug(`Wrote web responses to cached file ${requestCache}`);
  return requests;
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
