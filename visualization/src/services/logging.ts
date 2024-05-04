// Local imports
import {logDir} from '../../logger-config';
// > Globals
import {
  LoggerLevel,
  createLogger,
  createLoggerSections,
} from '@globals/lib/logging';

export const loggerVisualization = createLogger(
  'visualization',
  logDir,
  LoggerLevel.INFO,
  LoggerLevel.DEBUG
);

export const createLoggerSection = (section: string, subsection?: string) =>
  createLoggerSections(loggerVisualization, section, subsection);
