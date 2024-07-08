'use client';

// Package imports
import {memo, useCallback} from 'react';
// > Components
import {Autocomplete, Box, TextField} from '@mui/material';
// Local imports
// > Misc
import {debugComponentUpdate, debugMemoHelper} from '@misc/debug';
// Type imports
import type {GlobalPropsSearch, GlobalSearchElement} from '@misc/props/global';

export interface SearchBarAutocompleteProps extends GlobalPropsSearch {
  /** Primary filter */
  primaryFilter?: string;
  /** Placeholder text */
  placeholder: string;
}

export default memo(SearchBarAutocomplete, (prev, next) =>
  debugMemoHelper('SearchBarAutocomplete', ['globalSearch'], prev, next)
);

export function SearchBarAutocomplete({
  globalSearch,
  placeholder,
  primaryFilter,
}: SearchBarAutocompleteProps) {
  debugComponentUpdate('SearchBarAutocomplete');

  const filterOptions = useCallback(
    (option: Readonly<GlobalSearchElement>): boolean =>
      primaryFilter !== undefined
        ? option.keywords.includes(primaryFilter)
        : true,
    [primaryFilter]
  );

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
        // Per default just show a specific type of options
        let optionsFilter: (
          option: Readonly<GlobalSearchElement>
        ) => boolean = option => filterOptions(option);

        // If a special substring is found show the other options
        if (state.inputValue.startsWith('> ')) {
          searchString = searchString.substring(2);
          optionsFilter = option => !filterOptions(option);
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
