// Local imports
// > Globals
import {fetch} from 'lib_globals';
// Type imports
import type {FetchOptions} from 'lib_globals';
import type {ReactState} from './react';

export const fetchJsonEndpoint = async <T>(
  baseUrl: ReactState<string>,
  endpoint: string,
  options?: FetchOptions
): Promise<T> => fetch.fetchJson<T>(`${baseUrl}${endpoint}`, options);

export const fetchTextEndpoint = async (
  baseUrl: ReactState<string>,
  endpoint: string
): Promise<string> => fetch.fetchText(`${baseUrl}${endpoint}`);
