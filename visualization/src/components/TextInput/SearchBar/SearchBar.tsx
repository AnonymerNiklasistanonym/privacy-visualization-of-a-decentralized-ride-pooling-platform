'use client';

// Package imports
import {useIntl} from 'react-intl';
// > Components
import {Autocomplete, Box, InputAdornment, TextField} from '@mui/material';
import {Search as SearchIcon} from '@mui/icons-material';
// Local imports
// > Misc
import {debugComponentUpdate} from '@misc/debug';
// Type imports
import type {
  GlobalPropsSearch,
  GlobalPropsSpectatorSelectedElements,
} from '@misc/props/global';
import SearchBarAutocomplete from './SearchBarAutocomplete';

export interface SearchBarProps
  extends GlobalPropsSearch,
    GlobalPropsSpectatorSelectedElements {}

export default function SearchBar(props: SearchBarProps) {
  debugComponentUpdate('SearchBar');
  return (
    <Box
      sx={{
        maxWidth: {md: '50vw', sm: '80vw', xs: '80vw'},
        width: {md: 800, sm: '100%', xs: '100%'},
      }}
      margin={2}
    >
      <SearchBarAutocomplete {...props} />
    </Box>
  );
}
