// Package imports
import {NextResponse} from 'next/server';
// Local imports
import {createLoggerSection} from '@services/logging';

const logger = createLoggerSection('Running');

/** (docker-compose) API route to indicate that the server is running  */
export async function GET() {
  logger.debug('GET /running');
  return NextResponse.json({message: 'SUCCESS'}, {status: 200});
}
