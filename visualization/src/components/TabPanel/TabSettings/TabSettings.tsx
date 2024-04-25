'use client';

// Package imports
// > Components
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  TextField,
} from '@mui/material';
// Type imports
import type {SettingsProps} from '@misc/settings';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TabSettingsProps extends SettingsProps {}

export default function TabSettings({
  stateSettingsMapShowTooltips,
  stateSettingsMapOpenPopupOnHover,
  stateSettingsMapBaseUrlPathfinder,
  stateSettingsMapBaseUrlSimulation,
  setStateSettingsMapShowTooltips,
  setStateSettingsMapOpenPopupOnHover,
  setStateSettingsMapBaseUrlPathfinder,
  setStateSettingsMapBaseUrlSimulation,
}: TabSettingsProps) {
  return (
    <FormGroup>
      <List
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'auto',
          '& ul': {padding: 0},
        }}
        subheader={<li />}
      >
        <ListItem>
          <Divider textAlign="left">MAP</Divider>
        </ListItem>
        <ListItem>
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
        </ListItem>
        <ListItem>
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
        </ListItem>
        <ListItem>
          <TextField
            label="Base URL Pathfinder"
            variant="outlined"
            value={stateSettingsMapBaseUrlPathfinder}
            onChange={event =>
              setStateSettingsMapBaseUrlPathfinder(event.target.value)
            }
          />
        </ListItem>
        <ListItem>
          <TextField
            label="Base URL Simulation"
            variant="outlined"
            value={stateSettingsMapBaseUrlSimulation}
            onChange={event =>
              setStateSettingsMapBaseUrlSimulation(event.target.value)
            }
          />
        </ListItem>
      </List>
      {
        //<FormControlLabel required control={<Checkbox />} label="Required" />
        //<FormControlLabel disabled control={<Checkbox />} label="Disabled" />
      }
    </FormGroup>
  );
}
