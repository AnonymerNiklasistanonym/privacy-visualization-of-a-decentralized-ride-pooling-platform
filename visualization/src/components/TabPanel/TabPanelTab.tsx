'use client';

// Package imports
import {memo, useMemo} from 'react';
// > Components
import {Box} from '@mui/material';
// > Components
import Footer from '@components/Footer';
// Type imports
import type {SettingsGlobalProps, SettingsUiProps} from '@misc/props/settings';
import type {PropsWithChildren} from 'react';
import type {ReactState} from '@misc/react';

export interface TabPanelTabProps
  extends SettingsGlobalProps,
    SettingsUiProps {}

export interface TabPanelTabPropsInput extends TabPanelTabProps {
  index: number;
  value: ReactState<number>;
}

export default memo(TabPanelTab);

export function TabPanelTab({
  children,
  value,
  index,
  stateSettingsUiGridSpacing,
}: PropsWithChildren<TabPanelTabPropsInput>) {
  const spacing = useMemo<string>(
    () => `${stateSettingsUiGridSpacing / 2}rem`,
    [stateSettingsUiGridSpacing]
  );

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box
          sx={{
            padding: {
              lg: `0 ${spacing} 0 ${spacing}`,
              md: 0,
              sm: 0,
              xl: `0 ${spacing} 0 ${spacing}`,
              xs: 0,
            },
          }}
        >
          {children}
          <Footer />
        </Box>
      )}
    </div>
  );
}
