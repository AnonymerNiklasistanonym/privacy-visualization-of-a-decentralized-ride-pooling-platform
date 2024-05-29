'use client';

// Package imports
import {useIntl} from 'react-intl';
// > Components
import {Breadcrumbs} from '@mui/material';
// Local imports
import FooterContainer from './FooterContainer';
import StyledBreadcrumb from './StyledBreadcrumb';
// Type imports
import type {ReactPropsI18n} from '@misc/react';

export function FooterBreadcrumbs() {
  const intl = useIntl();
  return (
    <Breadcrumbs sx={{marginTop: '15rem'}}>
      {intl
        .formatMessage({id: 'common.footer'})
        .split(' > ')
        .map((a, index) => (
          <StyledBreadcrumb key={index} component="p" label={a} />
        ))}
    </Breadcrumbs>
  );
}

export default function Footer({locale, messages}: ReactPropsI18n) {
  return (
    <FooterContainer locale={locale} messages={messages}>
      <FooterBreadcrumbs />
    </FooterContainer>
  );
}
