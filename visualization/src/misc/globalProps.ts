// Type imports
import type {ReactSetState, ReactState} from './react';
import type {FetchOptions} from '@globals/lib/fetch';
import type {ShowError} from '@components/Modal/ErrorModal';

export interface GlobalPropsUserInput {
  stateSpectator: ReactState<string>;
  stateSelectedParticipant: ReactState<string | undefined>;
  stateSelectedRideRequest: ReactState<string | undefined>;
}

export interface GlobalPropsFetch {
  /** Fetch a JSON endpoint of the simulation server. */
  fetchJsonSimulation: <T>(
    endpoint: string,
    options?: Readonly<FetchOptions>
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
