'use client';

import {FormattedMessage} from 'react-intl';
import FooterContainer from './FooterContainer';
// Type imports
import type {FC} from 'react';
import type {DefaultPropsI18n} from '@/types/reactProps';

const Footer: FC<DefaultPropsI18n> = ({locale}) => {
  return (
    <FooterContainer locale={locale}>
      <div>
        {/* eslint-disable-next-line */}
        <img src="/img/next.svg" width={60} height={12} alt="NextJS " />
      </div>
      <div>
        <FormattedMessage tagName="p" id="common.footer" />
      </div>
    </FooterContainer>
  );
};

export default Footer;
