'use client';

// Package imports
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
// > Components
import {Autocomplete, Box, IconButton, TextField} from '@mui/material';
// Local imports
// > Misc
import {debugComponentRender, debugMemoHelper} from '@misc/debug';
// Type imports
import type {GlobalPropsSearch, GlobalSearchElement} from '@misc/props/global';
import type {ReactState} from '@misc/react';

export type SearchBarAutocompleteProps = GlobalPropsSearch;

export interface SearchBarAutocompletePropsInput
  extends SearchBarAutocompleteProps {
  /** Primary filter (filter global search for elements that contain this keyword) */
  primaryFilter?: string;
  /** Placeholder text */
  placeholder: ReactState<string>;
  /** Filter the global search for one element */
  displayValueFilter?: (element: Readonly<GlobalSearchElement>) => boolean;
  /** Is currently loading */
  loading: ReactState<boolean>;
}

export default memo(SearchBarAutocomplete, (prev, next) =>
  debugMemoHelper('SearchBarAutocomplete', undefined, prev, next)
);

export function SearchBarAutocomplete({
  globalSearch,
  placeholder,
  primaryFilter,
  displayValueFilter,
  loading,
}: SearchBarAutocompletePropsInput) {
  debugComponentRender('SearchBarAutocomplete');

  const [value, setValue] = useState<GlobalSearchElement | null>(
    displayValueFilter
      ? globalSearch.find(a => displayValueFilter(a)) ?? null
      : null
  );
  const [inputValue, setInputValue] = useState(value?.value ?? '');

  const filterOptions = useCallback(
    (option: Readonly<GlobalSearchElement>): boolean =>
      primaryFilter !== undefined
        ? option.keywords.includes(primaryFilter)
        : true,
    [primaryFilter]
  );

  const selectedValue = useMemo(
    () =>
      displayValueFilter
        ? globalSearch.find(a => displayValueFilter(a))
        : undefined,
    [displayValueFilter, globalSearch]
  );

  const getOptionLabel = useCallback(
    (option: GlobalSearchElement) =>
      filterOptions(option) ? option.value : '',
    [filterOptions]
  );

  const isOptionEqualToValue = useCallback(
    (option: GlobalSearchElement, value: GlobalSearchElement) =>
      option.displayName === value.displayName && option.value === value.value,
    []
  );

  useEffect(() => {
    console.info('selectedValue', selectedValue);
    setValue(selectedValue ?? null);
    setInputValue(selectedValue?.value ?? '');
  }, [selectedValue]);

  useEffect(() => {
    console.info('value', value);
  }, [value]);

  useEffect(() => {
    console.info('inputValue', inputValue);
  }, [inputValue]);

  return (
    <Autocomplete
      id="combo-box"
      options={globalSearch}
      sx={{width: '100%'}}
      blurOnSelect={true}
      autoHighlight={true}
      disabled={loading}
      //onChange={(e, value) => {
      //  // If one element is selected call the onClick function
      //  if (value !== null) {
      //    value.onClick();
      //  }
      //}}
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
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      renderInput={params => (
        <Box display="flex" justifyContent="center">
          <IconButton
            type="button"
            sx={{
              p: '10px 0px 10px 10px',
            }}
            disabled={true}
          >
            {value?.icon}
          </IconButton>
          <TextField
            {...params}
            key="search-text-filed"
            placeholder={placeholder}
            sx={{
              '& fieldset': {border: 'none'},
            }}
          />
        </Box>
      )}
      renderOption={(props, option) => (
        <Box component="li" sx={{'& > svg': {flexShrink: 0, mr: 2}}} {...props}>
          {option.icon}
          {option.displayName}
        </Box>
      )}
      value={value}
      onChange={(event, newValue) => {
        console.info('onChange', newValue);
        setValue(newValue);
        // If one element is selected call the onClick function
        if (newValue !== null) {
          newValue.onClick();
        }
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue, reason) => {
        console.info('onInputChange', newInputValue, reason);
        if (reason !== 'reset') {
          setInputValue(newInputValue);
        }
      }}
    />
  );
}
