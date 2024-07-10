// Type imports
import type {ReactSetState, ReactState} from '../react';
import type {FetchOptions} from '@globals/lib/fetch';
import type {ReactElement} from 'react';
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

/** Information of spectator */
export interface GlobalPropsSpectatorElement {
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

/** Props for values in translated strings */
export interface GlobalPropsIntlValues {
  intlValues: {[key: string]: ReactElement | string};
}
