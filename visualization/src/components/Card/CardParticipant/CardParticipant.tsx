// Package imports
import {memo, useMemo} from 'react';
// > Components
import {Button, List, Typography} from '@mui/material';
// Local imports
import {dataModalInformationPersonalData} from './PopupContentGeneric';
// > Components
import {DataElement, RenderDataElement} from './PopupContentGeneric';
import {
  ParticipantCustomerIcon,
  ParticipantPersonalDataIcon,
  ParticipantRideProviderIcon,
  ParticipantRideRequestIcon,
} from '@components/Icons';
import {
  ParticipantsCustomer,
  ParticipantsRideProvider,
} from '@components/Tab/TabOverview/Elements';
import CardGeneric from '@components/Card/CardGeneric';
import ChangeViewButton from '@components/Button/ChangeViewButton';
// Type imports
import type {
  CardGenericProps,
  CardGenericPropsContentElement,
} from '@components/Card/CardGeneric';
import type {
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantTypes,
} from '@globals/types/simulation';
import type {ChangeViewButtonProps} from '@components/Button/ChangeViewButton';
import type {DataModalInformation} from '@components/Modal/DataModal';
import type {ReactState} from '@misc/react';

export interface CardParticipantProps
  extends ChangeViewButtonProps,
    CardGenericProps {
  stateParticipantId: ReactState<string>;
  stateCustomerInformation: ReactState<null | SimulationEndpointParticipantInformationCustomer>;
  stateRideProviderInformation: ReactState<null | SimulationEndpointParticipantInformationRideProvider>;
  participantType: SimulationEndpointParticipantTypes;
  showRideRequest?: boolean;
}

export default memo(CardParticipant);

