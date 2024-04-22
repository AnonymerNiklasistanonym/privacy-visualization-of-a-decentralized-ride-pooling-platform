'use client';

// Package imports
// > Components
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {Divider} from '@mui/material';
// Type imports
import type {FC} from 'react';
import type {ReactPropsI18n} from '@globals/types/react';
import type {SettingsProps} from './Settings';

export interface TabSettingsProps extends ReactPropsI18n, SettingsProps {}

const TabSettings: FC<TabSettingsProps> = ({
  stateSettingsMapShowTooltips,
  setStateSettingsMapShowTooltips,
}) => {
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
      {
        //<FormControlLabel required control={<Checkbox />} label="Required" />
        //<FormControlLabel disabled control={<Checkbox />} label="Disabled" />
      }
    </FormGroup>
  );
};

export default TabSettings;
