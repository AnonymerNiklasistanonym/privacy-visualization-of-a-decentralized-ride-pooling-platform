// Package imports
import {ReactElement, memo, useMemo} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {Button, List} from '@mui/material';
// Local imports
import {dataModalInformationPersonalData} from './PopupContentGeneric';
// > Components
import {DataElement, RenderDataElement} from './PopupContentGeneric';
import {
  ParticipantCustomerIcon,
  ParticipantPersonalDataIcon,
  ParticipantQueriesIcon,
  ParticipantRideProviderIcon,
} from '@components/Icons';
import {
  ParticipantsCustomer,
  ParticipantsRideProvider,
} from '@components/Tab/TabOverview/Elements';
import CardGeneric from '@components/Card/CardGeneric';
import ChangeSpectatorButton from '@components/Button/ChangeSpectatorButton';
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
import type {ChangeViewButtonProps} from '@components/Button/ChangeSpectatorButton';
import type {DataModalInformation} from '@components/Modal/DataModal';
import type {GlobalPropsIntlValues} from '@misc/props/global';
import type {ReactState} from '@misc/react';
import {SettingsGlobalProps} from '@misc/props/settings';

export interface CardParticipantProps
  extends ChangeViewButtonProps,
    CardGenericProps,
    GlobalPropsIntlValues,
    SettingsGlobalProps {
  stateParticipantId: ReactState<string>;
  stateCustomerInformation: ReactState<null | SimulationEndpointParticipantInformationCustomer>;
  stateRideProviderInformation: ReactState<null | SimulationEndpointParticipantInformationRideProvider>;
  participantType: SimulationEndpointParticipantTypes;
  showRideRequest?: boolean;
}

export default memo(CardParticipant);

