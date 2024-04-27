// Package imports
// > Components
import {
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  Tooltip,
  Typography,
} from '@mui/material';
// > Icons
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
// Type imports
import {type DataElement, renderDataElement} from './PopupContentGeneric';
import type {SimulationEndpointParticipantInformationRideProvider} from '@globals/types/simulation';

export interface PopupContentRideProviderProps {
  rideProvider: SimulationEndpointParticipantInformationRideProvider;
  stateSpectator: string;
}

export default function PopupContentRideProvider({
  rideProvider,
  stateSpectator,
}: PopupContentRideProviderProps) {
  const carData: DataElement[] = [
    {
      content: rideProvider.vehicleIdentificationNumber,
      label: 'VIN (Vehicle Identification Number)',
      showContentSpectator: [],
    },
    {
      content: rideProvider.vehicleNumberPlate,
      label: 'Vehicle Number Plate',
      showContentSpectator: [],
    },
  ];
  const personalData: DataElement[] = [];
  if ('company' in rideProvider) {
    personalData.push({
      content: rideProvider.company,
      label: 'Company',
      showContentSpectator: [],
    });
  } else {
    personalData.push(
      ...[
        {
          content: rideProvider.dateOfBirth,
          label: 'Date of birth',
          showContentSpectator: [],
        },
        {
          content: rideProvider.emailAddress,
          label: 'Email Address',
          showContentSpectator: [],
        },
        {
          content: rideProvider.fullName,
          label: 'Full Name',
          showContentSpectator: [],
        },
        {
          content: rideProvider.gender,
          label: 'Gender',
          showContentSpectator: [],
        },
        {
          content: rideProvider.homeAddress,
          label: 'Home Address',
          showContentSpectator: [],
        },
        {
          content: rideProvider.phoneNumber,
          label: 'Phone Number',
          showContentSpectator: [],
        },
      ]
    );
  }
  return (
    <>
      <Divider>
        <Chip icon={<DirectionsCarIcon />} label="Car Details" size="small" />
      </Divider>
      <List>
        {carData.map(a =>
          renderDataElement(a, stateSpectator, rideProvider.id)
        )}
      </List>
      <Divider>
        <Chip icon={<PersonIcon />} label="Personal Details" size="small" />
      </Divider>
      <List>
        {personalData.map(a =>
          renderDataElement(a, stateSpectator, rideProvider.id)
        )}
      </List>
      <Divider>
        <Chip
          icon={<DirectionsCarIcon />}
          label="Passenger List"
          size="small"
        />
      </Divider>
      <Typography variant="body2" gutterBottom>
        TODO
      </Typography>
      <Typography variant="body2" gutterBottom>
        {rideProvider.passengerList !== undefined
          ? rideProvider.passengerList.join(', ')
          : ''}
      </Typography>
      <Divider>
        <Chip icon={<TravelExploreIcon />} label="Ride Request" size="small" />
      </Divider>
      <Typography variant="body2" gutterBottom>
        TODO
      </Typography>
      <Typography variant="body2" gutterBottom>
        {rideProvider.rideRequest}
      </Typography>
    </>
  );
}
