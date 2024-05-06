// Package imports
import path from 'path';
// Local imports
// > Globals
import {
  LoggerLevel,
  createLogger,
  createLoggerSections,
} from '../globals/lib/logging';

const logDir = process.env.LOG_DIR ?? path.join(__dirname, '..', '..', 'logs');

export const loggerVisualization = createLogger(
  'simulation',
  logDir,
  LoggerLevel.INFO,
  LoggerLevel.DEBUG
);

export const createLoggerSection = (section: string, subsection?: string) =>
  createLoggerSections(loggerVisualization, section, subsection);

export const loggerPathfinder = createLogger(
  'pathfinder',
  logDir,
  LoggerLevel.INFO,
  LoggerLevel.DEBUG
);

export const createLoggerPathfinderSection = (
  section: string,
  subsection?: string
) => createLoggerSections(loggerPathfinder, section, subsection);