export function CardParticipant(props: CardParticipantProps) {
  const {
    stateSpectator,
    stateSelectedSpectator,
    stateParticipantId,
    stateCustomerInformation,
    stateRideProviderInformation,
    participantType,
    stateSettingsGlobalDebug,
    intlValues,
  } = props;
  const intl = useIntl();
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
          <List key={`participant-list-personalData-${stateParticipantId}`}>
            {stateCustomerInformation
              ? personalData.map(a => (
                  <RenderDataElement
                    {...props}
                    key={`render-data-element-${a.label}-${stateParticipantId}`}
                    element={a}
                    id={stateCustomerInformation.id}
                    dataOriginName={`Customer (${stateCustomerInformation.id})`}
                    dataOriginId={stateCustomerInformation.id}
                    dataOriginIcon={<ParticipantCustomerIcon />}
                    dataOriginInformation={
                      <ParticipantsCustomer intlValues={intlValues} />
                    }
                    dataAccessInformation={a.dataAccessInformation}
                  />
                ))
              : null}
          </List>
        ),
        label: intl.formatMessage({id: 'data.section.personalDetails'}),
        labelIcon: <ParticipantPersonalDataIcon />,
      });
      // TODO
      result.push({
        content: (
          <List key={`participant-list-queries-${stateParticipantId}`}>
            {stateCustomerInformation ? (
              <RenderDataElement
                {...props}
                key={'render-data-element-queries'}
                element={{
                  content: 'TODO',
                  dataAccessInformation: dataModalInformationPersonalData,
                  label: 'Rank',
                  showContentSpectator: showContentSpectatorContactDetails,
                }}
                id={stateCustomerInformation.id}
                dataOriginName={`Customer (${stateCustomerInformation.id})`}
                dataOriginId={stateCustomerInformation.id}
                dataOriginIcon={<ParticipantCustomerIcon />}
                dataOriginInformation={
                  <ParticipantsCustomer intlValues={intlValues} />
                }
                dataAccessInformation={dataModalInformationPersonalData}
              />
            ) : null}
          </List>
        ),
        label: intl.formatMessage({id: 'data.section.queries'}),
        labelIcon: <ParticipantQueriesIcon />,
      });
      if (stateCustomerInformation?.passenger !== undefined) {
        result.push({
          content: (
            <ChangeSpectatorButton
              {...props}
              key={`participant-change-spectator-rideProvider-${stateParticipantId}`}
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
      //if (
      //  stateCustomerInformation?.rideRequest !== undefined &&
      //  showRideRequest
      //) {
      //  // TODO Add Ride
      //  result.push({
      //    content: (
      //      <Typography variant="body2" gutterBottom>
      //        <Button
      //          variant="contained"
      //          startIcon={<ParticipantRideRequestIcon />}
      //          onClick={() =>
      //            setStateSelectedRideRequest(
      //              stateCustomerInformation.rideRequest
      //            )
      //          }
      //        >
      //          Show ride request ({stateCustomerInformation.rideRequest})
      //        </Button>
      //      </Typography>
      //    ),
      //    label: 'Ride Request',
      //    labelIcon: <ParticipantRideRequestIcon />,
      //  });
      //}
    }
    if (participantType === 'ride_provider') {
      const showContentSpectatorContactDetails = [
        {
          description: 'registered authentication service',
          spectator: 'auth',
        },
      ];
      if (stateRideProviderInformation) {
        const carData: DataElement[] = [];
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
        result.push({
          content: (
            <List key={`participant-list-carData-${stateParticipantId}`}>
              {carData.map((a, index) => (
                <RenderDataElement
                  {...props}
                  key={`render-car-data-element-${index}`}
                  element={a}
                  id={stateParticipantId}
                  dataOriginName={`Ride Provider (${stateParticipantId})`}
                  dataOriginId={stateParticipantId}
                  dataOriginIcon={<ParticipantRideProviderIcon />}
                  dataOriginInformation={
                    <ParticipantsRideProvider intlValues={intlValues} />
                  }
                  dataAccessInformation={a.dataAccessInformation}
                />
              ))}
            </List>
          ),
          label: 'Car Details',
          labelIcon: <ParticipantRideProviderIcon />,
        });
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
        result.push({
          content: (
            <List
              key={`participant-list-personalCarData-${stateParticipantId}`}
            >
              {personalData.map((a, index) => (
                <RenderDataElement
                  {...props}
                  key={`render-car-personal-data-element-${index}`}
                  element={a}
                  id={stateParticipantId}
                  dataOriginName={`Ride Provider (${stateParticipantId})`}
                  dataOriginId={stateParticipantId}
                  dataOriginIcon={<ParticipantRideProviderIcon />}
                  dataOriginInformation={
                    <ParticipantsRideProvider intlValues={intlValues} />
                  }
                  dataAccessInformation={a.dataAccessInformation}
                />
              ))}
            </List>
          ),
          label: intl.formatMessage({id: 'data.section.personalDetails'}),
          labelIcon: <ParticipantPersonalDataIcon />,
        });
      }
      if (
        stateRideProviderInformation?.passengerList !== undefined &&
        stateRideProviderInformation?.passengerList.length > 0
      ) {
        result.push({
          content: (
            <List key={`participant-list-passengers-${stateParticipantId}`}>
              {stateRideProviderInformation.passengerList.map(
                (passengerId, index) => (
                  <ChangeSpectatorButton
                    {...props}
                    key={`passenger-${passengerId}-${stateParticipantId}`}
                    actorId={passengerId}
                    icon={<ParticipantCustomerIcon />}
                    label={intl.formatMessage(
                      {id: 'getacar.participant.rideProvider.passengerNumber'},
                      {name: index}
                    )}
                    // Passengers are always a pseudonym
                    isPseudonym={true}
                  />
                )
              )}
            </List>
          ),
          label: intl.formatMessage({
            id: 'getacar.participant.rideProvider.passengers',
          }),
          labelIcon: <ParticipantRideProviderIcon />,
        });
      }
      //// TODO Show Ride Request
      //if (
      //  stateRideProviderInformation?.rideRequest !== undefined &&
      //  showRideRequest
      //) {
      //  result.push({
      //    content: (
      //      <Typography variant="body2" gutterBottom>
      //        <Button
      //          variant="contained"
      //          startIcon={<ParticipantRideRequestIcon />}
      //          onClick={() =>
      //            setStateSelectedRideRequest(
      //              stateRideProviderInformation.rideRequest
      //            )
      //          }
      //        >
      //          Show ride request ({stateRideProviderInformation.rideRequest})
      //        </Button>
      //      </Typography>
      //    ),
      //    label: 'Ride Request',
      //    labelIcon: <ParticipantRideRequestIcon />,
      //  });
      //}
    }
    return result;
  }, [
    intl,
    intlValues,
    participantType,
    props,
    stateCustomerInformation,
    stateParticipantId,
    stateRideProviderInformation,
  ]);

  /** Action buttons based on global state */
  const actions = useMemo<Array<ReactElement>>(() => {
    const actionsList = [
      <ChangeSpectatorButton
        {...props}
        key={`action-change-spectator-${stateParticipantId}`}
        actorId={stateParticipantId}
        icon={
          participantType === 'customer' ? (
            <ParticipantCustomerIcon />
          ) : (
            <ParticipantRideProviderIcon />
          )
        }
        isPseudonym={false}
        label={intl.formatMessage(
          {id: 'getacar.spectator.this'},
          {
            name:
              participantType === 'customer'
                ? intl.formatMessage({id: 'getacar.participant.customer'})
                : intl.formatMessage({id: 'getacar.participant.rideProvider'}),
          }
        )}
      />,
    ];
    if (stateSettingsGlobalDebug) {
      actionsList.push(
        <Button
          key={`action-debug-${stateParticipantId}`}
          onClick={() =>
            console.warn('DEBUG participant information', {
              participantType,
              stateCustomerInformation,
              stateParticipantId,
              stateRideProviderInformation,
            })
          }
        >
          DEBUG participant information
        </Button>
      );
    }
    return actionsList;
  }, [
    intl,
    participantType,
    props,
    stateCustomerInformation,
    stateParticipantId,
    stateRideProviderInformation,
    stateSettingsGlobalDebug,
  ]);

  /** Additional information label based on global state */
  const label = useMemo<string | undefined>(() => {
    const labels = [
      stateSpectator === stateParticipantId
        ? intl.formatMessage({id: 'getacar.spectator.current'})
        : undefined,
      stateSelectedSpectator === stateParticipantId
        ? intl.formatMessage({id: 'getacar.spectator.selected'})
        : undefined,
    ].filter(a => a !== undefined);
    return labels.length > 0 ? labels.join('/') : undefined;
  }, [intl, stateParticipantId, stateSelectedSpectator, stateSpectator]);

  return (
    <CardGeneric
      {...props}
      key={`generic-card-${stateParticipantId}`}
      label={label}
      icon={
        participantType === 'customer' ? (
          <ParticipantCustomerIcon />
        ) : (
          <ParticipantRideProviderIcon />
        )
      }
      name={
        participantType === 'customer'
          ? intl.formatMessage({id: 'getacar.participant.customer'})
          : intl.formatMessage({id: 'getacar.participant.rideProvider'})
      }
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
