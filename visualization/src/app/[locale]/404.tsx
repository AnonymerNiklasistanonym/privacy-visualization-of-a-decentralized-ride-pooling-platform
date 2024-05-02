// Local imports
// > Logging
import {createLoggerSection} from '@services/logging';

const logger = createLoggerSection('404');

export default function Custom404() {
  logger.debug('404');
  return <h1>404 - Page Not Found</h1>;
}
