// Package imports
import {promises as fs} from 'fs';
import path from 'path';

export const fileExists = (filePath: string): Promise<boolean> =>
  fs
    .access(filePath, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);

export const getParentDir = (filePath: string) =>
  path.basename(path.dirname(filePath));
