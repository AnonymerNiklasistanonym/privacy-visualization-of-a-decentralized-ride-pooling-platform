// Type imports
import type {ReactSetState, ReactState} from '../react';
import type {FetchOptions} from '@globals/lib/fetch';
import type {ShowError} from '@components/Modal/ErrorModal';

/** Props to get the current spectators/selected elements */
export interface GlobalPropsSpectatorSelectedElements {
  /** The currently selected spectator from which POV everything should be shown */
  stateSpectator: ReactState<string>;
  /** The currently selected participant */
  stateSelectedParticipant: ReactState<string | undefined>;
  /** The currently selected ride request */
  stateSelectedRideRequest: ReactState<string | undefined>;
}

/** Props to set the current spectators/selected elements */
export interface GlobalPropsSpectatorSelectedElementsSet {
  /** Set the spectator from which POV everything should be shown */
  setStateSpectator: ReactSetState<string>;
  /** Set the currently selected participant */
  setStateSelectedParticipant: ReactSetState<string | undefined>;
  /** Set the currently selected ride request */
  setStateSelectedRideRequest: ReactSetState<string | undefined>;
}

/** Props to fetch requests for actor data */
export interface GlobalPropsFetch {
  /** Fetch a JSON endpoint of the simulation server. */
  fetchJsonSimulation: <T>(
    endpoint: string,
    options?: Readonly<FetchOptions>
  ) => Promise<T>;
}

/** Props to show an error */
export interface GlobalPropsShowError {
  /** Show an error in the global error modal. */
  showError: ShowError;
}
