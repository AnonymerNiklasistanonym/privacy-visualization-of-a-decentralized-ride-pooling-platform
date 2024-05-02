import path from 'path';

/** ENV ?? .next/server/logs/ */
export const logDir =
  process.env.LOG_DIR ?? path.join(__dirname, '..', '..', 'logs');
