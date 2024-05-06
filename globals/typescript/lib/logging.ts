// Package imports
import {createLogger as createWinstonLogger, format, transports} from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
// Type imports
import type {Logger} from 'winston';

/**
 * The default log levels of the logger.
 */
export enum LoggerLevel {
  DEBUG = 'debug',
  ERROR = 'error',
  INFO = 'info',
  OFF = 'off',
  WARN = 'warn',
  VERBOSE = 'verbose',
}

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

/**
 * Function that formats the log output.
 * @param logInfo The information the logger provides.
 * @returns Parsed string.
 */
const logFormat = (logInfo: Readonly<LoggerInformation>): string => {
  if (logInfo.timestamp && logInfo.service) {
    if (logInfo.section) {
      if (logInfo.subsection) {
        return `[${logInfo.timestamp}] ${logInfo.service}#${logInfo.section}#${logInfo.subsection} ${logInfo.level}: ${logInfo.message}`;
      }
      return `[${logInfo.timestamp}] ${logInfo.service}#${logInfo.section} ${logInfo.level}: ${logInfo.message}`;
    }
    return `[${logInfo.timestamp}] ${logInfo.service} ${logInfo.level}: ${logInfo.message}`;
  }
  return `${logInfo.level}: ${logInfo.message}`;
};

/**
 * Create a global logger.
 * @param name The name of the logger.
 * @param logDir The directory to log to.
 * @param logLevelConsole The log level of the console logger.
 * @param logLevelFile The log level of the file logger.
 * @returns Logger.
 */
export const createLogger = (
  name: string,
  logDir: string,
  logLevelConsole = LoggerLevel.INFO,
  logLevelFile = LoggerLevel.DEBUG
): Logger =>
  createWinstonLogger({
    defaultMeta: {service: name},
    exitOnError: false,
    format: format.combine(
      format.errors({stack: true}),
      format.timestamp(),
      format.printf(logFormat)
    ),
    transports: [
      new DailyRotateFile({
        datePattern: 'YYYY-MM-DD-HH',
        dirname: logDir,
        filename: `${name.toLowerCase()}-%DATE%.log`,
        level: logLevelFile,
        maxFiles: '28d',
        maxSize: '100m',
        zippedArchive: false,
      }),
      new transports.Console({level: logLevelConsole}),
    ],
  });

/**
 * Create a global logger.
 * @param name The name of the logger.
 * @param logLevelConsole The log level of the console logger.
 * @returns Logger.
 */
export const createConsoleLogger = (
  name: string,
  logLevelConsole = LoggerLevel.INFO
): Logger =>
  createWinstonLogger({
    defaultMeta: {service: name},
    exitOnError: false,
    format: format.combine(
      format.errors({stack: true}),
      format.timestamp(),
      format.printf(logFormat)
    ),
    transports: [new transports.Console({level: logLevelConsole})],
  });

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

/**
 * Create a function that will log messages with a hardcoded section.
 * @param logger The logger.
 * @param section The section which the log function should log.
 * @param subsection Additional section information (subsection).
 * @returns Log function with hardcoded section.
 */
export const createLoggerSections = (
  logger: Readonly<Logger>,
  section: string,
  subsection?: string
): LoggerSections => {
  const baseLogFunc =
    (level: LoggerLevel): LoggerSectionsMethod =>
    (...messages) => {
      const message = messages
        .map(a => (typeof a === 'object' ? JSON.stringify(a) : a))
        .join(' ');
      logger.log({level, message, section, subsection});
    };
  return {
    debug: baseLogFunc(LoggerLevel.DEBUG),
    error: (err: Error) => {
      logger.log({
        error: err,
        level: LoggerLevel.ERROR,
        message: err.message,
        section,
        stack: err.stack,
        subsection,
      });
    },
    info: baseLogFunc(LoggerLevel.INFO),
    verbose: baseLogFunc(LoggerLevel.VERBOSE),
    warn: baseLogFunc(LoggerLevel.WARN),
  };
};
