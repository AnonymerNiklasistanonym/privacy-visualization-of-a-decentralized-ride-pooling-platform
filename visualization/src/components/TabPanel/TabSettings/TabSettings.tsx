'use client';

// Package imports
// > Components
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {Divider} from '@mui/material';
// Type imports
import type {SettingsProps} from '@misc/settings';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TabSettingsProps extends SettingsProps {}

export default function TabSettings({
  stateSettingsMapShowTooltips,
  stateSettingsMapOpenPopupOnHover,
  setStateSettingsMapShowTooltips,
  setStateSettingsMapOpenPopupOnHover,
}: TabSettingsProps) {
  return (
    <FormGroup>
      <Divider textAlign="left">MAP</Divider>
      <FormControlLabel
        control={
          <Checkbox
            checked={stateSettingsMapShowTooltips}
            onChange={event =>
              setStateSettingsMapShowTooltips(event.target.checked)
            }
            inputProps={{'aria-label': 'controlled'}}
          />
        }
        label="Show Tooltips"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={stateSettingsMapOpenPopupOnHover}
            onChange={event =>
              setStateSettingsMapOpenPopupOnHover(event.target.checked)
            }
            inputProps={{'aria-label': 'controlled'}}
          />
        }
        label="Open Popup on hover"
      />
      {
        //<FormControlLabel required control={<Checkbox />} label="Required" />
        //<FormControlLabel disabled control={<Checkbox />} label="Disabled" />
      }
    </FormGroup>
  );
}
