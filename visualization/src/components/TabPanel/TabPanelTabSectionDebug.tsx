// Package imports
import {memo} from 'react';
// Components
import {Box, Chip, Divider} from '@mui/material';
// Type imports
import type {PropsWithChildren} from 'react';
import type {SettingsGlobalProps} from '@misc/props/settings';

export interface TabPanelTabSectionDebugProps extends SettingsGlobalProps {
  title: string;
  outlined?: boolean;
}

export default memo(TabPanelTabSectionDebug);

export function TabPanelTabSectionDebug({
  children,
  outlined,
  stateSettingsGlobalDebug,
  title,
}: PropsWithChildren<TabPanelTabSectionDebugProps>) {
  return stateSettingsGlobalDebug ? (
    <Box
      sx={{
        '& > *': {m: 1},
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '1vh',
      }}
    >
      <Divider>
        <Chip
          label={title}
          size="small"
          variant={outlined ? 'outlined' : undefined}
        />
      </Divider>
      {children}
    </Box>
  ) : (
    <></>
  );
}
