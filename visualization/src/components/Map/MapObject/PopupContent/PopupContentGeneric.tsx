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
  if (
    spectator !== id &&
    spectator !== 'everything' &&
    !a.showContentSpectator.some(a => a.spectator === spectator)
  ) {
    content = '******';
    tooltip = `This information is only available to this actor${
      a.showContentSpectator.length > 0
        ? ' and ' +
          a.showContentSpectator
            .map(a => `${a.spectator} (${a.description})`)
            .join(', ')
        : ''
    }`;
  }
  return (
    <ListItem
      key={a.label}
      style={{
        paddingTop: 4,
      }}
      disablePadding
    >
      <Typography
        variant="body2"
        gutterBottom
        style={{
          margin: 0,
          overflowWrap: 'break-word',
        }}
      >
        <Box fontWeight="medium" display="inline">
          {a.label}:{' '}
        </Box>
        <Tooltip title={tooltip} arrow>
          <Typography variant="body2" display="inline" noWrap gutterBottom>
            {content}
          </Typography>
        </Tooltip>
      </Typography>
    </ListItem>
  );
};
