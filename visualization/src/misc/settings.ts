export interface SettingsMapPropsStates {
  stateSettingsMapShowTooltips: boolean;
  stateSettingsMapOpenPopupOnHover: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SettingsOverviewPropsStates {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SettingsBlockchainPropsStates {}

export interface SettingsProps
  extends SettingsMapPropsStates,
    SettingsOverviewPropsStates,
    SettingsBlockchainPropsStates {
  setStateSettingsMapShowTooltips: (newValue: boolean) => void;
  setStateSettingsMapOpenPopupOnHover: (newValue: boolean) => void;
}
