// Package imports
// > Components
import {Box, Chip, CircularProgress, Stack, Typography} from '@mui/material';
// > Icons
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
// Local imports
import ChangeViewButton from './ChangeViewButton';
import PopupContentCustomer from './PopupContentCustomer';
import PopupContentRideProvider from './PopupContentRideProvider';
// Type imports
import type {ReactSetState, ReactState} from '@misc/react';
import type {
  SimulationEndpointParticipantCoordinatesParticipant,
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantTypes,
} from '@globals/types/simulation';

export interface PopupContentParticipantProps {
  participantCoordinatesState: ReactState<SimulationEndpointParticipantCoordinatesParticipant>;
  customerInformationState: ReactState<null | SimulationEndpointParticipantInformationCustomer>;
  rideProviderInformationState: ReactState<null | SimulationEndpointParticipantInformationRideProvider>;
  stateSpectator: ReactState<string>;
  setStateSpectator: ReactSetState<string>;
  participantType: SimulationEndpointParticipantTypes;
}

export default function PopupContentParticipant({
  participantCoordinatesState,
  customerInformationState,
  rideProviderInformationState,
  stateSpectator,
  setStateSpectator,
  participantType,
}: PopupContentParticipantProps) {
  return (
    <Box display="flex" justifyContent="left">
      <Box
        component="section"
        sx={{
          maxWidth: '800px',
          width: '100%',
        }}
      >
        <Stack alignItems="center" direction="row" gap={2}>
          {participantType === 'customer' ? (
            <DirectionsWalkIcon />
          ) : (
            <DirectionsCarIcon />
          )}
          <Typography variant="h5" gutterBottom>
            {participantType === 'customer' ? 'Customer' : 'Ride Provider'}
          </Typography>
        </Stack>
        <Chip
          label={participantCoordinatesState.id}
          size="small"
          variant="outlined"
          style={{marginBottom: 10}}
        />
        {customerInformationState === null && participantType === 'customer' ? (
          <Box sx={{display: 'flex', width: '100%'}} justifyContent="center">
            <CircularProgress />
          </Box>
        ) : customerInformationState !== null ? (
          <PopupContentCustomer
            customer={customerInformationState}
            stateSpectator={stateSpectator}
          />
        ) : null}
        {rideProviderInformationState === null &&
        participantType === 'ride_provider' ? (
          <Box sx={{display: 'flex', width: '100%'}} justifyContent="center">
            <CircularProgress />
          </Box>
        ) : rideProviderInformationState !== null ? (
          <PopupContentRideProvider
            rideProvider={rideProviderInformationState}
            stateSpectator={stateSpectator}
          />
        ) : null}
        <ChangeViewButton
          actorState={participantCoordinatesState}
          setStateSpectator={setStateSpectator}
        />
      </Box>
    </Box>
  );
}
