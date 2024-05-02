// Package imports
import path from 'path';
// Local imports
// > Globals
import {
  LoggerLevel,
  createLogFunc,
  createLogger as createLoggerGlobals,
} from '../globals/lib/logging';

const logDir = process.env.LOG_DIR ?? path.join(__dirname, '..', '..', 'logs');

export const loggerVisualization = createLoggerGlobals(
  'simulation',
  logDir,
  LoggerLevel.INFO,
  LoggerLevel.DEBUG
);

export const createLoggerSection = (section: string, subsection?: string) =>
  createLogFunc(loggerVisualization, section, subsection);
