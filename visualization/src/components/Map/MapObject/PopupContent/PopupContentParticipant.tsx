// Package imports
// > Components
import {Box, Chip, CircularProgress, Stack, Typography} from '@mui/material';
// > Icons
import {
  DirectionsCar as DirectionsCarIcon,
  DirectionsWalk as DirectionsWalkIcon,
} from '@mui/icons-material';
// Local imports
import ChangeViewButton from './ChangeViewButton';
import PopupContentCustomer from './PopupContentCustomer';
import PopupContentRideProvider from './PopupContentRideProvider';
// Type imports
import type {
  SimulationEndpointParticipantCoordinatesParticipant,
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantTypes,
} from '@globals/types/simulation';
import type {ErrorModalPropsErrorBuilder} from '@misc/modals';
import type {GlobalStates} from '@misc/globalStates';
import type {ReactState} from '@misc/react';

export interface PopupContentParticipantProps
  extends GlobalStates,
    ErrorModalPropsErrorBuilder {
  stateParticipantCoordinates: ReactState<SimulationEndpointParticipantCoordinatesParticipant>;
  stateCustomerInformation: ReactState<null | SimulationEndpointParticipantInformationCustomer>;
  stateRideProviderInformation: ReactState<null | SimulationEndpointParticipantInformationRideProvider>;
  participantType: SimulationEndpointParticipantTypes;
  stateBaseUrlSimulation: ReactState<string>;
}

export default function PopupContentParticipant({
  stateParticipantCoordinates,
  stateCustomerInformation: customerInformationState,
  stateRideProviderInformation: rideProviderInformationState,
  stateSpectator,
  setStateSpectator,
  setStateSelectedParticipant,
  stateSelectedParticipant,
  participantType,
  setStateErrorModalContent,
  setStateErrorModalOpen,
  stateBaseUrlSimulation,
  stateErrorModalContent,
  stateSelectedRideRequest,
  setStateSelectedRideRequest,
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
          label={stateParticipantCoordinates.id}
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
            setStateSpectator={setStateSpectator}
            setStateSelectedParticipant={setStateSelectedParticipant}
            stateSelectedParticipant={stateSelectedParticipant}
            setStateErrorModalContent={setStateErrorModalContent}
            setStateErrorModalOpen={setStateErrorModalOpen}
            stateBaseUrlSimulation={stateBaseUrlSimulation}
            stateErrorModalContent={stateErrorModalContent}
            stateSelectedRideRequest={stateSelectedRideRequest}
            setStateSelectedRideRequest={setStateSelectedRideRequest}
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
            setStateSpectator={setStateSpectator}
            setStateSelectedParticipant={setStateSelectedParticipant}
            stateSelectedParticipant={stateSelectedParticipant}
            setStateErrorModalContent={setStateErrorModalContent}
            setStateErrorModalOpen={setStateErrorModalOpen}
            stateBaseUrlSimulation={stateBaseUrlSimulation}
            stateErrorModalContent={stateErrorModalContent}
            stateSelectedRideRequest={stateSelectedRideRequest}
            setStateSelectedRideRequest={setStateSelectedRideRequest}
          />
        ) : null}
        <ChangeViewButton
          actorId={stateParticipantCoordinates.id}
          isPseudonym={false}
          icon={
            participantType === 'customer' ? (
              <DirectionsWalkIcon />
            ) : (
              <DirectionsCarIcon />
            )
          }
          label={
            participantType === 'customer'
              ? 'this customer'
              : 'this ride provider'
          }
          stateSpectator={stateSpectator}
          setStateSpectator={setStateSpectator}
          stateSelectedParticipant={stateSelectedParticipant}
          setStateErrorModalContent={setStateErrorModalContent}
          setStateErrorModalOpen={setStateErrorModalOpen}
          stateBaseUrlSimulation={stateBaseUrlSimulation}
          stateErrorModalContent={stateErrorModalContent}
          stateSelectedRideRequest={stateSelectedRideRequest}
        />
      </Box>
    </Box>
  );
}
