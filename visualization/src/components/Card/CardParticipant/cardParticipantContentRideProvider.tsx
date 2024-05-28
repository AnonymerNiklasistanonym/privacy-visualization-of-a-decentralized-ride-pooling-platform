// Package imports
// > Components
import {Button, List, Typography} from '@mui/material';
// Local imports
import {dataModalInformationPersonalData} from './PopupContentGeneric';
// > Components
import {
  ParticipantCustomerIcon,
  ParticipantPersonalDataIcon,
  ParticipantRideProviderIcon,
  ParticipantRideRequestIcon,
} from '@components/Icons';
import {ParticipantsRideProvider} from '@components/Tab/TabOverview/Elements';
import {RenderDataElement} from './PopupContentGeneric';
// > Components
import ChangeViewButton from '@components/Button/ChangeViewButton';
// Type imports
import type {CardGenericPropsContentElement} from '@components/Card/CardGeneric';
import type {ChangeViewButtonProps} from '@components/Button/ChangeViewButton';
import type {DataElement} from './PopupContentGeneric';
import type {GlobalPropsSpectatorSelectedElementsSet} from '@misc/props/global';
import type {SimulationEndpointParticipantInformationRideProvider} from '@globals/types/simulation';

export interface CardParticipantContentRideProviderProps
  extends GlobalPropsSpectatorSelectedElementsSet,
    ChangeViewButtonProps {}

export default function cardParticipantContentCustomer(
  props: CardParticipantContentRideProviderProps,
  rideProvider?: SimulationEndpointParticipantInformationRideProvider
) {
  const {setStateSelectedRideRequest} = props;
  const result: Array<CardGenericPropsContentElement> = [];
  const showContentSpectatorContactDetails = [
    {
      description: 'registered authentication service',
      spectator: 'auth',
    },
  ];
  const carData: DataElement[] = [];
  const personalData: DataElement[] = [];
  if (rideProvider !== undefined) {
    carData.push(
      ...[
        {
          content: rideProvider.vehicleIdentificationNumber,
          dataAccessInformation: [...dataModalInformationPersonalData],
          label: 'VIN (Vehicle Identification Number)',
          showContentSpectator: [...showContentSpectatorContactDetails],
        },
        {
          content: rideProvider.vehicleNumberPlate,
          dataAccessInformation: [...dataModalInformationPersonalData],
          label: 'Vehicle Number Plate',
          showContentSpectator: [...showContentSpectatorContactDetails],
        },
      ]
    );
    if ('company' in rideProvider) {
      personalData.push({
        content: rideProvider.company,
        dataAccessInformation: [...dataModalInformationPersonalData],
        label: 'Company',
        showContentSpectator: [...showContentSpectatorContactDetails],
      });
    } else {
      personalData.push(
        ...[
          {
            content: rideProvider.dateOfBirth,
            dataAccessInformation: [...dataModalInformationPersonalData],
            label: 'Date of birth',
            showContentSpectator: [...showContentSpectatorContactDetails],
          },
          {
            content: rideProvider.emailAddress,
            dataAccessInformation: [...dataModalInformationPersonalData],
            label: 'Email Address',
            showContentSpectator: [...showContentSpectatorContactDetails],
          },
          {
            content: rideProvider.fullName,
            dataAccessInformation: [...dataModalInformationPersonalData],
            label: 'Full Name',
            showContentSpectator: [...showContentSpectatorContactDetails],
          },
          {
            content: rideProvider.gender,
            dataAccessInformation: [...dataModalInformationPersonalData],
            label: 'Gender',
            showContentSpectator: [...showContentSpectatorContactDetails],
          },
          {
            content: rideProvider.homeAddress,
            dataAccessInformation: [...dataModalInformationPersonalData],
            label: 'Home Address',
            showContentSpectator: [...showContentSpectatorContactDetails],
          },
          {
            content: rideProvider.phoneNumber,
            dataAccessInformation: [...dataModalInformationPersonalData],
            label: 'Phone Number',
            showContentSpectator: [...showContentSpectatorContactDetails],
          },
        ]
      );
    }
  }
  result.push({
    content: (
      <List>
        {rideProvider !== undefined
          ? carData.map((a, index) => (
              <RenderDataElement
                {...props}
                key={`render-car-data-element-${index}`}
                element={a}
                id={rideProvider.id}
                dataOriginName={`Ride Provider (${rideProvider.id})`}
                dataOriginId={rideProvider.id}
                dataOriginIcon={<ParticipantRideProviderIcon />}
                dataOriginInformation={<ParticipantsRideProvider />}
                dataAccessInformation={a.dataAccessInformation}
              />
            ))
          : null}
      </List>
    ),
    label: 'Car Details',
    labelIcon: <ParticipantRideProviderIcon />,
  });
  if (rideProvider !== undefined) {
    result.push({
      content: (
        <List>
          {rideProvider !== undefined
            ? personalData.map((a, index) => (
                <RenderDataElement
                  {...props}
                  key={`render-personal-data-element-${index}`}
                  element={a}
                  id={rideProvider.id}
                  dataOriginName={`Ride Provider (${rideProvider.id})`}
                  dataOriginId={rideProvider.id}
                  dataOriginIcon={<ParticipantRideProviderIcon />}
                  dataOriginInformation={<ParticipantsRideProvider />}
                  dataAccessInformation={a.dataAccessInformation}
                />
              ))
            : null}
        </List>
      ),
      label: 'Personal Details',
      labelIcon: <ParticipantPersonalDataIcon />,
    });
  }
  if (
    rideProvider?.passengerList !== undefined &&
    rideProvider?.passengerList.length > 0
  ) {
    result.push({
      content: (
        <>
          {rideProvider.passengerList.map((passengerId, index) => (
            <ChangeViewButton
              {...props}
              key={`passenger_${passengerId}_${index}`}
              actorId={passengerId}
              icon={<ParticipantCustomerIcon />}
              label={`passenger #${index}`}
              isPseudonym={true}
            />
          ))}
        </>
      ),
      label: 'Passengers',
      labelIcon: <ParticipantRideProviderIcon />,
    });
  }
  if (rideProvider?.rideRequest !== undefined) {
    result.push({
      content: (
        <Typography variant="body2" gutterBottom>
          <Button
            variant="contained"
            startIcon={<ParticipantRideRequestIcon />}
            onClick={() =>
              setStateSelectedRideRequest(rideProvider.rideRequest)
            }
          >
            Show ride request ({rideProvider.rideRequest})
          </Button>
        </Typography>
      ),
      label: 'Ride Request',
      labelIcon: <ParticipantRideRequestIcon />,
    });
  }
  return result;
}
