'use client';

// Package imports
import {createTheme} from '@mui/material/styles';
import {useMemo} from 'react';
// > Components
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
// Type imports
import type {PropsWithChildren} from 'react';
import type {ReactState} from '@misc/react';

export interface ThemeContainerProps {
  stateThemeMode: ReactState<'light' | 'dark'>;
}

export default function ThemeContainer({
  children,
  stateThemeMode: mode,
}: PropsWithChildren<ThemeContainerProps>) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
