'use client';

// Package imports
import {useIntl} from 'react-intl';
// > Components
import {Autocomplete, Box, TextField} from '@mui/material';
// Local imports
// > Misc
import {debugComponentUpdate} from '@misc/debug';
// Type imports
import type {
  GlobalPropsSearch,
  GlobalPropsSpectatorSelectedElements,
  GlobalSearchElement,
} from '@misc/props/global';

export interface SearchBarAutocompleteProps
  extends GlobalPropsSearch,
    GlobalPropsSpectatorSelectedElements {}

export default function SearchBarAutocomplete({
  globalSearch,
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
        if (value !== null) {
          value.onClick();
        }
      }}
      filterOptions={(options, state) => {
        console.log(options, state.inputValue);
        let tempOptions: GlobalSearchElement[];
        let inputValue = state.inputValue.toLowerCase();
        // If special substring is found show non map related options
        if (state.inputValue.startsWith('> ')) {
          inputValue = inputValue.substring(2);
          tempOptions = options.filter(
            option => !option.keywords.includes(changeSpectatorInfo)
          );
        } else {
          // Otherwise just show the change spectator related options
          tempOptions = options.filter(option =>
            option.keywords.includes(changeSpectatorInfo)
          );
        }
        return tempOptions.filter(option => {
          console.info(
            `${state.getOptionLabel(option)} includes ${inputValue} ? => ${state
              .getOptionLabel(option)
              .includes(inputValue)}`
          );
          return state.getOptionLabel(option).toLowerCase().includes(inputValue);
        });
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
