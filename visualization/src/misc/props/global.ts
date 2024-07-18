// Type imports
import type {MutableRefObject, ReactElement} from 'react';
import type {ReactSetState, ReactState} from '../react';
import type {
  SimulationEndpointParticipantCoordinates,
  SimulationEndpointParticipantTypes,
  SimulationEndpointSmartContractInformation,
} from '@globals/types/simulation';
import type {FetchOptions} from '@globals/lib/fetch';
import type {ModalDataInformation} from '@components/Modal/ModalData';
import type {ShowError} from '@components/Modal/ModalError';

/** Props to get the current spectator/selected elements */
export interface GlobalPropsSpectatorSelectedElements {
  /** The current spectator from which POV everything should be shown */
  stateSpectatorId: ReactState<string>;
  /** The participant that should be shown */
  stateShowParticipantId: ReactState<undefined | string>;
  /** The currently selected participant */
  stateSelectedParticipantId: ReactState<undefined | string>;
  /** The currently selected smart contract */
  stateSelectedSmartContractId: ReactState<undefined | string>;
}

/** Props to set the current spectators/selected elements */
export interface GlobalPropsSpectatorSelectedElementsSet {
  /** Set the current spectator from which POV everything should be shown */
  setStateSpectatorId: ReactSetState<string>;
  /** Set the participant that should be shown */
  setStateShowParticipantId: ReactSetState<undefined | string>;
  /** Set the currently selected participant */
  setStateSelectedParticipantId: ReactSetState<undefined | string>;
  /** Set the currently selected smart contract */
  setStateSelectedSmartContractId: ReactSetState<undefined | string>;
}

export interface GlobalPropsModalDataInformation {
  /** Set the open/close state of the data modal */
  setStateOpenModalData: ReactSetState<boolean>;
  /** Set the content of the data modal */
  setStateDataModalInformation: ReactSetState<undefined | ModalDataInformation>;
}

/** Props to fetch requests for actor data */
export interface GlobalPropsFetch {
  /**
   * Fetch a JSON endpoint of the simulation server
   * @returns It returns the fetched JSON
   */
  fetchJsonSimulation: <JSON_TYPE, ENDPOINTS extends string = string>(
    /** The endpoint that should be fetched */
    endpoint: ENDPOINTS,
    /** Generic fetch options */
    options?: Readonly<FetchOptions>
  ) => Promise<JSON_TYPE>;
  /**
   * Fetch a JSON endpoint of the simulation server while waiting for the previous request
   * @returns It returns either the fetched JSON or null if the request balancer detects a currently running request
   */
  fetchJsonSimulationWait: <JSON_TYPE, ENDPOINTS extends string = string>(
    /** The endpoint that should be fetched */
    endpoint: ENDPOINTS,
    /** A request balancer to block multiple requests from the same source */
    requestBalancer: MutableRefObject<boolean>,
    /** Generic fetch options */
    options?: Readonly<FetchOptions>
  ) => Promise<JSON_TYPE | null>;
}

export interface GlobalPropsFetchParticipantCoordinates {
  fetchJsonSimulationWaitParticipantCoordinates: (
    requestBalancer: MutableRefObject<boolean>,
    options?: Readonly<FetchOptions>
  ) => Promise<SimulationEndpointParticipantCoordinates | null>;
}

export interface GlobalPropsFetchSmartContracts {
  fetchJsonSimulationWaitSmartContracts: (
    requestBalancer: MutableRefObject<boolean>,
    options?: Readonly<FetchOptions>
  ) => Promise<Array<SimulationEndpointSmartContractInformation> | null>;
}

/** Props to show an error */
export interface GlobalPropsShowError {
  /** Show an error in the global error modal. */
  showError: ShowError;
}

/** Information of spectator */
export interface GlobalPropsSpectatorInfo {
  /** Name of the spectator */
  name: string;
  /** Callback to run when being clicked in a search */
  callback: () => void;
  /** Spectator category (e.g. service) */
  category: string;
  /** Keywords to find spectator */
  keywords: Array<string>;
  /** Icon to describe spectator */
  icon: ReactElement;
}

/** Props to set global spectators */
export interface GlobalPropsSpectatorsSet {
  /** Update elements that should appear in the global search */
  updateGlobalSearch: (
    newSpectators: Array<
      [
        string,
        () => Promise<GlobalPropsSpectatorInfo> | GlobalPropsSpectatorInfo,
      ]
    >,
    newTabs: Array<
      [
        string,
        () => Promise<GlobalPropsSpectatorInfo> | GlobalPropsSpectatorInfo,
      ]
    >
  ) => void;
}

export interface GlobalSearchElement {
  /** The icon with which it should be rendered */
  icon: ReactElement;
  /** The name that should be displayed in the search bar when selected */
  value: string;
  /** The name with which it should be rendered */
  displayName: string;
  /** To help filtering store the participant ID if this is a participant */
  participantId?: string;
  /** To help filtering store the participant type if this is a participant */
  participantType?: SimulationEndpointParticipantTypes;
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

/** Props for global spectator map */
export interface GlobalPropsSpectatorMap {
  /** A map that contains all current spectators */
  stateSpectators: ReactState<Map<string, GlobalPropsSpectatorInfo>>;
}

/** Props for values in translated strings */
export interface GlobalPropsIntlValues {
  intlValues: {[key: string]: ReactElement | string};
}

export interface GlobalPropsTabIndexSet {
  /** Set the current tab index */
  setStateTabIndex: ReactSetState<number>;
}

export interface GlobalPropsTabIndex {
  /** The current tab index */
  stateTabIndex: ReactState<number>;
}
