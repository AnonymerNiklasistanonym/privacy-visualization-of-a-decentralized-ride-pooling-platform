// This file was copied from the global types directory, do not change!

// Local imports
import {baseUrlSimulation} from '../defaults/urls';

export interface FetchJsonOptions {
  showFetch?: boolean;
  showResponse?: boolean;
}

export const fetchJson = async <T>(
  url: string,
  options?: FetchJsonOptions
): Promise<T> => {
  if (options?.showFetch) {
    console.info(`fetch ${url}...`);
  }
  const response = await fetch(url);
  const result = response.json() as T;
  if (options?.showResponse) {
    console.info(`fetched ${url}`, result);
  }
  return result;
};

export const fetchText = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const result = response.text();
  return result;
};

export const fetchJsonSimulation = async <T>(
  endpoint: string,
  options?: FetchJsonOptions
): Promise<T> => fetchJson<T>(`${baseUrlSimulation}/${endpoint}`, options);

export const fetchTextSimulation = async (endpoint: string): Promise<string> =>
  fetchText(`${baseUrlSimulation}/${endpoint}`);
