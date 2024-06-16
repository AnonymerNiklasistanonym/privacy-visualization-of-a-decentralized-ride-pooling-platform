// Package imports
// Components
import {IconButton, Paper} from '@mui/material';
import {Search as SearchIcon} from '@mui/icons-material';
// Local imports
// Misc
import {debugComponentUpdate} from '@misc/debug';
// Type imports
import type {PropsWithChildren} from 'react';

export default function SearchBarBetaContainer({children}: PropsWithChildren) {
  debugComponentUpdate('SearchBarBeta', true);
  return (
    <Paper
      component="form"
      sx={{
        alignItems: 'center',
        display: 'flex',
        margin: '0.5rem',
        p: '2px 4px',
        width: 'calc(100% - 1rem)',
      }}
    >
      {/*<IconButton sx={{ p: '10px' }} aria-label="menu">
        <MenuIcon />
  </IconButton>*/}
      {children}
      {/*<InputBase
        sx={{flex: 1, ml: 1}}
        placeholder={placeholder}
        inputProps={{'aria-label': placeholder}}
/>*/}
      <IconButton type="button" sx={{p: '10px'}} aria-label="search">
        <SearchIcon />
      </IconButton>
      {/*<Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
        <DirectionsIcon />
  </IconButton>*/}
    </Paper>
  );
}
