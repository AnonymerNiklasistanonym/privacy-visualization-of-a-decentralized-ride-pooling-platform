// Package imports
import fs from 'fs/promises';

export const fileExists = (file: string): Promise<boolean> =>
  fs
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
