'use client';

// Package imports
import {createTheme} from '@mui/material/styles';
import {useMemo} from 'react';
// > Components
import {Box, CssBaseline} from '@mui/material';
import {ThemeProvider} from '@mui/material/styles';
// Local imports
// > Misc
import {colors} from '@misc/colors';
// Type imports
import type {PropsWithChildren} from 'react';
import type {SettingsThemeProps} from '@misc/props/settings';

export type WrapperThemeProviderProps = SettingsThemeProps;

/**
 * All children inside this wrapper support the MUI theme hook
 */
export default function WrapperThemeProvider({
  children,
  stateThemeMode,
}: PropsWithChildren<WrapperThemeProviderProps>) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: stateThemeMode,
        },
      }),
    [stateThemeMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === 'light'
              ? colors.backgroundColor.light
              : colors.backgroundColor.dark,
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
