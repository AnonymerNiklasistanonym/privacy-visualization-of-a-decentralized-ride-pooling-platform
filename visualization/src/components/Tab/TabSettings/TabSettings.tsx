'use client';

// Package imports
// > Components
import {
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  List,
  ListItem,
  Switch,
  TextField,
} from '@mui/material';
import {NumericFormat, NumericFormatProps} from 'react-number-format';
import {forwardRef} from 'react';
// Local imports
// > Components
import TabContainer from '@components/Tab/TabContainer';
import TabElementContainer from '@components/Tab/TabElementContainer';
// Type imports
import type {ReactSetState, ReactState} from '@misc/react';
import type {ReactNode} from 'react';
import type {SettingsProps} from '@misc/props/settings';

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

export interface SettingsElementGeneric {
  label: string;
  type: string;
}

export interface SettingsElementToggle extends SettingsElementGeneric {
  stateValue: ReactState<boolean>;
  setStateValue: ReactSetState<boolean>;
  type: 'toggle';
}

export interface SettingsElementText extends SettingsElementGeneric {
  stateValue: ReactState<string>;
  setStateValue: ReactSetState<string>;
  type: 'text';
}

export interface SettingsElementMs extends SettingsElementGeneric {
  stateValue: ReactState<number>;
  setStateValue: ReactSetState<number>;
  type: 'ms';
}

export type SettingsElement =
  | SettingsElementToggle
  | SettingsElementText
  | SettingsElementMs;

export const renderSettingsElement = (element: SettingsElement): ReactNode => {
  if (element.type === 'toggle') {
    return (
      <FormControlLabel
        control={
          <Switch
            checked={element.stateValue}
            onChange={(event, checked) => element.setStateValue(checked)}
          />
        }
        label={element.label}
      />
    );
  }
  if (element.type === 'text') {
    return (
      <TextField
        label={element.label}
        variant="outlined"
        value={element.stateValue}
        onChange={event => element.setStateValue(event.target.value)}
      />
    );
  }
  if (element.type === 'ms') {
    return (
      <TextField
        label={element.label}
        value={element.stateValue}
        onChange={event => element.setStateValue(Number(event.target.value))}
        InputProps={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          inputComponent: NumericFormatCustom as any,
        }}
        variant="standard"
      />
    );
  }
};

const stringComparator = (a: string, b: string) => {
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  return x > y ? 1 : x < y ? -1 : 0;
};

export const renderSettings = (
  title: string,
  elements: Array<SettingsElement>
): ReactNode => {
  return (
    <Grid item xs={12} md={6}>
      <TabElementContainer>
        <List
          sx={{
            '& ul': {padding: 0},
            bgcolor: 'background.paper',
            overflow: 'auto',
            width: '100%',
          }}
          subheader={<li />}
        >
          <ListItem>
            <Divider textAlign="left">{title}</Divider>
          </ListItem>
          {elements
            .sort((a, b) => stringComparator(a.label, b.label))
            .map(a => (
              <ListItem key={`${title}-${a.label}`}>
                {renderSettingsElement(a)}
              </ListItem>
            ))}
        </List>
      </TabElementContainer>
    </Grid>
  );
};

export default function TabSettings({
  setStateSettingsBlockchainUpdateRateInMs,
  setStateSettingsGlobalDebug,
  setStateSettingsMapBaseUrlPathfinder,
  setStateSettingsMapBaseUrlSimulation,
  setStateSettingsMapOpenPopupOnHover,
  setStateSettingsMapShowTooltips,
  setStateSettingsMapUpdateRateInMs,
  stateSettingsBlockchainUpdateRateInMs,
  stateSettingsGlobalDebug,
  stateSettingsMapBaseUrlPathfinder,
  stateSettingsMapBaseUrlSimulation,
  stateSettingsMapOpenPopupOnHover,
  stateSettingsMapShowTooltips,
  stateSettingsMapUpdateRateInMs,
}: TabSettingsProps) {
  // Settings cards
  const settingsBlockchain = renderSettings('BLOCKCHAIN', [
    {
      label: 'Blockchain update rate',
      setStateValue: setStateSettingsBlockchainUpdateRateInMs,
      stateValue: stateSettingsBlockchainUpdateRateInMs,
      type: 'ms',
    },
  ]);
  const settingsDebug = renderSettings('DEBUG', [
    {
      label: 'Enable debugging',
      setStateValue: setStateSettingsGlobalDebug,
      stateValue: stateSettingsGlobalDebug,
      type: 'toggle',
    },
  ]);
  const settingsMap = renderSettings('MAP', [
    {
      label: 'Show Tooltips',
      setStateValue: setStateSettingsMapShowTooltips,
      stateValue: stateSettingsMapShowTooltips,
      type: 'toggle',
    },
    {
      label: 'Open Popup on hover',
      setStateValue: setStateSettingsMapOpenPopupOnHover,
      stateValue: stateSettingsMapOpenPopupOnHover,
      type: 'toggle',
    },
    {
      label: 'Base URL Pathfinder',
      setStateValue: setStateSettingsMapBaseUrlPathfinder,
      stateValue: stateSettingsMapBaseUrlPathfinder,
      type: 'text',
    },
    {
      label: 'Base URL Simulation',
      setStateValue: setStateSettingsMapBaseUrlSimulation,
      stateValue: stateSettingsMapBaseUrlSimulation,
      type: 'text',
    },
    {
      label: 'Map update rate',
      setStateValue: setStateSettingsMapUpdateRateInMs,
      stateValue: stateSettingsMapUpdateRateInMs,
      type: 'ms',
    },
  ]);
  return (
    <TabContainer>
      <FormGroup>
        <Grid
          container
          spacing={2}
          justifyContent="space-around"
          alignItems="stretch"
        >
          {settingsDebug}
          {settingsBlockchain}
          {settingsMap}
        </Grid>
      </FormGroup>
    </TabContainer>
  );
}
