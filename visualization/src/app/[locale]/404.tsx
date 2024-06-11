'use server';

// TODO: Is not being used

// Local imports
// > Components
import CollectionError from '@components/Collections/CollectionError';
// > Logging
import {createLoggerSection} from '@services/logging';
// Type imports
import type {CollectionErrorProps} from '@components/Collections/CollectionError';

const code = '404';
const logger = createLoggerSection(code);

export default async function CustomErrorPage() {
  logger.debug(code);
  const props: CollectionErrorProps = {
    code,
    links: [{text: 'Go back home', url: '/'}],
    message: 'Page Not Found',
  };
  return <CollectionError {...props} />;
}
