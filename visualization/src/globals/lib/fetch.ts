// This file was copied from the global types directory, do not change!

export interface FetchJsonOptions {
  fetchOptions?: Readonly<RequestInit>;
  timeoutInMs?: number;
}

export async function fetchJson<T>(
  url: string,
  options?: Readonly<FetchJsonOptions>
): Promise<T> {
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
  return response.json() as T;
}

export async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);
  return response.text();
}
