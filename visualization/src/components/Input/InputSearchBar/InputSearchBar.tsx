// Package imports
import {memo} from 'react';
// Local imports
// > Components
import SearchBarAutocomplete from './SearchBarAutocomplete';
import SearchBarBetaContainer from './SearchBarContainer';
// > Misc
import {debugComponentRender, debugMemoHelper} from '@misc/debug';
// Type imports
import type {
  SearchBarAutocompleteProps,
  SearchBarAutocompletePropsInput,
} from './SearchBarAutocomplete';
import type {SearchBarContainerProps} from './SearchBarContainer';

export type InputSearchBarProps = SearchBarAutocompleteProps;

export interface InputSearchBarPropsInput
  extends SearchBarAutocompletePropsInput,
    SearchBarContainerProps {}

export default memo(SearchBar, (prev, next) =>
  debugMemoHelper('SearchBar', ['globalSearch'], prev, next)
);

export function SearchBar(props: InputSearchBarPropsInput) {
  debugComponentRender('SearchBar');
  return (
    <SearchBarBetaContainer {...props}>
      <SearchBarAutocomplete {...props} />
    </SearchBarBetaContainer>
  );
}
