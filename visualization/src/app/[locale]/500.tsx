// Local imports
// > Logging
import {createLoggerSection} from '@services/logging';

const logger = createLoggerSection('500');

export default function Custom500() {
  logger.debug('500');
  return <h1>500 - Server-side error occurred</h1>;
}
