'use client';

// Package imports
// > Components
import {
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  List,
  ListItem,
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
          '& ul': {padding: 0},
          bgcolor: 'background.paper',
          overflow: 'auto',
          position: 'relative',
          width: '100%',
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
    </FormGroup>
  );
}
