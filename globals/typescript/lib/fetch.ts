export interface FetchJsonOptions {
  showFetch?: boolean;
  showResponse?: boolean;
}

export const fetchJson = async <T>(
  url: string,
  options?: FetchJsonOptions
): Promise<T> => {
  if (options?.showFetch) {
    console.info(`fetch ${url} ...`);
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
