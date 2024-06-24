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

export type SearchBarProps = SearchBarAutocompleteProps;

export default memo(SearchBar, (prev, next) =>
  debugMemoHelper('SearchBar', ['globalSearch'], prev, next)
);

export function SearchBar(props: SearchBarProps) {
  debugComponentUpdate('SearchBar', true);
  return (
    <SearchBarBetaContainer {...props}>
      <SearchBarAutocomplete {...props} />
    </SearchBarBetaContainer>
  );
}
