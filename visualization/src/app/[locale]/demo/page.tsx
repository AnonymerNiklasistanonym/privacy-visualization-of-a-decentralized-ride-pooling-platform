'use server';

// Local imports
import {ComponentCollectionGreeting} from './demo';
// > Services
import {createLoggerSection} from '@services/logging';

const logger = createLoggerSection('Demo');

export default async function Demo() {
  logger.debug('GET /demo');
  return <ComponentCollectionGreeting />;
}
