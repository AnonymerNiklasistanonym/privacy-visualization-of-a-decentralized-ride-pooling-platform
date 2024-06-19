// Package imports
import {memo} from 'react';
// Components
import {InputBase} from '@mui/material';
// Local imports
// > Components
import SearchBarAutocomplete from './SearchBarAutocomplete';
import SearchBarBetaContainer from './SearchBarContainer';
// > Misc
import {debugComponentUpdate, debugMemoHelper} from '@misc/debug';
// Type imports
import type {SearchBarAutocompleteProps} from './SearchBarAutocomplete';

export interface SearchBarProps extends SearchBarAutocompleteProps {
  placeholder: string;
}

export default memo(SearchBar, (prev, next) =>
  debugMemoHelper('SearchBar', ['globalSearch', 'placeholder'], prev, next)
);

export function SearchBar(props: SearchBarProps) {
  debugComponentUpdate('SearchBar', true);
  const {placeholder} = props;
  return (
    <SearchBarBetaContainer {...props}>
      <InputBase
        sx={{flex: 1, ml: 1}}
        placeholder={placeholder}
        inputProps={{'aria-label': placeholder}}
      />
      <SearchBarAutocomplete {...props} />
    </SearchBarBetaContainer>
  );
}
