export interface SettingsPropsStatesMap {
  stateSettingsMapShowTooltips: boolean;
  stateSettingsMapOpenPopupOnHover: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SettingsPropsStates extends SettingsPropsStatesMap {}

export interface SettingsProps extends SettingsPropsStates {
  setStateSettingsMapShowTooltips: (newValue: boolean) => void;
  setStateSettingsMapOpenPopupOnHover: (newValue: boolean) => void;
}
