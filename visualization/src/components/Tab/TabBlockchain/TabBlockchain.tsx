'use client';

// Package imports
// > Components
import {Box, Divider, Typography} from '@mui/material';
// Local imports
// > Components
import TableBlockchain from '@components/Table/TableBlockchain';
// Type imports
import type {
  GlobalPropsFetch,
  GlobalPropsShowError,
  GlobalPropsUserInput,
  GlobalPropsUserInputSet,
} from '@misc/globalProps';
import type {SettingsBlockchainPropsStates} from '@misc/settings';

export interface TabBlockchainProps
  extends SettingsBlockchainPropsStates,
    GlobalPropsUserInput,
    GlobalPropsUserInputSet,
    GlobalPropsShowError,
    GlobalPropsFetch {}

// eslint-disable-next-line no-empty-pattern
export default function TabBlockchain({
  stateSettingsMapBaseUrlSimulation,
  showError: stateShowError,
  stateSettingsMapUpdateRateInMs,
  setStateSelectedParticipant,
  setStateSpectator,
  stateSelectedParticipant,
  stateSpectator,
  setStateSelectedRideRequest,
  stateSelectedRideRequest,
  fetchJsonSimulation,
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
          fetchJsonSimulation={fetchJsonSimulation}
          setStateSelectedParticipant={setStateSelectedParticipant}
          setStateSelectedRideRequest={setStateSelectedRideRequest}
          setStateSpectator={setStateSpectator}
          showError={stateShowError}
          stateSelectedParticipant={stateSelectedParticipant}
          stateSelectedRideRequest={stateSelectedRideRequest}
          stateSettingsMapBaseUrlSimulation={stateSettingsMapBaseUrlSimulation}
          stateSettingsMapUpdateRateInMs={stateSettingsMapUpdateRateInMs}
          stateSpectator={stateSpectator}
        />
      </Box>
    </Box>
  );
}
