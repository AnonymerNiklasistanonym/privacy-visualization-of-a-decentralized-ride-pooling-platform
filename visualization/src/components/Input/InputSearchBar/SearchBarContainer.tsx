// Package imports
// Components
import {IconButton, Paper} from '@mui/material';
import {Search as SearchIcon} from '@mui/icons-material';
// Local imports
// Misc
import {debugComponentUpdate} from '@misc/debug';
// Type imports
import type {PropsWithChildren} from 'react';

export default function SearchBarContainer({children}: PropsWithChildren) {
  debugComponentUpdate('SearchBarContainer', true);
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
      <IconButton type="button" sx={{p: '10px'}} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
