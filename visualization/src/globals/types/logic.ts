// This file was copied from the global types directory, do not change!

/** Require optional keys in an interface. */
export type WithRequired<T, REQUIRED_KEYS extends keyof T> = T &
  Required<Pick<T, REQUIRED_KEYS>>;

/** Define a record with specific optional (/required) keys. */
export type PartialRecord<
  T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  OPTIONAL_KEYS extends keyof any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  REQUIRED_KEYS extends keyof any = never,
> = {
  [P in OPTIONAL_KEYS]?: T;
} & {
  [P in REQUIRED_KEYS]: T;
};
