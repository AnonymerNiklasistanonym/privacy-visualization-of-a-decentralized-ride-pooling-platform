'use server';

// Local imports
import {ComponentCollectionButton} from './counter';
// > Services
import {createLoggerSection} from '@services/logging';

const logger = createLoggerSection('Counter');

export default async function Demo() {
  logger.debug('GET /counter');
  return <ComponentCollectionButton />;
}
