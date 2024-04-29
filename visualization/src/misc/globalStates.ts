// Type imports
import type {ReactSetState, ReactState} from './react';

export interface GlobalStatesStates {
  stateSpectator: ReactState<string>;
  stateSelectedParticipant: ReactState<string | undefined>;
  stateSelectedRideRequest: ReactState<string | undefined>;
}

export interface GlobalStates extends GlobalStatesStates {
  setStateSpectator: ReactSetState<string>;
  setStateSelectedParticipant: ReactSetState<string | undefined>;
  setStateSelectedRideRequest: ReactSetState<string | undefined>;
}
