'use client';

// Package imports
import {useIntl} from 'react-intl';
// > Components
import {Box, Breadcrumbs} from '@mui/material';
// Local imports
import StyledBreadcrumb from './StyledBreadcrumb';
// Type imports
import type {ReactPropsI18n} from '@misc/react';
import TranslationWrapper from '@components/TranslationWrapper';

export function FooterBreadcrumbs() {
  const intl = useIntl();
  return (
    <Breadcrumbs>
      {intl
        .formatMessage({id: 'common.footer'})
        .split(' > ')
        .map((a, index) => (
          <StyledBreadcrumb key={index} component="p" label={a} />
        ))}
    </Breadcrumbs>
  );
}

export function FooterDynamic() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '5rem',
        marginTop: '5rem',
        width: '100%',
      }}
    >
      <FooterBreadcrumbs />
    </Box>
  );
}

export default function Footer({locale, messages}: ReactPropsI18n) {
  return (
    <TranslationWrapper locale={locale} messages={messages}>
      <FooterDynamic />
    </TranslationWrapper>
  );
}