export function CardParticipant(props: CardParticipantProps) {
  const {
    setStateSelectedRideRequest,
    showRideRequest,
    stateParticipantId,
    stateCustomerInformation,
    stateRideProviderInformation,
    participantType,
  } = props;
  const content: CardGenericPropsContentElement[] = useMemo(() => {
    const result: Array<CardGenericPropsContentElement> = [];
    if (participantType === 'customer') {
      const showContentSpectatorContactDetails = [
        {
          description: 'registered authentication service',
          spectator: 'auth',
        },
      ];
      const rideProviderPassenger: DataModalInformation[] = [
        ...(stateCustomerInformation?.passenger !== undefined
          ? [
              {
                accessType: 'transitive',
                description:
                  'Since this customer is a passenger of this ride provider this data is known to them',
                icon: <ParticipantRideProviderIcon />,
                name: 'Current Ride Provider of this customer',
                spectatorId: stateCustomerInformation.passenger,
              } satisfies DataModalInformation,
            ]
          : []),
      ];
      const personalData: DataElement[] = [];
      if (stateCustomerInformation) {
        personalData.push(
          ...[
            {
              content: stateCustomerInformation.dateOfBirth,
              dataAccessInformation: [...dataModalInformationPersonalData],
              label: 'Date of birth',
              showContentSpectator: [...showContentSpectatorContactDetails],
            },
            {
              content: stateCustomerInformation.emailAddress,
              dataAccessInformation: [...dataModalInformationPersonalData],
              label: 'Email Address',
              showContentSpectator: [...showContentSpectatorContactDetails],
            },
            {
              content: stateCustomerInformation.fullName,
              dataAccessInformation: [
                ...dataModalInformationPersonalData,
                ...rideProviderPassenger,
              ],
              label: 'Full Name',
              showContentSpectator: [...showContentSpectatorContactDetails],
            },
            {
              content: stateCustomerInformation.gender,
              dataAccessInformation: [
                ...dataModalInformationPersonalData,
                ...rideProviderPassenger,
              ],
              label: 'Gender',
              showContentSpectator: [...showContentSpectatorContactDetails],
            },
            {
              content: stateCustomerInformation.homeAddress,
              dataAccessInformation: [...dataModalInformationPersonalData],
              label: 'Home Address',
              showContentSpectator: [...showContentSpectatorContactDetails],
            },
            {
              content: stateCustomerInformation.phoneNumber,
              dataAccessInformation: [...dataModalInformationPersonalData],
              label: 'Phone Number',
              showContentSpectator: [...showContentSpectatorContactDetails],
            },
          ]
        );
      }
      result.push({
        content: (
          <List>
            {stateCustomerInformation
              ? personalData.map((a, index) => (
                  <RenderDataElement
                    {...props}
                    key={`render-data-element-${index}`}
                    element={a}
                    id={stateCustomerInformation.id}
                    dataOriginName={`Customer (${stateCustomerInformation.id})`}
                    dataOriginId={stateCustomerInformation.id}
                    dataOriginIcon={<ParticipantCustomerIcon />}
                    dataOriginInformation={<ParticipantsCustomer />}
                    dataAccessInformation={a.dataAccessInformation}
                  />
                ))
              : null}
          </List>
        ),
        label: 'Personal Details',
        labelIcon: <ParticipantPersonalDataIcon />,
      });
      if (stateCustomerInformation?.passenger !== undefined) {
        result.push({
          content: (
            <ChangeViewButton
              {...props}
              actorId={stateCustomerInformation.passenger}
              icon={<ParticipantRideProviderIcon />}
              label={'the current ride provider'}
              isPseudonym={true}
            />
          ),
          label: 'Passenger of Ride Provider',
          labelIcon: <ParticipantRideProviderIcon />,
        });
      }
      if (
        stateCustomerInformation?.rideRequest !== undefined &&
        showRideRequest
      ) {
        result.push({
          content: (
            <Typography variant="body2" gutterBottom>
              <Button
                variant="contained"
                startIcon={<ParticipantRideRequestIcon />}
                onClick={() =>
                  setStateSelectedRideRequest(
                    stateCustomerInformation.rideRequest
                  )
                }
              >
                Show ride request ({stateCustomerInformation.rideRequest})
              </Button>
            </Typography>
          ),
          label: 'Ride Request',
          labelIcon: <ParticipantRideRequestIcon />,
        });
      }
    }
    if (participantType === 'ride_provider') {
      const {setStateSelectedRideRequest, showRideRequest} = props;
      const result: Array<CardGenericPropsContentElement> = [];
      const showContentSpectatorContactDetails = [
        {
          description: 'registered authentication service',
          spectator: 'auth',
        },
      ];
      const carData: DataElement[] = [];
      if (stateRideProviderInformation) {
        carData.push(
          ...[
            {
              content: stateRideProviderInformation.vehicleIdentificationNumber,
              dataAccessInformation: [...dataModalInformationPersonalData],
              label: 'VIN (Vehicle Identification Number)',
              showContentSpectator: [...showContentSpectatorContactDetails],
            },
            {
              content: stateRideProviderInformation.vehicleNumberPlate,
              dataAccessInformation: [...dataModalInformationPersonalData],
              label: 'Vehicle Number Plate',
              showContentSpectator: [...showContentSpectatorContactDetails],
            },
          ]
        );
      }
      const personalData: DataElement[] = [];
      if (stateRideProviderInformation) {
        if ('company' in stateRideProviderInformation) {
          personalData.push({
            content: stateRideProviderInformation.company,
            dataAccessInformation: [...dataModalInformationPersonalData],
            label: 'Company',
            showContentSpectator: [...showContentSpectatorContactDetails],
          });
        } else {
          personalData.push(
            ...[
              {
                content: stateRideProviderInformation.dateOfBirth,
                dataAccessInformation: [...dataModalInformationPersonalData],
                label: 'Date of birth',
                showContentSpectator: [...showContentSpectatorContactDetails],
              },
              {
                content: stateRideProviderInformation.emailAddress,
                dataAccessInformation: [...dataModalInformationPersonalData],
                label: 'Email Address',
                showContentSpectator: [...showContentSpectatorContactDetails],
              },
              {
                content: stateRideProviderInformation.fullName,
                dataAccessInformation: [...dataModalInformationPersonalData],
                label: 'Full Name',
                showContentSpectator: [...showContentSpectatorContactDetails],
              },
              {
                content: stateRideProviderInformation.gender,
                dataAccessInformation: [...dataModalInformationPersonalData],
                label: 'Gender',
                showContentSpectator: [...showContentSpectatorContactDetails],
              },
              {
                content: stateRideProviderInformation.homeAddress,
                dataAccessInformation: [...dataModalInformationPersonalData],
                label: 'Home Address',
                showContentSpectator: [...showContentSpectatorContactDetails],
              },
              {
                content: stateRideProviderInformation.phoneNumber,
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
            {stateRideProviderInformation
              ? carData.map((a, index) => (
                  <RenderDataElement
                    {...props}
                    key={`render-car-data-element-${index}`}
                    element={a}
                    id={stateRideProviderInformation.id}
                    dataOriginName={`Ride Provider (${stateRideProviderInformation.id})`}
                    dataOriginId={stateRideProviderInformation.id}
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
      if (stateRideProviderInformation) {
        result.push({
          content: (
            <List>
              {stateRideProviderInformation
                ? personalData.map((a, index) => (
                    <RenderDataElement
                      {...props}
                      key={`render-car-personal-data-element-${index}`}
                      element={a}
                      id={stateRideProviderInformation.id}
                      dataOriginName={`Ride Provider (${stateRideProviderInformation.id})`}
                      dataOriginId={stateRideProviderInformation.id}
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
        stateRideProviderInformation?.passengerList !== undefined &&
        stateRideProviderInformation?.passengerList.length > 0
      ) {
        result.push({
          content: (
            <>
              {stateRideProviderInformation.passengerList.map(
                (passengerId, index) => (
                  <ChangeViewButton
                    {...props}
                    key={`passenger_${passengerId}_${index}`}
                    actorId={passengerId}
                    icon={<ParticipantCustomerIcon />}
                    label={`passenger #${index}`}
                    isPseudonym={true}
                  />
                )
              )}
            </>
          ),
          label: 'Passengers',
          labelIcon: <ParticipantRideProviderIcon />,
        });
      }
      if (
        stateRideProviderInformation?.rideRequest !== undefined &&
        showRideRequest
      ) {
        result.push({
          content: (
            <Typography variant="body2" gutterBottom>
              <Button
                variant="contained"
                startIcon={<ParticipantRideRequestIcon />}
                onClick={() =>
                  setStateSelectedRideRequest(
                    stateRideProviderInformation.rideRequest
                  )
                }
              >
                Show ride request ({stateRideProviderInformation.rideRequest})
              </Button>
            </Typography>
          ),
          label: 'Ride Request',
          labelIcon: <ParticipantRideRequestIcon />,
        });
      }
    }
    return result;
  }, [
    participantType,
    props,
    setStateSelectedRideRequest,
    showRideRequest,
    stateCustomerInformation,
    stateRideProviderInformation,
  ]);
  const actions = useMemo(
    () => [
      <ChangeViewButton
        {...props}
        key={`spectate-button-${stateParticipantId}`}
        actorId={stateParticipantId}
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
      />,
    ],
    [participantType, props, stateParticipantId]
  );
  return (
    <CardGeneric
      {...props}
      icon={
        participantType === 'customer' ? (
          <ParticipantCustomerIcon />
        ) : (
          <ParticipantRideProviderIcon />
        )
      }
      name={participantType === 'customer' ? 'Customer' : 'Ride Provider'}
      id={stateParticipantId}
      status={
        participantType === 'customer'
          ? stateCustomerInformation?.simulationStatus
          : stateRideProviderInformation?.simulationStatus
      }
      content={content}
      actions={actions}
    />
  );
}
