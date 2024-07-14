export const debug = Object.freeze({
  /** Log component updates */
  componentUpdates: false, //process.env.NODE_ENV === 'development',
  /** Show generic logs */
  logs: process.env.NODE_ENV === 'development',
  /** Use custom memo helper */
  useMemoHelper: true,
});

export const debugComponentUpdateCounter = new Map<string, number>();

export function debugComponentRender(name: string, date = false) {
  const count = debugComponentUpdateCounter.get(name) ?? 0;
  debugComponentUpdateCounter.set(name, count + 1);
  if (debug.componentUpdates) {
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
  keys:
    | ReadonlyArray<
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
      >
    | undefined,
  /** Previous version */
  prev: Readonly<TYPE>,
  /** Next version */
  next: Readonly<TYPE>
) {
  const defaultCompare = Object.is(prev, next);
  if (!debug.useMemoHelper) {
    return defaultCompare;
  }
  if (keys === undefined) {
    if (defaultCompare) {
      return true;
    }
    if (typeof prev !== 'object' || typeof next !== 'object') {
      console.log(
        `Memo component ${name} not an object but different`,
        prev,
        '!==',
        next
      );
      return defaultCompare;
    }
    const keyList = [...Object.keys(prev), ...Object.keys(next)];
    for (const key of keyList) {
      const prevValue = Object.hasOwn(prev, key)
        ? (prev as {[key: string]: any})[key]
        : undefined;
      const nextValue = Object.hasOwn(next, key)
        ? (next as {[key: string]: any})[key]
        : undefined;
      const sameObject = Object.is(prevValue, nextValue);
      if (!sameObject) {
        console.log(
          `Memo component ${name} key '${key}' not the same`,
          prevValue,
          '!==',
          nextValue
        );
        return false;
      }
    }
    return true;
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
            )}' not the same because arrays differ in length`,
            prevElementsTemp,
            '!==',
            nextElementsTemp
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
              )}'[${index}] not the same because`,
              prevElements[index],
              '!==',
              nextElements[index]
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
          `Memo component ${name} key '${String(key)}' not the same because`,
          prev[key],
          '!==',
          next[key]
        );
      }
      return false;
    }
  }
  return true;
}
