'use client';

// Package imports
import {memo} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {Autocomplete, Box, TextField} from '@mui/material';
// Local imports
// > Misc
import {debugComponentUpdate, debugMemoHelper} from '@misc/debug';
// Type imports
import type {GlobalPropsSearch, GlobalSearchElement} from '@misc/props/global';

export interface SearchBarAutocompleteProps extends GlobalPropsSearch {
  placeholder: string;
}

export default memo(SearchBarAutocomplete, (prev, next) =>
  debugMemoHelper('SearchBarAutocomplete', ['globalSearch'], prev, next)
);

export function SearchBarAutocomplete({
  globalSearch,
  placeholder,
}: SearchBarAutocompleteProps) {
  debugComponentUpdate('SearchBarAutocomplete');
  const intl = useIntl();

  const changeSpectatorInfo = intl.formatMessage({
    id: 'getacar.spectator.change',
  });

  return (
    <Autocomplete
      id="combo-box-demo"
      options={globalSearch}
      sx={{width: '100%'}}
      value={null}
      blurOnSelect={true}
      autoHighlight={true}
      onChange={(e, value) => {
        // If one element is selected call the onClick function
        if (value !== null) {
          value.onClick();
        }
      }}
      filterOptions={(options, state) => {
        // Per default search for the whole input
        let searchString: string = state.inputValue.toLowerCase();
        // Per default just show the change spectator related options
        let optionsFilter: (
          option: Readonly<GlobalSearchElement>
        ) => boolean = option => option.keywords.includes(changeSpectatorInfo);

        // If a special substring is found show non map related options a update the search query
        if (state.inputValue.startsWith('> ')) {
          searchString = searchString.substring(2);
          optionsFilter = option =>
            !option.keywords.includes(changeSpectatorInfo);
        }
        return options
          .filter(optionsFilter)
          .filter(option =>
            state.getOptionLabel(option).toLowerCase().includes(searchString)
          );
      }}
      getOptionLabel={option => [option.name, ...option.keywords].join(' ')}
      renderInput={params => (
        <TextField
          {...params}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
          }}
          sx={{
            '& fieldset': {border: 'none'},
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
