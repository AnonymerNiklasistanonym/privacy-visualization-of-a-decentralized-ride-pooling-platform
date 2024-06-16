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

export interface SearchBarAutocompleteProps
  extends GlobalPropsSearch,
    GlobalPropsSpectatorSelectedElements {}

export default function SearchBarAutocomplete({
  globalSearch,
}: SearchBarAutocompleteProps) {
  debugComponentUpdate('SearchBarAutocomplete');
  const intl = useIntl();
  return (
    <Autocomplete
      id="combo-box-demo"
      options={globalSearch}
      sx={{width: '100%'}}
      value={null}
      blurOnSelect={true}
      autoHighlight={true}
      onChange={(e, value) => {
        if (value !== null) {
          value.onClick();
        }
      }}
      getOptionLabel={option => [option.name, ...option.keywords].join(' ')}
      renderInput={params => (
        <TextField
          {...params}
          placeholder={intl.formatMessage({
            id: 'page.home.search.title',
          })}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon htmlColor="white" />
              </InputAdornment>
            ),
            sx: {
              '.css-1d3z3hw-MuiOutlinedInput-notchedOutline': {
                borderColor: 'white !important',
              },
              '.css-i4bv87-MuiSvgIcon-root': {
                color: 'white',
              },
              color: 'white',
            },
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" sx={{'& > svg': {flexShrink: 0, mr: 2}}} {...props}>
          {option.icon}
          {option.name}
        </Box>
      )}
    />
  );
}
