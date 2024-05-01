// Type imports
import type {ReactSetState, ReactState} from './react';
import type {FetchJsonOptions} from '@globals/lib/fetch';
import type {ShowError} from './modals';

export interface GlobalPropsUserInput {
  stateSpectator: ReactState<string>;
  stateSelectedParticipant: ReactState<string | undefined>;
  stateSelectedRideRequest: ReactState<string | undefined>;
}

export interface GlobalPropsFetch {
  /** Fetch a JSON endpoint of the simulation server. */
  fetchJsonSimulation: <T>(
    endpoint: string,
    options?: Readonly<FetchJsonOptions>
  ) => Promise<T>;
}

export interface GlobalPropsUserInputSetSpectator {
  setStateSpectator: ReactSetState<string>;
}

export interface GlobalPropsUserInputSetParticipant {
  setStateSelectedParticipant: ReactSetState<string | undefined>;
}

export interface GlobalPropsUserInputSet
  extends GlobalPropsUserInputSetSpectator,
    GlobalPropsUserInputSetParticipant {
  setStateSelectedRideRequest: ReactSetState<string | undefined>;
}

export interface GlobalPropsShowError {
  /** Show an error in the global error modal. */
  showError: ShowError;
}
