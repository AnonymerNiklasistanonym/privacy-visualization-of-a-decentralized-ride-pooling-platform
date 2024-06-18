export const debug = Object.freeze({
  /** Log component updates */
  componentUpdates: process.env.NODE_ENV === 'development',
  /** Show generic logs */
  logs: process.env.NODE_ENV === 'development',
  /** Use custom memo helper */
  useMemoHelper: true,
});

const debugComponentUpdateCounter = new Map<string, number>();

export function debugComponentUpdate(name: string, date = false) {
  if (debug.componentUpdates) {
    const count = debugComponentUpdateCounter.get(name) ?? 0;
    debugComponentUpdateCounter.set(name, count + 1);
    console.log(
      `Render component ${name} (${count})${
        date ? ' ' + new Date().toLocaleTimeString() : ''
      }`
    );
  }
}


export function debugMemoHelper<T, TYPE = Record<keyof T, unknown>>(
  /** Component name */
  name: string,
  /** Keys to check */
  keys: ReadonlyArray<
    | keyof TYPE
    | [
        keyof TYPE,
        // Compare single element of array
        (prev: Readonly<unknown>, next: Readonly<unknown>) => boolean,
        // Optional sorting function
        (
          | ((
              elementA: Readonly<unknown>,
              elementB: Readonly<unknown>
            ) => 0 | 1 | -1)
          | undefined
        ),
      ]
  >,
  /** Previous version */
  prev: Readonly<TYPE>,
  /** Next version */
  next: Readonly<TYPE>
) {
  if (!debug.useMemoHelper) {
    return Object.is(prev, next);
  }
  for (const key of keys) {
    if (Array.isArray(key)) {
      const prevElementsTemp = prev[key[0]];
      const nextElementsTemp = next[key[0]];
      if (Array.isArray(prevElementsTemp) && Array.isArray(nextElementsTemp)) {
        if (prevElementsTemp.length !== nextElementsTemp.length) {
          console.log(
            `Memo component ${name} key '${String(
              key[0]
            )}' not the same because arrays differ in length`
          );
          return false;
        }
        // Copy and sort object to not change the original array
        const prevElements = prevElementsTemp.slice();
        const nextElements = nextElementsTemp.slice();
        if (key[2] !== undefined) {
          prevElements.sort(key[2]);
          nextElements.sort(key[2]);
        }
        for (let i = 0; i < prevElements.length; i++) {
          if (!key[1](prevElements[i], nextElements[i])) {
            const index = i;
            console.log(
              `Memo component ${name} key '${String(
                key[0]
              )}'[${index}] not the same because '${JSON.stringify(
                prevElements[index]
              )}' !== '${JSON.stringify(nextElements[index])}'`
            );
            return false;
          }
        }
      } else {
        console.log(
          `Memo component ${name} key '${String(
            key[0]
          )}' not the same because one of them not an array`
        );
        return false;
      }
    } else if (prev[key] !== next[key]) {
      if (debug.componentUpdates) {
        console.log(
          `Memo component ${name} key '${String(key)}' not the same because '${
            prev[key]
          }' !== '${next[key]}'`
        );
      }
      return false;
    }
  }
  return true;
}
