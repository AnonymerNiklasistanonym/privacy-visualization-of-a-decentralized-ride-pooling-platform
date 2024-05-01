// Package imports
// > Components
import {Button, Chip, Divider, List, Typography} from '@mui/material';
// > Icons
import {
  DirectionsCar as DirectionsCarIcon,
  Person as PersonIcon,
  TravelExplore as TravelExploreIcon,
} from '@mui/icons-material';
// Local imports
import {renderDataElement} from './PopupContentGeneric';
// > Components
import ChangeViewButton from './ChangeViewButton';
// Type imports
import type {
  GlobalPropsFetch,
  GlobalPropsShowError,
  GlobalPropsUserInput,
  GlobalPropsUserInputSet,
} from '@misc/globalProps';
import type {DataElement} from './PopupContentGeneric';
import type {SimulationEndpointParticipantInformationCustomer} from '@globals/types/simulation';

export interface PopupContentCustomerProps
  extends GlobalPropsUserInput,
    GlobalPropsUserInputSet,
    GlobalPropsShowError,
    GlobalPropsFetch {
  customer: SimulationEndpointParticipantInformationCustomer;
}

export default function PopupContentCustomer({
  customer,
  showError: stateShowError,
  setStateSpectator,
  fetchJsonSimulation,
  stateSelectedParticipant,
  stateSpectator,
  setStateSelectedRideRequest,
  stateSelectedRideRequest,
}: PopupContentCustomerProps) {
  const showContentSpectatorContactDetails = [
    {
      description: 'registered authentication service',
      spectator: 'auth',
    },
  ];
  const personalData: DataElement[] = [
    {
      content: customer.dateOfBirth,
      label: 'Date of birth',
      showContentSpectator: [...showContentSpectatorContactDetails],
    },
    {
      content: customer.emailAddress,
      label: 'Email Address',
      showContentSpectator: [...showContentSpectatorContactDetails],
    },
    {
      content: customer.fullName,
      label: 'Full Name',
      showContentSpectator: [...showContentSpectatorContactDetails],
    },
    {
      content: customer.gender,
      label: 'Gender',
      showContentSpectator: [...showContentSpectatorContactDetails],
    },
    {
      content: customer.homeAddress,
      label: 'Home Address',
      showContentSpectator: [...showContentSpectatorContactDetails],
    },
    {
      content: customer.phoneNumber,
      label: 'Phone Number',
      showContentSpectator: [...showContentSpectatorContactDetails],
    },
  ];
  return (
    <>
      <Divider>
        <Chip icon={<PersonIcon />} label="Personal Details" size="small" />
      </Divider>
      <List>
        {personalData.map(a =>
          renderDataElement(a, stateSpectator, customer.id)
        )}
      </List>
      <Divider>
        <Chip icon={<DirectionsCarIcon />} label="Passenger" size="small" />
      </Divider>
      {customer.passenger !== undefined ? (
        <ChangeViewButton
          actorId={customer.passenger}
          icon={<DirectionsCarIcon />}
          label={'the current ride provider'}
          setStateSpectator={setStateSpectator}
          isPseudonym={true}
          showError={stateShowError}
          fetchJsonSimulation={fetchJsonSimulation}
          stateSelectedParticipant={stateSelectedParticipant}
          stateSpectator={stateSpectator}
          stateSelectedRideRequest={stateSelectedRideRequest}
        />
      ) : (
        <></>
      )}
      <Divider>
        <Chip icon={<TravelExploreIcon />} label="Ride Request" size="small" />
      </Divider>
      <Typography variant="body2" gutterBottom>
        {customer.rideRequest !== undefined ? (
          <Button
            variant="contained"
            startIcon={<TravelExploreIcon />}
            onClick={() => setStateSelectedRideRequest(customer.rideRequest)}
          >
            Show ride request ({customer.rideRequest})
          </Button>
        ) : (
          <></>
        )}
      </Typography>
    </>
  );
}
