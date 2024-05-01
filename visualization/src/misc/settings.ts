// Local imports
import type {ReactSetState, ReactState} from './react';

export interface SettingsGlobalPropsStates {
  stateSettingsGlobalDebug: ReactState<boolean>;
}

export interface SettingsMapPropsStates extends SettingsGlobalPropsStates {
  stateSettingsMapUpdateRateInMs: ReactState<number>;
  stateSettingsMapShowTooltips: ReactState<boolean>;
  stateSettingsMapOpenPopupOnHover: ReactState<boolean>;
  stateSettingsMapBaseUrlPathfinder: ReactState<string>;
  stateSettingsMapBaseUrlSimulation: ReactState<string>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SettingsOverviewPropsStates
  extends SettingsGlobalPropsStates {}

export interface SettingsBlockchainPropsStates
  extends SettingsGlobalPropsStates {
  stateSettingsBlockchainUpdateRateInMs: ReactState<number>;
}

export interface SettingsProps
  extends SettingsMapPropsStates,
    SettingsOverviewPropsStates,
    SettingsBlockchainPropsStates {
  setStateSettingsBlockchainUpdateRateInMs: ReactSetState<number>;
  setStateSettingsGlobalDebug: ReactSetState<boolean>;
  setStateSettingsMapUpdateRateInMs: ReactSetState<number>;
  setStateSettingsMapShowTooltips: ReactSetState<boolean>;
  setStateSettingsMapOpenPopupOnHover: ReactSetState<boolean>;
  setStateSettingsMapBaseUrlPathfinder: ReactSetState<string>;
  setStateSettingsMapBaseUrlSimulation: ReactSetState<string>;
}
