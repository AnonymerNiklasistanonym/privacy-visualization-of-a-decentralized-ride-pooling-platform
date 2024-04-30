'use client';

// Package imports
// > Components
import {Box, Divider, Typography} from '@mui/material';
// Local imports
// > Components
import TableBlockchain from '@components/Table/TableBlockchain';
// Type imports
import type {GlobalStates, GlobalStatesShowError} from '@misc/globalStates';
import type {SettingsBlockchainPropsStates} from '@misc/settings';

export interface TabBlockchainProps
  extends SettingsBlockchainPropsStates,
    GlobalStatesShowError,
    GlobalStates {}

// eslint-disable-next-line no-empty-pattern
export default function TabBlockchain({
  stateSettingsMapBaseUrlSimulation,
  stateShowError,
  stateSettingsMapUpdateRateInMs,
  setStateSelectedParticipant,
  setStateSpectator,
  stateSelectedParticipant,
  stateSpectator,
  setStateSelectedRideRequest,
  stateSelectedRideRequest,
}: TabBlockchainProps) {
  return (
    <Box display="flex" justifyContent="center">
      <Box
        sx={{
          maxWidth: 800,
          minHeight: '50%',
          width: '100%',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Public Smart Contracts
        </Typography>
        <Divider />
        <Typography variant="body1" gutterBottom>
          TODO: Add pagination and don`t fetch all of them at once
        </Typography>
        <TableBlockchain
          stateSettingsMapBaseUrlSimulation={stateSettingsMapBaseUrlSimulation}
          stateShowError={stateShowError}
          stateSettingsMapUpdateRateInMs={stateSettingsMapUpdateRateInMs}
          setStateSelectedParticipant={setStateSelectedParticipant}
          setStateSpectator={setStateSpectator}
          stateSelectedParticipant={stateSelectedParticipant}
          stateSpectator={stateSpectator}
          setStateSelectedRideRequest={setStateSelectedRideRequest}
          stateSelectedRideRequest={stateSelectedRideRequest}
        />
      </Box>
    </Box>
  );
}
