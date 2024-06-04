// Type imports
import type {ReactSetState, ReactState} from '../react';
import type {
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantTypes,
  SimulationEndpointRideRequestInformation,
} from '@globals/types/simulation';
import type {FetchOptions} from '@globals/lib/fetch';
import type {ReactElement} from 'react';
import type {ShowError} from '@components/Modal/ErrorModal';

/** Props to get the current spectators/selected elements */
export interface GlobalPropsSpectatorSelectedElements {
  /** The current spectator from which POV everything should be shown */
  stateSpectator: ReactState<string>;
  /** The currently selected spectator */
  stateSelectedSpectator: ReactState<string | undefined>;
  /** The currently selected participant */
  stateSelectedParticipant: ReactState<string | undefined>;
  /** The currently selected ride request */
  stateSelectedRideRequest: ReactState<string | undefined>;
}

/** Props to set the current spectators/selected elements */
export interface GlobalPropsSpectatorSelectedElementsSet {
  /** Set the spectator from which POV everything should be shown */
  setStateSpectator: ReactSetState<string>;
  /** Set the currently selected spectator */
  setStateSelectedSpectator: ReactSetState<string | undefined>;
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

export interface GlobalPropsSpectatorElement {
  name: string;
  callback: () => void;
  keywords: Array<string>;
  icon: ReactElement;
}

/** Props to set global spectators */
export interface GlobalPropsSpectatorsSet {
  /** Update elements that should appear in the global search */
  updateGlobalSearch: (
    newSpectators: Array<
      [
        string,
        () =>
          | Promise<GlobalPropsSpectatorElement>
          | GlobalPropsSpectatorElement,
      ]
    >,
    newTabs: Array<
      [
        string,
        () =>
          | Promise<GlobalPropsSpectatorElement>
          | GlobalPropsSpectatorElement,
      ]
    >,
    newada: Array<
      [
        string,
        () =>
          | Promise<GlobalPropsSpectatorElement>
          | GlobalPropsSpectatorElement,
      ]
    >
  ) => void;
}

export interface GlobalSearchElement {
  /** The icon with which it should be rendered */
  icon: ReactElement;
  /** The name with which it should be rendered */
  name: string;
  /** The action that should be called when selected */
  onClick: () => void;
  /** The additional keywords to find this entry besides the name */
  keywords: Array<string>;
}

/** Props for global search */
export interface GlobalPropsSearch {
  /** A list of all searches with actions that can be done */
  globalSearch: Array<GlobalSearchElement>;
}

/** Props for global theming */
export interface GlobalPropsTheming {
  /** Indicator if the current theme mode is light or dark */
  stateThemeMode: ReactState<'light' | 'dark'>;
  /** Update the current theme mode */
  setStateThemeMode: ReactSetState<'light' | 'dark'>;
}

/** Props for global spectator map */
export interface GlobalPropsSpectatorMap {
  /** A map that contains all current spectators */
  stateSpectators: ReactState<Map<string, GlobalPropsSpectatorElement>>;
}
