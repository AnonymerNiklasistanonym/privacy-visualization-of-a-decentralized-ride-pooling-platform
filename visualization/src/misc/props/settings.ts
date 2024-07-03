// Type imports
import type {ReactSetState, ReactState} from '../react';
import type {Dispatch} from 'react';

export interface SettingsGlobalProps {
  stateSettingsGlobalDebug: ReactState<boolean>;
}
export interface SettingsGlobalPropsSet {
  setStateSettingsGlobalDebug: ReactSetState<boolean>;
}

export interface SettingsMapProps extends SettingsGlobalProps {
  stateSettingsMapUpdateRateInMs: ReactState<number>;
  stateSettingsMapShowTooltips: ReactState<boolean>;
  stateSettingsMapBaseUrlPathfinder: ReactState<string>;
  stateSettingsMapBaseUrlSimulation: ReactState<string>;
}
export interface SettingsMapPropsSet extends SettingsGlobalPropsSet {
  setStateSettingsMapUpdateRateInMs: ReactSetState<number>;
  setStateSettingsMapShowTooltips: ReactSetState<boolean>;
  setStateSettingsMapBaseUrlPathfinder: ReactSetState<string>;
  setStateSettingsMapBaseUrlSimulation: ReactSetState<string>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SettingsOverviewProps extends SettingsGlobalProps {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SettingsOverviewPropsSet extends SettingsGlobalPropsSet {}

export interface SettingsBlockchainProps extends SettingsGlobalProps {
  stateSettingsBlockchainUpdateRateInMs: ReactState<number>;
}
export interface SettingsBlockchainPropsSet extends SettingsGlobalPropsSet {
  setStateSettingsBlockchainUpdateRateInMs: ReactSetState<number>;
}
export interface SettingsThemePropsSet extends SettingsGlobalPropsSet {
  stateThemeMode: ReactState<'light' | 'dark'>;
  setStateThemeMode: ReactSetState<'light' | 'dark'>;
}
export interface SettingsConnectedElementsProps extends SettingsGlobalProps {
  stateSettingsCardUpdateRateInMs: ReactState<number>;
}
export interface SettingsConnectedElementsPropsSet
  extends SettingsGlobalPropsSet {
  setStateSettingsCardUpdateRateInMs: ReactSetState<number>;
}

export interface SettingsUiProps extends SettingsGlobalPropsSet {
  stateSettingsUiGridSpacing: number;
  stateSettingsUiMapScroll: boolean;
}

export interface SettingsUiPropsSet extends SettingsGlobalPropsSet {
  setStateSettingsUiGridSpacing: ReactSetState<number>;
  setStateSettingsUiMapScroll: ReactSetState<boolean>;
}

export interface SettingsProps
  extends SettingsGlobalProps,
    SettingsGlobalPropsSet,
    SettingsMapProps,
    SettingsMapPropsSet,
    SettingsOverviewProps,
    SettingsOverviewPropsSet,
    SettingsBlockchainProps,
    SettingsBlockchainPropsSet,
    SettingsThemePropsSet,
    SettingsConnectedElementsProps,
    SettingsConnectedElementsPropsSet,
    SettingsUiProps,
    SettingsUiPropsSet {}
