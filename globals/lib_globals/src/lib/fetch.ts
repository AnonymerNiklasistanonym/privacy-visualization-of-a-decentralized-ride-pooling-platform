import type {FetchOptions} from '../types/fetch';

export async function fetchGeneric(
  url: string,
  options?: Readonly<FetchOptions>
): Promise<Response> {
  let response: Response;
  if (options?.timeoutInMs !== undefined) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), options?.timeoutInMs);
    response = await fetch(url, {
      ...options?.fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(id);
  } else {
    response = await fetch(url, {
      ...options?.fetchOptions,
    });
  }
  return response;
}

export async function fetchJson<T>(
  url: string,
  options?: Readonly<FetchOptions>
): Promise<T> {
  const response = await fetchGeneric(url, options);
  return response.json() as T;
}

export async function fetchText(
  url: string,
  options?: Readonly<FetchOptions>
): Promise<string> {
  const response = await fetchGeneric(url, options);
  return response.text();
}
