// Local imports
import type {ReactSetState, ReactState} from './react';

export interface SettingsMapPropsStates {
  stateSettingsMapUpdateRateInMs: ReactState<number>;
  stateSettingsMapShowTooltips: ReactState<boolean>;
  stateSettingsMapOpenPopupOnHover: ReactState<boolean>;
  stateSettingsMapBaseUrlPathfinder: ReactState<string>;
  stateSettingsMapBaseUrlSimulation: ReactState<string>;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SettingsOverviewPropsStates {}

export interface SettingsBlockchainPropsStates {
  // TODO Rename or change
  stateSettingsMapUpdateRateInMs: ReactState<number>;
  stateSettingsMapBaseUrlSimulation: ReactState<string>;
}

export interface SettingsProps
  extends SettingsMapPropsStates,
    SettingsOverviewPropsStates,
    SettingsBlockchainPropsStates {
  setStateSettingsMapUpdateRateInMs: ReactSetState<number>;
  setStateSettingsMapShowTooltips: ReactSetState<boolean>;
  setStateSettingsMapOpenPopupOnHover: ReactSetState<boolean>;
  setStateSettingsMapBaseUrlPathfinder: ReactSetState<string>;
  setStateSettingsMapBaseUrlSimulation: ReactSetState<string>;
}
