'use client';

// Package imports
import {useEffect, useState} from 'react';
// > Components
import {Autocomplete, Box, TextField} from '@mui/material';
// > Icons
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import GroupIcon from '@mui/icons-material/Group';
import PublicIcon from '@mui/icons-material/Public';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import VerifiedIcon from '@mui/icons-material/Verified';
// Type imports
import type {ReactSetState, ReactState} from '@misc/react';
import {useIntl} from 'react-intl';

export type SelectSpectatorOptionTypes =
  | 'error'
  | 'everything'
  | 'public'
  | 'auth'
  | 'match'
  | 'customer'
  | 'rideProvider';

export type SelectSpectatorOptionStateType = ReactState<
  Array<{
    label: string;
    type: SelectSpectatorOptionTypes;
    translationId?: string;
  }>
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
    setVal(
      optionsState.find(a => a.label === spectatorState) ?? {
        label: 'error',
        type: 'error',
      }
    );
  }, [spectatorState, optionsState]);

  const intl = useIntl();
  return (
    <Box
      sx={{
        maxWidth: 600,
        minWidth: 120,
      }}
      margin={2}
    >
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
        getOptionLabel={option =>
          option.translationId !== undefined
            ? intl.formatMessage(
                {
                  id: option.translationId,
                },
                {id: option.label}
              )
            : option.label
        }
        renderInput={params => (
          <TextField
            {...params}
            label={intl.formatMessage({
              id: 'getacar.spectator.title',
            })}
          />
        )}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{'& > svg': {flexShrink: 0, mr: 2}}}
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
            {option.translationId !== undefined
              ? intl.formatMessage(
                  {
                    id: option.translationId,
                  },
                  {id: option.label}
                )
              : option.label}
          </Box>
        )}
      />
    </Box>
  );
}
