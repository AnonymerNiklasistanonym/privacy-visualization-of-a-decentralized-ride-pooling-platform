// Local imports
import {logDir} from '../../logger-config';
// > Globals
import {logging} from 'lib_globals_fs';

export const loggerVisualization = logging.createLogger(
  'visualization',
  logDir,
  logging.LoggerLevel.INFO,
  logging.LoggerLevel.DEBUG
);

export const createLoggerSection = (section: string, subsection?: string) =>
  logging.createLoggerSections(loggerVisualization, section, subsection);
