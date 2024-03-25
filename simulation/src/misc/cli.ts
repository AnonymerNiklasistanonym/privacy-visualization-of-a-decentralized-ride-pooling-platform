export const getCliOverride = <T>(flag: string, defaultValue: T) => {
  const overrideIndex = process.argv.indexOf(flag);
  if (overrideIndex > -1 && overrideIndex + 1 < process.argv.length) {
    return process.argv[overrideIndex + 1];
  }
  return defaultValue;
};
