'use client';

// Package imports
import {createTheme} from '@mui/material/styles';
import {useMemo} from 'react';
// > Components
import {Box, CssBaseline} from '@mui/material';
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
      <Box
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === 'light'
              ? 'hsla(215, 15%, 97%, 0.5)'
              : 'rgba(29, 33, 38, 0.4)',
          height: '100%',
          margin: 0,
          padding: 0,
          width: '100%',
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  );
}
