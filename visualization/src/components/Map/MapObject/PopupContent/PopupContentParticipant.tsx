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
  GlobalPropsFetch,
  GlobalPropsShowError,
  GlobalPropsUserInput,
  GlobalPropsUserInputSet,
} from '@misc/globalProps';
import type {
  SimulationEndpointParticipantCoordinatesParticipant,
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantTypes,
} from '@globals/types/simulation';
import type {ReactState} from '@misc/react';

export interface PopupContentParticipantProps
  extends GlobalPropsUserInput,
    GlobalPropsUserInputSet,
    GlobalPropsShowError,
    GlobalPropsFetch {
  stateParticipantCoordinates: ReactState<SimulationEndpointParticipantCoordinatesParticipant>;
  stateCustomerInformation: ReactState<null | SimulationEndpointParticipantInformationCustomer>;
  stateRideProviderInformation: ReactState<null | SimulationEndpointParticipantInformationRideProvider>;
  participantType: SimulationEndpointParticipantTypes;
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
  showError,
  fetchJsonSimulation,
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
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          style={{marginBottom: 10}}
        >
          <Chip
            label={stateParticipantCoordinates.id}
            size="small"
            variant="outlined"
          />
          {rideProviderInformationState?.simulationStatus !== undefined ||
          customerInformationState?.simulationStatus !== undefined ? (
            <Chip
              label={
                rideProviderInformationState?.simulationStatus ??
                customerInformationState?.simulationStatus
              }
              size="small"
              color="primary"
            />
          ) : (
            <></>
          )}
        </Stack>
        {customerInformationState === null && participantType === 'customer' ? (
          <Box sx={{display: 'flex', width: '100%'}} justifyContent="center">
            <CircularProgress />
          </Box>
        ) : customerInformationState !== null ? (
          <PopupContentCustomer
            customer={customerInformationState}
            fetchJsonSimulation={fetchJsonSimulation}
            setStateSelectedParticipant={setStateSelectedParticipant}
            setStateSelectedRideRequest={setStateSelectedRideRequest}
            setStateSpectator={setStateSpectator}
            showError={showError}
            stateSelectedParticipant={stateSelectedParticipant}
            stateSelectedRideRequest={stateSelectedRideRequest}
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
            fetchJsonSimulation={fetchJsonSimulation}
            rideProvider={rideProviderInformationState}
            setStateSelectedParticipant={setStateSelectedParticipant}
            setStateSelectedRideRequest={setStateSelectedRideRequest}
            setStateSpectator={setStateSpectator}
            showError={showError}
            stateSelectedParticipant={stateSelectedParticipant}
            stateSelectedRideRequest={stateSelectedRideRequest}
            stateSpectator={stateSpectator}
          />
        ) : null}
        <ChangeViewButton
          actorId={stateParticipantCoordinates.id}
          fetchJsonSimulation={fetchJsonSimulation}
          icon={
            participantType === 'customer' ? (
              <DirectionsWalkIcon />
            ) : (
              <DirectionsCarIcon />
            )
          }
          isPseudonym={false}
          label={
            participantType === 'customer'
              ? 'this customer'
              : 'this ride provider'
          }
          setStateSpectator={setStateSpectator}
          showError={showError}
          stateSelectedParticipant={stateSelectedParticipant}
          stateSelectedRideRequest={stateSelectedRideRequest}
          stateSpectator={stateSpectator}
        />
      </Box>
    </Box>
  );
}
