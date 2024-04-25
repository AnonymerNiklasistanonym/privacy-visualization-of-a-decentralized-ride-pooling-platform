// Local imports
import type {ReactState, ReactSetState} from './react';

export interface SettingsMapPropsStates {
  stateSettingsMapShowTooltips: ReactState<boolean>;
  stateSettingsMapOpenPopupOnHover: ReactState<boolean>;
  stateSettingsMapBaseUrlPathfinder: ReactState<string>;
  stateSettingsMapBaseUrlSimulation: ReactState<string>;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SettingsOverviewPropsStates {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SettingsBlockchainPropsStates {}

export interface SettingsProps
  extends SettingsMapPropsStates,
    SettingsOverviewPropsStates,
    SettingsBlockchainPropsStates {
  setStateSettingsMapShowTooltips: ReactSetState<boolean>;
  setStateSettingsMapOpenPopupOnHover: ReactSetState<boolean>;
  setStateSettingsMapBaseUrlPathfinder: ReactSetState<string>;
  setStateSettingsMapBaseUrlSimulation: ReactSetState<string>;
}
