// Package imports
// > Components
import {Button, Chip, Divider, List, Typography} from '@mui/material';
// > Icons
import {
  DirectionsCar as DirectionsCarIcon,
  DirectionsWalk as DirectionsWalkIcon,
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
import type {SimulationEndpointParticipantInformationRideProvider} from '@globals/types/simulation';

export interface PopupContentRideProviderProps
  extends GlobalPropsUserInput,
    GlobalPropsUserInputSet,
    GlobalPropsShowError,
    GlobalPropsFetch {
  rideProvider: SimulationEndpointParticipantInformationRideProvider;
}

export default function PopupContentRideProvider({
  rideProvider,
  stateSpectator,
  setStateSpectator,
  showError: stateShowError,
  fetchJsonSimulation,
  stateSelectedParticipant,
  stateSelectedRideRequest,
  setStateSelectedRideRequest,
}: PopupContentRideProviderProps) {
  const showContentSpectatorContactDetails = [
    {
      description: 'registered authentication service',
      spectator: 'auth',
    },
  ];
  const carData: DataElement[] = [
    {
      content: rideProvider.vehicleIdentificationNumber,
      label: 'VIN (Vehicle Identification Number)',
      showContentSpectator: [...showContentSpectatorContactDetails],
    },
    {
      content: rideProvider.vehicleNumberPlate,
      label: 'Vehicle Number Plate',
      showContentSpectator: [...showContentSpectatorContactDetails],
    },
  ];
  const personalData: DataElement[] = [];
  if ('company' in rideProvider) {
    personalData.push({
      content: rideProvider.company,
      label: 'Company',
      showContentSpectator: [...showContentSpectatorContactDetails],
    });
  } else {
    personalData.push(
      ...[
        {
          content: rideProvider.dateOfBirth,
          label: 'Date of birth',
          showContentSpectator: [...showContentSpectatorContactDetails],
        },
        {
          content: rideProvider.emailAddress,
          label: 'Email Address',
          showContentSpectator: [...showContentSpectatorContactDetails],
        },
        {
          content: rideProvider.fullName,
          label: 'Full Name',
          showContentSpectator: [...showContentSpectatorContactDetails],
        },
        {
          content: rideProvider.gender,
          label: 'Gender',
          showContentSpectator: [...showContentSpectatorContactDetails],
        },
        {
          content: rideProvider.homeAddress,
          label: 'Home Address',
          showContentSpectator: [...showContentSpectatorContactDetails],
        },
        {
          content: rideProvider.phoneNumber,
          label: 'Phone Number',
          showContentSpectator: [...showContentSpectatorContactDetails],
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
      {rideProvider.passengerList !== undefined ? (
        rideProvider.passengerList.map((passengerId, index) => (
          <ChangeViewButton
            key={`passenger_${passengerId}_${index}`}
            actorId={passengerId}
            icon={<DirectionsWalkIcon />}
            label={`passenger #${index}`}
            setStateSpectator={setStateSpectator}
            isPseudonym={true}
            showError={stateShowError}
            fetchJsonSimulation={fetchJsonSimulation}
            stateSelectedParticipant={stateSelectedParticipant}
            stateSpectator={stateSpectator}
            stateSelectedRideRequest={stateSelectedRideRequest}
          />
        ))
      ) : (
        <></>
      )}
      <Divider>
        <Chip icon={<TravelExploreIcon />} label="Ride Request" size="small" />
      </Divider>
      <Typography variant="body2" gutterBottom>
        {rideProvider.rideRequest !== undefined ? (
          <Button
            variant="contained"
            startIcon={<TravelExploreIcon />}
            onClick={() =>
              setStateSelectedRideRequest(rideProvider.rideRequest)
            }
          >
            Show ride request ({rideProvider.rideRequest})
          </Button>
        ) : (
          <></>
        )}
      </Typography>
    </>
  );
}
