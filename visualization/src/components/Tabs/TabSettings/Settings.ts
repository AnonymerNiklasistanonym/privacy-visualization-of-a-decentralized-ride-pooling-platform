export interface SettingsPropsStatesMap {
  stateSettingsMapShowTooltips: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SettingsPropsStates extends SettingsPropsStatesMap {}

export interface SettingsProps extends SettingsPropsStates {
  setStateSettingsMapShowTooltips: (newValue: boolean) => void;
}
