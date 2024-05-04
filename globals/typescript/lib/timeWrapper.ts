export interface MeasureTimeWrapperStats {
  executionTimeInMS: number;
}

export const measureTimeWrapper = async <DATA_TYPE>(
  getData: (() => DATA_TYPE | Promise<DATA_TYPE>) | Promise<DATA_TYPE>,
  logMeasuredTime: (stats: Readonly<MeasureTimeWrapperStats>) => void
): Promise<DATA_TYPE> => {
  const start = performance.now();
  const result =
    typeof getData === 'function' ? await getData() : await getData;
  const end = performance.now();
  logMeasuredTime({
    executionTimeInMS: end - start,
  });
  return result;
};
