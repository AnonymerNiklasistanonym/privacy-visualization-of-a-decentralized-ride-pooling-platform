// Local imports
import ChangeViewButton from './ChangeViewButton';
import {
  PopupContentCustomer,
  PopupContentRideProvider,
} from './PopupContentActor';
// Type imports
import type {FC} from 'react';
import type {ReactSetState, ReactState} from '@/globals/types/react';
import type {
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantCoordinatesParticipant,
  SimulationEndpointParticipantInformationRideProvider,
} from '@/globals/types/simulation';
import { Box, CircularProgress } from '@mui/material';

export interface PopupContentParticipantProps {
  participantCoordinatesState: ReactState<SimulationEndpointParticipantCoordinatesParticipant>;
  customerInformationState: ReactState<null | SimulationEndpointParticipantInformationCustomer>;
  rideProviderInformationState: ReactState<null | SimulationEndpointParticipantInformationRideProvider>;
  spectatorState: ReactState<string>;
  setStateSpectator: ReactSetState<string>;
  participantType: 'customer' | 'ride_provider';
}

export const PopupContentParticipant: FC<PopupContentParticipantProps> = ({
  participantCoordinatesState,
  customerInformationState,
  rideProviderInformationState,
  spectatorState,
  setStateSpectator,
  participantType,
}) => {
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
};

export default PopupContentParticipant;
