// Package imports
import path from 'path';
// Local imports
// > Globals
import {logging} from 'lib_globals_fs';
// Type imports
import type {Logger} from 'winston';

const logDir = process.env.LOG_DIR ?? path.join(__dirname, '..', '..', 'logs');

export const loggerVisualization: Logger = logging.createLogger(
  'simulation',
  logDir,
  logging.LoggerLevel.INFO,
  logging.LoggerLevel.DEBUG
);

export const createLoggerSection = (section: string, subsection?: string) =>
  logging.createLoggerSections(loggerVisualization, section, subsection);

export const loggerPathfinder: Logger = logging.createLogger(
  'pathfinder',
  logDir,
  logging.LoggerLevel.INFO,
  logging.LoggerLevel.DEBUG
);

export const createLoggerPathfinderSection = (
  section: string,
  subsection?: string
) => logging.createLoggerSections(loggerPathfinder, section, subsection);
