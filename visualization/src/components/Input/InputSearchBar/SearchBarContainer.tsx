// Package imports
// > Components
import {Divider, IconButton, Paper, Tooltip} from '@mui/material';
import {Search as SearchIcon} from '@mui/icons-material';
// Local imports
// > Components
import InputExtraActions from '@components/Input/InputExtraActions';
// > Misc
import {debugComponentRender} from '@misc/debug';
// Type imports
import type {InputExtraActionsProps} from '@components/Input/InputExtraActions';
import type {PropsWithChildren} from 'react';

export interface SearchBarContainerProps extends InputExtraActionsProps {
  /** Text for search button tooltip */
  searchActionTooltip: string;
}

export default function SearchBarContainer({
  actions,
  children,
  searchActionTooltip,
}: PropsWithChildren<SearchBarContainerProps>) {
  debugComponentRender('SearchBarContainer');
  return (
    <Paper
      component="form"
      sx={{
        alignItems: 'center',
        display: 'flex',
        p: '2px 4px',
        width: '100%',
      }}
    >
      {children}
      <Tooltip key={'search-bar-action-search'} title={searchActionTooltip}>
        <IconButton
          type="button"
          sx={{p: '10px'}}
          aria-label={searchActionTooltip}
          disableRipple={true}
        >
          <SearchIcon />
        </IconButton>
      </Tooltip>
      {actions !== undefined && actions.length > 0 ? (
        <Divider orientation="vertical" flexItem />
      ) : undefined}
      <InputExtraActions actions={actions} />
    </Paper>
  );
}
