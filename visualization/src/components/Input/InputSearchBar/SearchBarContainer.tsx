// Package imports
import {memo} from 'react';
// > Components
import {Divider, IconButton, Paper, Tooltip} from '@mui/material';
import {Search as SearchIcon} from '@mui/icons-material';
// Local imports
// > Components
import InputExtraActions from '@components/Input/InputExtraActions';
import LoadingCircle from '@components/Loading/LoadingCircle';
// > Misc
import {debugComponentRender} from '@misc/debug';
// Type imports
import type {InputExtraActionsAction} from '@components/Input/InputExtraActions';
import type {PropsWithChildren} from 'react';
import type {ReactState} from '@misc/react';

export interface SearchBarContainerProps {
  /** Text for search button tooltip */
  searchActionTooltip: string;
  /** Actions after the search bar */
  actionsPost?: Array<InputExtraActionsAction>;
  /** Loading indicator */
  loading: ReactState<boolean>;
}

export default memo(SearchBarContainer);

export function SearchBarContainer({
  actionsPost,
  children,
  searchActionTooltip,
  loading,
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
      {loading === true ? <LoadingCircle notFullWidth={true} /> : undefined}
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
      {actionsPost !== undefined && actionsPost.length > 0 ? (
        <Divider orientation="vertical" flexItem />
      ) : undefined}
      <InputExtraActions actions={actionsPost} />
    </Paper>
  );
}
