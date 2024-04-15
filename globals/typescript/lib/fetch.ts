import {ports} from '../defaults/ports';

export const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  const result = response.json() as T;
  return result;
};

export const fetchText = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const result = response.text();
  return result;
};

export const baseUrlSimulation = `http://localhost:${ports.simulation}`

export const fetchJsonSimulation = async <T>(endpoint: string): Promise<T> =>
  fetchJson<T>(`${baseUrlSimulation}/${endpoint}`);

export const fetchTextSimulation = async (endpoint: string): Promise<string> =>
  fetchText(`${baseUrlSimulation}/${endpoint}`);
