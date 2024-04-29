'use client';

// Package imports
// > Components
import {Box, Divider, Typography} from '@mui/material';
// Local imports
// > Components
import TableBlockchain from '@components/Table/TableBlockchain';
// Type imports
import type {ErrorModalPropsErrorBuilder} from '@misc/modals';
import type {GlobalStates} from '@misc/globalStates';
import type {SettingsBlockchainPropsStates} from '@misc/settings';

export interface TabBlockchainProps
  extends SettingsBlockchainPropsStates,
    ErrorModalPropsErrorBuilder,
    GlobalStates {}

// eslint-disable-next-line no-empty-pattern
export default function TabBlockchain({
  stateSettingsMapBaseUrlSimulation,
  stateErrorModalContent,
  setStateErrorModalOpen,
  setStateErrorModalContent,
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
          stateErrorModalContent={stateErrorModalContent}
          setStateErrorModalOpen={setStateErrorModalOpen}
          setStateErrorModalContent={setStateErrorModalContent}
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
