// Type imports
import type {ReactSetState, ReactState} from '../react';

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
}
export interface SettingsMapPropsSet extends SettingsGlobalPropsSet {
  setStateSettingsMapUpdateRateInMs: ReactSetState<number>;
  setStateSettingsMapShowTooltips: ReactSetState<boolean>;
  setStateSettingsMapBaseUrlPathfinder: ReactSetState<string>;
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
export interface SettingsThemeProps extends SettingsGlobalProps {
  /** The current theme state (dark/light mode) */
  stateThemeMode: ReactState<'light' | 'dark'>;
}
export interface SettingsThemePropsSet extends SettingsGlobalPropsSet {
  setStateThemeMode: ReactSetState<'light' | 'dark'>;
}
export interface SettingsConnectedElementsProps extends SettingsGlobalProps {
  stateSettingsCardUpdateRateInMs: ReactState<number>;
}
export interface SettingsConnectedElementsPropsSet
  extends SettingsGlobalPropsSet {
  setStateSettingsCardUpdateRateInMs: ReactSetState<number>;
}

export interface SettingsUiProps extends SettingsGlobalProps {
  /** The spacing between elements */
  stateSettingsUiGridSpacing: number;
}

export interface SettingsUiPropsSet extends SettingsGlobalPropsSet {
  setStateSettingsUiGridSpacing: ReactSetState<number>;
}

export interface SettingsFetchProps extends SettingsGlobalProps {
  stateSettingsFetchBaseUrlSimulation: ReactState<string>;
  stateSettingsFetchCacheUpdateRateInMs: ReactState<number>;
}

export interface SettingsFetchPropsSet extends SettingsGlobalPropsSet {
  setStateSettingsFetchBaseUrlSimulation: ReactSetState<string>;
  setStateSettingsFetchCacheUpdateRateInMs: ReactSetState<number>;
}

export interface SettingsProps
  extends SettingsBlockchainProps,
    SettingsBlockchainPropsSet,
    SettingsConnectedElementsProps,
    SettingsConnectedElementsPropsSet,
    SettingsFetchProps,
    SettingsFetchPropsSet,
    SettingsGlobalProps,
    SettingsGlobalPropsSet,
    SettingsMapProps,
    SettingsMapPropsSet,
    SettingsOverviewProps,
    SettingsOverviewPropsSet,
    SettingsThemeProps,
    SettingsThemePropsSet,
    SettingsUiProps,
    SettingsUiPropsSet {}
