// Package imports
import {memo} from 'react';
// Components
import {InputBase} from '@mui/material';
// Local imports
// > Components
import SearchBarBetaAutocomplete from './SearchBarBetaAutocomplete';
import SearchBarBetaContainer from './SearchBarBetaContainer';
// > Misc
import {debugComponentUpdate, debugMemoHelper} from '@misc/debug';
// Type imports
import type {SearchBarBetaAutocompleteProps} from './SearchBarBetaAutocomplete';

export interface SearchBarBetaProps extends SearchBarBetaAutocompleteProps {
  placeholder: string;
}

export default memo(SearchBarBeta, (prev, next) =>
  debugMemoHelper('SearchBarBeta', ['globalSearch', 'placeholder'], prev, next)
);

export function SearchBarBeta(props: SearchBarBetaProps) {
  debugComponentUpdate('SearchBarBeta', true);
  const {placeholder} = props;
  return (
    <SearchBarBetaContainer {...props}>
      <InputBase
        sx={{flex: 1, ml: 1}}
        placeholder={placeholder}
        inputProps={{'aria-label': placeholder}}
      />
      <SearchBarBetaAutocomplete {...props} />
    </SearchBarBetaContainer>
  );
}
