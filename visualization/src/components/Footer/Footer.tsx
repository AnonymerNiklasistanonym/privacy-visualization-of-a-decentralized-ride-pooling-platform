'use client';

// Package imports
import {useIntl} from 'react-intl';
// > Components
import {Breadcrumbs} from '@mui/material';
// Local imports
import StyledBreadcrumb from './StyledBreadcrumb';
// Type imports
import type {ReactPropsI18n} from '@misc/react';
import TranslationWrapper from '@components/TranslationWrapper';

export function FooterBreadcrumbs() {
  const intl = useIntl();
  return (
    <Breadcrumbs
      sx={{
        marginBottom: '5rem',
        marginTop: '15rem',
      }}
    >
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
    <TranslationWrapper locale={locale} messages={messages}>
      <div className="footer">
        <FooterBreadcrumbs />
      </div>
    </TranslationWrapper>
  );
}
