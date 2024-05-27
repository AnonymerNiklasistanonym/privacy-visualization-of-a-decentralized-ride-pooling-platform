// Type imports
import type {ReactSetState, ReactState} from '../react';
import type {
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantTypes,
  SimulationEndpointRideRequestInformation,
} from '@globals/types/simulation';
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

/** Props to get the last selected participants */
export interface GlobalPropsParticipantSelectedElements {
  /** The last selected participant type */
  stateSelectedParticipantTypeGlobal: ReactState<
    SimulationEndpointParticipantTypes | undefined
  >;
  /** The last selected participant Customer information */
  stateSelectedParticipantCustomerInformationGlobal: ReactState<
    SimulationEndpointParticipantInformationCustomer | undefined
  >;
  /** The last selected participant Ride Provider information */
  stateSelectedParticipantRideProviderInformationGlobal: ReactState<
    SimulationEndpointParticipantInformationRideProvider | undefined
  >;
  /** The last selected participant Ride Request information */
  stateSelectedParticipantRideRequestInformationGlobal: ReactState<
    SimulationEndpointRideRequestInformation | undefined
  >;
}

/** Props to set the last selected participants */
export interface GlobalPropsParticipantSelectedElementsSet {
  /** Update the last selected participant type */
  setStateSelectedParticipantTypeGlobal: ReactSetState<
    SimulationEndpointParticipantTypes | undefined
  >;
  /** Update the last selected participant Customer information */
  setStateSelectedParticipantCustomerInformationGlobal: ReactSetState<
    SimulationEndpointParticipantInformationCustomer | undefined
  >;
  /** Update the last selected participant Ride Provider information */
  setStateSelectedParticipantRideProviderInformationGlobal: ReactSetState<
    SimulationEndpointParticipantInformationRideProvider | undefined
  >;
  /** Update the last selected participant Ride Request information */
  setStateSelectedParticipantRideRequestInformationGlobal: ReactSetState<
    SimulationEndpointRideRequestInformation | undefined
  >;
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
