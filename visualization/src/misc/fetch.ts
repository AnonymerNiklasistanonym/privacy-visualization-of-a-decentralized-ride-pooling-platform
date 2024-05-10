// Local imports
// > Globals
import {fetchJson, fetchText} from '@globals/lib/fetch';
// Type imports
import type {FetchOptions} from '@globals/lib/fetch';
import type {ReactState} from './react';

export const fetchJsonEndpoint = async <T>(
  baseUrl: ReactState<string>,
  endpoint: string,
  options?: FetchOptions
): Promise<T> => fetchJson<T>(`${baseUrl}${endpoint}`, options);

export const fetchTextEndpoint = async (
  baseUrl: ReactState<string>,
  endpoint: string
): Promise<string> => fetchText(`${baseUrl}${endpoint}`);
