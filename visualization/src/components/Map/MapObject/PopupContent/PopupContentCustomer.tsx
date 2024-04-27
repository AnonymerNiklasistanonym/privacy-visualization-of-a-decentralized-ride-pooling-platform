// Package imports
// > Components
import {Chip, Divider, List, Typography} from '@mui/material';
// > Icons
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
// Type imports
import {type DataElement, renderDataElement} from './PopupContentGeneric';
import type {SimulationEndpointParticipantInformationCustomer} from '@globals/types/simulation';

export interface PopupContentCustomerProps {
  customer: SimulationEndpointParticipantInformationCustomer;
  stateSpectator: string;
}

export default function PopupContentCustomer({
  customer,
  stateSpectator,
}: PopupContentCustomerProps) {
  const personalData: DataElement[] = [
    {
      content: customer.dateOfBirth,
      label: 'Date of birth',
      showContentSpectator: [],
    },
    {
      content: customer.emailAddress,
      label: 'Email Address',
      showContentSpectator: [],
    },
    {
      content: customer.fullName,
      label: 'Full Name',
      showContentSpectator: [],
    },
    {
      content: customer.gender,
      label: 'Gender',
      showContentSpectator: [],
    },
    {
      content: customer.homeAddress,
      label: 'Home Address',
      showContentSpectator: [],
    },
    {
      content: customer.phoneNumber,
      label: 'Phone Number',
      showContentSpectator: [],
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
      <Typography variant="body2" gutterBottom>
        TODO
      </Typography>
      <Typography variant="body2" gutterBottom>
        {customer.passenger}
      </Typography>
      <Divider>
        <Chip icon={<TravelExploreIcon />} label="Ride Request" size="small" />
      </Divider>
      <Typography variant="body2" gutterBottom>
        TODO
      </Typography>
      <Typography variant="body2" gutterBottom>
        {customer.rideRequest}
      </Typography>
    </>
  );
}
