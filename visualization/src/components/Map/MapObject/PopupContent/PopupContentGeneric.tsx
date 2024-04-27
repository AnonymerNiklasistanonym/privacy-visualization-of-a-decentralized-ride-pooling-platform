// Package imports
// > Components
import {Box, ListItem, Tooltip, Typography} from '@mui/material';
// Type imports
import type {ReactNode} from 'react';

export interface ShowContentSpectatorElement {
  spectator: string;
  description: string;
}

export interface DataElement {
  label: string;
  content: ReactNode;
  /** Show content only for the specified spectators. */
  showContentSpectator: ShowContentSpectatorElement[];
}

export const renderDataElement = (
  a: Readonly<DataElement>,
  spectator: string,
  id: string
) => {
  let content = a.content;
  let tooltip = '';
  if (spectator !== id && spectator !== 'everything') {
    content = '******';
    tooltip = 'The data is only available to the owner and in the admin view';
  }
  return (
    <ListItem
      key={a.label}
      style={{
        paddingTop: 4,
      }}
      disablePadding
    >
      <Typography variant="body2" gutterBottom>
        <Box fontWeight="medium" display="inline">
          {a.label}:{' '}
        </Box>
        <Tooltip title={tooltip} arrow>
          <Typography variant="body2" display="inline" gutterBottom>
            {content}
          </Typography>
        </Tooltip>
      </Typography>
    </ListItem>
  );
};
