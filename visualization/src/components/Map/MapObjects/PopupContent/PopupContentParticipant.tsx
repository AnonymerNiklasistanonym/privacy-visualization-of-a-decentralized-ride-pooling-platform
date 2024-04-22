// Package imports
// > Components
import {Box, CircularProgress} from '@mui/material';
// Local imports
import ChangeViewButton from './ChangeViewButton';
import PopupContentCustomer from './PopupContentCustomer';
import PopupContentRideProvider from './PopupContentRideProvider';
// Type imports
import type {ReactSetState, ReactState} from '@misc/react';
import type {
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantCoordinatesParticipant,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantTypes,
} from '@globals/types/simulation';

export interface PopupContentParticipantProps {
  participantCoordinatesState: ReactState<SimulationEndpointParticipantCoordinatesParticipant>;
  customerInformationState: ReactState<null | SimulationEndpointParticipantInformationCustomer>;
  rideProviderInformationState: ReactState<null | SimulationEndpointParticipantInformationRideProvider>;
  spectatorState: ReactState<string>;
  setStateSpectator: ReactSetState<string>;
  participantType: SimulationEndpointParticipantTypes;
}

export default function PopupContentParticipant({
  participantCoordinatesState,
  customerInformationState,
  rideProviderInformationState,
  spectatorState,
  setStateSpectator,
  participantType,
}: PopupContentParticipantProps) {
  return (
    <>
      <h2>
        {participantType === 'customer' ? 'Customer' : 'Ride Provider'} (
        {participantCoordinatesState.id}) [{spectatorState}]
      </h2>
      {customerInformationState === null && participantType === 'customer' ? (
        <Box sx={{display: 'flex'}}>
          <CircularProgress />
        </Box>
      ) : customerInformationState !== null ? (
        <PopupContentCustomer
          customer={customerInformationState}
          spectatorState={spectatorState}
        />
      ) : null}
      {rideProviderInformationState === null &&
      participantType === 'ride_provider' ? (
        <Box sx={{display: 'flex'}}>
          <CircularProgress />
        </Box>
      ) : rideProviderInformationState !== null ? (
        <PopupContentRideProvider
          rideProvider={rideProviderInformationState}
          spectatorState={spectatorState}
        />
      ) : null}
      <ChangeViewButton
        actorState={participantCoordinatesState}
        setStateSpectator={setStateSpectator}
      />
    </>
  );
}
