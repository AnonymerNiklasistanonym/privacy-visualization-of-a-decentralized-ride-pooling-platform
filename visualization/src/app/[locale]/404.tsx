'use server';

// TODO Feature [no priority]: Currently this is seemingly not being used -> find out why

// Local imports
// > Components
import CollectionError from '@components/Collections/CollectionError';
// > Services
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
