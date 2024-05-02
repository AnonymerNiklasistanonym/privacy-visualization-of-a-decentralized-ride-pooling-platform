// Local imports
import {logDir} from '../../logger-config';
// > Globals
import {
  LoggerLevel,
  createLogFunc,
  createLogger as createLoggerGlobals,
} from '@globals/lib/logging';

export const loggerVisualization = createLoggerGlobals(
  'visualization',
  logDir,
  LoggerLevel.INFO,
  LoggerLevel.DEBUG
);

export const createLoggerSection = (section: string, subsection?: string) =>
  createLogFunc(loggerVisualization, section, subsection);
