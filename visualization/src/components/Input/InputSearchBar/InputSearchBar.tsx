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

export default memo(InputSearchBar, (prev, next) =>
  debugMemoHelper('InputSearchBar', undefined, prev, next)
);

export function InputSearchBar(props: InputSearchBarPropsInput) {
  debugComponentRender('InputSearchBar');
  return (
    <SearchBarBetaContainer {...props}>
      <SearchBarAutocomplete {...props} />
    </SearchBarBetaContainer>
  );
}
