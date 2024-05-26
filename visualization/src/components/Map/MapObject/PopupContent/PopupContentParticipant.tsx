// Package imports
// > Components
import {Box, Chip, CircularProgress, Stack, Typography} from '@mui/material';
// Local imports
import PopupContentCustomer from './PopupContentCustomer';
import PopupContentRideProvider from './PopupContentRideProvider';
// > Components
import {
  ParticipantCustomerIcon,
  ParticipantRideProviderIcon,
} from '@components/Icons';
import ChangeViewButton from '@components/Button/ChangeViewButton';
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
import type {ChangeViewButtonProps} from '@components/Button/ChangeViewButton';
import type {ReactState} from '@misc/react';

export interface PopupContentParticipantProps
  extends GlobalPropsUserInput,
    GlobalPropsUserInputSet,
    GlobalPropsShowError,
    GlobalPropsFetch,
    ChangeViewButtonProps {
  stateParticipantCoordinates: ReactState<SimulationEndpointParticipantCoordinatesParticipant>;
  stateCustomerInformation: ReactState<null | SimulationEndpointParticipantInformationCustomer>;
  stateRideProviderInformation: ReactState<null | SimulationEndpointParticipantInformationRideProvider>;
  participantType: SimulationEndpointParticipantTypes;
}

export default function PopupContentParticipant(
  props: PopupContentParticipantProps
) {
  const {
    stateParticipantCoordinates,
    stateCustomerInformation: customerInformationState,
    stateRideProviderInformation: rideProviderInformationState,
    participantType,
  } = props;
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
            <ParticipantCustomerIcon />
          ) : (
            <ParticipantRideProviderIcon />
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
            {...props}
            customer={customerInformationState}
          />
        ) : null}
        {rideProviderInformationState === null &&
        participantType === 'ride_provider' ? (
          <Box sx={{display: 'flex', width: '100%'}} justifyContent="center">
            <CircularProgress />
          </Box>
        ) : rideProviderInformationState !== null ? (
          <PopupContentRideProvider
            {...props}
            rideProvider={rideProviderInformationState}
          />
        ) : null}
        <ChangeViewButton
          {...props}
          actorId={stateParticipantCoordinates.id}
          icon={
            participantType === 'customer' ? (
              <ParticipantCustomerIcon />
            ) : (
              <ParticipantRideProviderIcon />
            )
          }
          isPseudonym={false}
          label={
            participantType === 'customer'
              ? 'this customer'
              : 'this ride provider'
          }
        />
      </Box>
    </Box>
  );
}
