'use client';

// Package imports
import {useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {Autocomplete, Box, TextField} from '@mui/material';
// > Icons
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  DirectionsCar as DirectionsCarIcon,
  DirectionsWalk as DirectionsWalkIcon,
  Group as GroupIcon,
  Public as PublicIcon,
  QuestionMark as QuestionMarkIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
// Type imports
import type {ReactSetState, ReactState} from '@misc/react';

export type TextInputSpectatorOptionTypes =
  | 'error'
  | 'everything'
  | 'public'
  | 'auth'
  | 'match'
  | 'customer'
  | 'rideProvider';

export type TextInputSpectatorOptionStateType = ReactState<
  Array<{
    label: string;
    type: TextInputSpectatorOptionTypes;
    translationId?: string;
  }>
>;

export interface TextInputSpectatorProps {
  stateOptions: TextInputSpectatorOptionStateType;
  stateSpectator: ReactState<string>;
  setStateSpectator: ReactSetState<string>;
}

export default function TextInputSpectator({
  stateOptions: optionsState,
  stateSpectator: spectatorState,
  setStateSpectator: setSpectatorState,
}: TextInputSpectatorProps) {
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
        groupBy={option => option.type}
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
