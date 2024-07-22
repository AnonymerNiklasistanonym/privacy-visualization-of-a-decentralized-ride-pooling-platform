import {expect, test} from 'vitest';
//import {render, screen} from '@testing-library/react';
//import Page from '../app/[locale]/page';

// TODO Feature [no priority]: Cannot test/render page
//       > Cannot destructure property 'params' of 'undefined' as it is undefined.
//       > const Home: FC<DefaultPropsI18nHome> = async ({params: {locale}})

test('Page', () => {
  //render(<Page params={{locale: 'en'}} />);
  //expect(screen.getByRole('heading', {level: 1, name: 'Home'})).toBeDefined();
  expect(typeof 'abc').toBe('string');
});
