// Type imports
import type {LoggerLevel} from '../lib/logging';

/**
 * The information the logger stores.
 */
export interface LoggerInformation {
  level: LoggerLevel | string;
  message: string;
  section?: string;
  service?: string;
  subsection?: string;
  timestamp?: string;
}

export type LoggerSectionsMethod = (
  ...messages: Array<string | boolean | number | Record<string, unknown>>
) => void;

/**
 * The log function object returned when creating a log function with section
 * information.
 */
export interface LoggerSections {
  debug: LoggerSectionsMethod;
  error: (err: Error) => void;
  info: LoggerSectionsMethod;
  verbose: LoggerSectionsMethod;
  warn: LoggerSectionsMethod;
}
