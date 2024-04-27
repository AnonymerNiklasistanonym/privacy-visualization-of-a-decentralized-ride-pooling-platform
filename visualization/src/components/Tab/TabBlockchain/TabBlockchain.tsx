'use client';

// Package imports
// > Components
import {Box, Divider, Typography} from '@mui/material';
// Local imports
// > Components
import TableBlockchain from '@components/Table/TableBlockchain';
// Type imports
import type {SettingsBlockchainPropsStates} from '@misc/settings';


// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TabBlockchainProps extends SettingsBlockchainPropsStates {}

// eslint-disable-next-line no-empty-pattern
export default function TabBlockchain({}: TabBlockchainProps) {
  return (
    <Box
      sx={{
        maxWidth: 500,
        width: '100%',
      }}
    >
      <Typography variant="body1" gutterBottom>
        TODO
      </Typography>
      <Divider />
      <TableBlockchain />
    </Box>
  );
}
