// Package imports
import {memo} from 'react';
// Components
import {InputBase} from '@mui/material';
// Local imports
// > Components
import SearchBarBetaContainer from './SearchBarBetaContainer';
// > Misc
import {debugComponentUpdate} from '@misc/debug';
// Type imports
import type {
  GlobalPropsSearch,
  GlobalPropsSpectatorSelectedElements,
} from '@misc/props/global';
import SearchBarBetaAutocomplete from './SearchBarBetaAutocomplete';

export interface SearchBarBetaProps
  extends GlobalPropsSearch,
    GlobalPropsSpectatorSelectedElements {
  placeholder: string;
}

export default function SearchBarBeta(props: SearchBarBetaProps) {
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
