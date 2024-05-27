// Package imports
// > Components
import {Button, Chip, Divider, List, Typography} from '@mui/material';
// Local imports
import {RenderDataElement} from './PopupContentGeneric';
// > Components
import {
  ParticipantCustomerIcon,
  ParticipantPersonalDataIcon,
  ParticipantRideProviderIcon,
  ParticipantRideRequestIcon,
} from '@components/Icons';
import ChangeViewButton from '@components/Button/ChangeViewButton';
import {ParticipantsRideProvider} from '@components/Tab/TabOverview/Elements';
// Type imports
import type {ChangeViewButtonProps} from '@components/Button/ChangeViewButton';
import type {DataElement} from './PopupContentGeneric';
import type {GlobalPropsSpectatorSelectedElementsSet} from '@misc/props/global';
import type {SimulationEndpointParticipantInformationRideProvider} from '@globals/types/simulation';

export interface PopupContentRideProviderProps
  extends GlobalPropsSpectatorSelectedElementsSet,
    ChangeViewButtonProps {
  rideProvider: SimulationEndpointParticipantInformationRideProvider;
}

export default function PopupContentRideProvider(
  props: PopupContentRideProviderProps
) {
  const {rideProvider, setStateSelectedRideRequest} = props;
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
        <Chip
          icon={<ParticipantRideProviderIcon />}
          label="Car Details"
          size="small"
        />
      </Divider>
      <List>
        {carData.map(a => (
          <RenderDataElement
            {...props}
            key={`car-data-${a.label}`}
            element={a}
            id={rideProvider.id}
            dataOriginId={rideProvider.id}
            dataOriginIcon={<ParticipantRideProviderIcon />}
            dataOriginName={`Ride Provider (${rideProvider.id})`}
            dataOriginInformation={<ParticipantsRideProvider />}
          />
        ))}
      </List>
      <Divider>
        <Chip
          icon={<ParticipantPersonalDataIcon />}
          label="Personal Details"
          size="small"
        />
      </Divider>
      <List>
        {personalData.map(a => (
          <RenderDataElement
            {...props}
            key={`personal-data-${a.label}`}
            element={a}
            id={rideProvider.id}
            dataOriginId={rideProvider.id}
            dataOriginIcon={<ParticipantRideProviderIcon />}
            dataOriginName={`Ride Provider (${rideProvider.id})`}
            dataOriginInformation={<ParticipantsRideProvider />}
          />
        ))}
      </List>
      <Divider>
        <Chip
          icon={<ParticipantRideProviderIcon />}
          label="Passenger List"
          size="small"
        />
      </Divider>
      {rideProvider.passengerList !== undefined ? (
        rideProvider.passengerList.map((passengerId, index) => (
          <ChangeViewButton
            {...props}
            key={`passenger_${passengerId}_${index}`}
            actorId={passengerId}
            icon={<ParticipantCustomerIcon />}
            label={`passenger #${index}`}
            isPseudonym={true}
          />
        ))
      ) : (
        <></>
      )}
      <Divider>
        <Chip
          icon={<ParticipantRideRequestIcon />}
          label="Ride Request"
          size="small"
        />
      </Divider>
      <Typography variant="body2" gutterBottom>
        {rideProvider.rideRequest !== undefined ? (
          <Button
            variant="contained"
            startIcon={<ParticipantRideRequestIcon />}
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
