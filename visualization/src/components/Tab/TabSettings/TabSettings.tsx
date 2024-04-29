'use client';

// Package imports
// > Components
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  List,
  ListItem,
  TextField,
} from '@mui/material';
import {NumericFormat, NumericFormatProps} from 'react-number-format';
import {forwardRef} from 'react';
// Type imports
import type {SettingsProps} from '@misc/settings';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TabSettingsProps extends SettingsProps {}

interface CustomProps {
  onChange: (event: {target: {name: string; value: string}}) => void;
  name: string;
}

const NumericFormatCustom = forwardRef<NumericFormatProps, CustomProps>(
  (props, ref) => {
    const {onChange, ...other} = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={values => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        suffix="ms"
      />
    );
  }
);
NumericFormatCustom.displayName = 'NumericFormatAdapterMs';

export default function TabSettings({
  stateSettingsMapShowTooltips,
  stateSettingsMapOpenPopupOnHover,
  stateSettingsMapBaseUrlPathfinder,
  stateSettingsMapBaseUrlSimulation,
  stateSettingsMapUpdateRateInMs,
  setStateSettingsMapShowTooltips,
  setStateSettingsMapOpenPopupOnHover,
  setStateSettingsMapBaseUrlPathfinder,
  setStateSettingsMapBaseUrlSimulation,
  setStateSettingsMapUpdateRateInMs,
}: TabSettingsProps) {
  return (
    <Box display="flex" justifyContent="center">
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
          <ListItem>
            <TextField
              label="Map update rate"
              value={stateSettingsMapUpdateRateInMs}
              onChange={event =>
                setStateSettingsMapUpdateRateInMs(Number(event.target.value))
              }
              InputProps={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                inputComponent: NumericFormatCustom as any,
              }}
              variant="standard"
            />
          </ListItem>
        </List>
      </FormGroup>
    </Box>
  );
}
