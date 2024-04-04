export const getCliOverride = <T>(
  flag: string,
  defaultValue: T,
  updateValue: (value: string) => T
): T => {
  const overrideIndex = process.argv.indexOf(flag);
  if (overrideIndex > -1 && overrideIndex + 1 < process.argv.length) {
    return updateValue(process.argv[overrideIndex + 1]);
  }
  return defaultValue;
};

export const getCliFlag = (flag: string): boolean => {
  const overrideIndex = process.argv.indexOf(flag);
  return overrideIndex > -1;
};
