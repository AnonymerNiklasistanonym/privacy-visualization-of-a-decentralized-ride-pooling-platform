// Package imports
import {promises as fs} from 'fs';
// Local imports
import {fileExists, getParentDir} from './files';

export interface GetJsonCacheWrapperOptions {
  callbackUseCache?: () => void | Promise<void>;
  ignoreCache?: boolean;
}

export async function getJsonCacheWrapper<DATA_TYPE>(
  getData: () => DATA_TYPE | Promise<DATA_TYPE>,
  cacheFilePath: string,
  options?: Readonly<GetJsonCacheWrapperOptions>
): Promise<DATA_TYPE> {
  if ((await fileExists(cacheFilePath)) && options?.ignoreCache !== true) {
    if (options?.callbackUseCache !== undefined) {
      await options.callbackUseCache();
    }
    const content = await fs.readFile(cacheFilePath, {encoding: 'utf-8'});
    return JSON.parse(content) as DATA_TYPE;
  }
  const data = await getData();
  await fs.mkdir(getParentDir(cacheFilePath), {recursive: true});
  await fs.writeFile(cacheFilePath, JSON.stringify(data));
  return data;
}
