// Type imports
import type {ReactRef, ReactSetState, ReactState} from '@misc/react';

export interface ErrorModalContentElement {
  error: Map<string, Error>;
  count: number;
}

export interface ErrorModalPropsGet {
  stateErrorModalOpen: ReactState<boolean>;
  stateErrorModalUpdate: ReactState<boolean>;
  errorModalContent: ReactRef<Map<string, ErrorModalContentElement>>;
}

export interface ErrorModalPropsSet {
  setStateErrorModalOpen: ReactSetState<boolean>;
  setStateErrorModalUpdate: ReactSetState<boolean>;
}

export interface ErrorModalPropsErrorBuilder
  extends ErrorModalPropsGet,
    ErrorModalPropsSet {}
