'use client';

// Package imports
import {useEffect, useState} from 'react';
// > Components
import {Autocomplete, Box, TextField} from '@mui/material';
// > Icons
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import PublicIcon from '@mui/icons-material/Public';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import VerifiedIcon from '@mui/icons-material/Verified';
// Type imports
import type {ReactSetState, ReactState} from '@misc/react';

export type SelectSpectatorOptionTypes =
  | 'error'
  | 'everything'
  | 'public'
  | 'auth'
  | 'match'
  | 'customer'
  | 'rideProvider';

export type SelectSpectatorOptionStateType = ReactState<
  Array<{label: string; type: SelectSpectatorOptionTypes}>
>;

export interface SelectSpectatorProps {
  optionsState: SelectSpectatorOptionStateType;
  spectatorState: ReactState<string>;
  setSpectatorState: ReactSetState<string>;
}

export default function SelectSpectator({
  optionsState,
  spectatorState,
  setSpectatorState,
}: SelectSpectatorProps) {
  const getCurrentValue = () =>
    optionsState.find(a => a.label === spectatorState) ?? {
      label: 'error',
      type: 'error',
    };
  const [val, setVal] = useState(getCurrentValue());
  useEffect(() => {
    setVal(getCurrentValue());
  }, [spectatorState]);
  return (
    <Box sx={{minWidth: 120, maxWidth: 600}} margin={2}>
      <Autocomplete
        id="combo-box-demo"
        options={optionsState}
        sx={{width: '100%'}}
        value={val}
        defaultValue={getCurrentValue()}
        onChange={(e, value) =>
          value !== null
            ? setSpectatorState(value.label)
            : setVal(getCurrentValue())
        }
        onInputChange={(e, val) => setVal({label: val, type: 'error'})}
        getOptionLabel={option => option.label}
        renderInput={params => <TextField {...params} label="Spectator" />}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{'& > svg': {mr: 2, flexShrink: 0}}}
            {...props}
          >
            {option.type === 'customer' ? (
              <DirectionsWalkIcon />
            ) : option.type === 'rideProvider' ? (
              <DirectionsCarIcon />
            ) : option.type === 'everything' ? (
              <AdminPanelSettingsIcon />
            ) : option.type === 'public' ? (
              <PublicIcon />
            ) : option.type === 'auth' ? (
              <VerifiedIcon />
            ) : option.type === 'match' ? (
              <GroupIcon />
            ) : (
              <QuestionMarkIcon />
            )}{' '}
            {option.label}
          </Box>
        )}
      />
    </Box>
  );
}
