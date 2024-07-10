// Package imports
import {ReactElement, memo, useMemo} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {Button, List} from '@mui/material';
// Local imports
// > Components
import {DataElement, RenderDataElement} from './PopupContentGeneric';
import {
  ParticipantCustomerIcon,
  ParticipantPersonalDataIcon,
  ParticipantQueriesIcon,
  ParticipantRideProviderIcon,
  ServiceAuthenticationIcon,
  ServiceMatchingIcon,
  SettingsDebugIcon,
  SpectatorPublicIcon,
} from '@components/Icons';
import {
  ParticipantsCustomer,
  ParticipantsRideProvider,
  Public,
  ServiceAuthentication,
  ServiceMatching,
} from '@components/Tab/TabOverview/Elements';
import ButtonChangeSpectator from '@components/Button/ButtonChangeSpectator';
import ButtonShowSpectator from '@components/Button/ButtonShowSpectator';
import CardGeneric from '@components/Card/CardGeneric';
// > Misc
import {SpectatorId} from '@misc/spectatorIds';
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
import type {ButtonChangeSpectatorProps} from '@components/Button/ButtonChangeSpectator';
import type {ButtonShowSpectatorProps} from '@components/Button/ButtonShowSpectator';
import type {DataModalInformation} from '@components/Modal/ModalData';
import type {GlobalPropsIntlValues} from '@misc/props/global';
import type {ReactState} from '@misc/react';
import type {SettingsGlobalProps} from '@misc/props/settings';

export interface CardParticipantProps
  extends ButtonChangeSpectatorProps,
    ButtonShowSpectatorProps,
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
    stateSpectatorId,
    stateSelectedParticipantId,
    stateParticipantId,
    stateCustomerInformation,
    stateRideProviderInformation,
    participantType,
    stateSettingsGlobalDebug,
    intlValues,
    label,
  } = props;
  const intl = useIntl();

  const dataAccessPersonalData = useMemo<Array<DataModalInformation>>(
    () => [
      {
        accessType: 'local_storage',
        description: intl.formatMessage({id: 'dataAccess.personalData.as'}),
        icon: <ServiceAuthenticationIcon />,
        name: intl.formatMessage({
          id: 'getacar.spectator.service.authentication',
        }),
        spectatorId: SpectatorId.AUTHENTICATION_SERVICE,
        spectatorInformation: <ServiceAuthentication intlValues={intlValues} />,
      },
      {
        accessType: 'none',
        description: intl.formatMessage({id: 'dataAccess.personalData.ms'}),
        icon: <ServiceMatchingIcon />,
        name: intl.formatMessage({id: 'getacar.service.match'}),
        spectatorId: SpectatorId.MATCHING_SERVICE,
        spectatorInformation: <ServiceMatching intlValues={intlValues} />,
      },
      {
        accessType: 'none',
        description: intl.formatMessage({
          id: 'dataAccess.NotPubliclyAvailable',
        }),
        icon: <SpectatorPublicIcon />,
        name: intl.formatMessage({id: 'getacar.spectator.public'}),
        spectatorId: SpectatorId.PUBLIC,
        spectatorInformation: <Public intlValues={intlValues} />,
      },
    ],
    [intl, intlValues]
  );

  const content = useMemo<Array<CardGenericPropsContentElement>>(() => {
    const contentList: Array<CardGenericPropsContentElement> = [];
    if (participantType === 'customer') {
      const dataAccessDriver: DataModalInformation[] = [];
      if (stateCustomerInformation?.passenger) {
        dataAccessDriver.push({
          accessType: 'transitive',
          description: intl.formatMessage({
            id: 'getacar.spectator.message.driver.dataAccess',
          }),
          icon: <ParticipantRideProviderIcon />,
          isPseudonym: true,
          name: intl.formatMessage(
            {id: 'current'},
            {
              name: intl.formatMessage({
                id: 'getacar.spectator.message.driver',
              }),
            }
          ),
          spectatorId: stateCustomerInformation.passenger,
        });
      }
      const personalData: DataElement[] = [];
      if (stateCustomerInformation) {
        personalData.push(
          ...[
            {
              content: stateCustomerInformation.dateOfBirth,
              dataAccessInformation: [...dataAccessPersonalData],
              label: 'Date of birth',
            },
            {
              content: stateCustomerInformation.emailAddress,
              dataAccessInformation: [...dataAccessPersonalData],
              label: 'Email Address',
            },
            {
              content: stateCustomerInformation.fullName,
              dataAccessInformation: [...dataAccessPersonalData],
              label: 'Full Name',
            },
            {
              content: stateCustomerInformation.gender,
              dataAccessInformation: [
                ...dataAccessPersonalData,
                ...dataAccessDriver,
              ],
              label: 'Gender',
            },
            {
              content: stateCustomerInformation.homeAddress,
              dataAccessInformation: [...dataAccessPersonalData],
              label: 'Home Address',
            },
            {
              content: stateCustomerInformation.phoneNumber,
              dataAccessInformation: [...dataAccessPersonalData],
              label: 'Phone Number',
            },
          ]
        );
      }
      contentList.push({
        content: (
          <List key={`participant-list-personalData-${stateParticipantId}`}>
            {stateCustomerInformation
              ? personalData.map(a => (
                  <RenderDataElement
                    {...props}
                    key={`render-data-element-${a.label}-${stateParticipantId}`}
                    element={a}
                    id={stateCustomerInformation.id}
                    dataOriginName={intl.formatMessage(
                      {
                        id: 'getacar.participant.customer.name',
                      },
                      {
                        name: stateCustomerInformation.id,
                      }
                    )}
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
      contentList.push({
        content: (
          <List key={`participant-list-queries-${stateParticipantId}`}>
            {stateCustomerInformation ? (
              <RenderDataElement
                {...props}
                key={'render-data-element-queries'}
                element={{
                  content:
                    stateCustomerInformation.roundedRating !== -1
                      ? stateCustomerInformation.roundedRating
                      : intl.formatMessage({
                          id: 'getacar.participant.data.roundedRating.notAvailable',
                        }),
                  dataAccessInformation: dataAccessPersonalData,
                  label: intl.formatMessage({
                    id: 'getacar.participant.data.roundedRating',
                  }),
                }}
                id={stateCustomerInformation.id}
                dataOriginName={intl.formatMessage(
                  {
                    id: 'getacar.participant.customer.name',
                  },
                  {
                    name: stateCustomerInformation.id,
                  }
                )}
                dataOriginId={stateCustomerInformation.id}
                dataOriginIcon={<ParticipantCustomerIcon />}
                dataOriginInformation={
                  <ParticipantsCustomer intlValues={intlValues} />
                }
                dataAccessInformation={dataAccessPersonalData}
              />
            ) : null}
          </List>
        ),
        label: intl.formatMessage({id: 'data.section.queries'}),
        labelIcon: <ParticipantQueriesIcon />,
      });
      if (stateCustomerInformation?.passenger !== undefined) {
        contentList.push({
          content: (
            <ButtonShowSpectator
              {...props}
              key={`participant-change-spectator-rideProvider-${stateParticipantId}`}
              spectatorId={stateCustomerInformation.passenger}
              icon={<ParticipantRideProviderIcon />}
              label={intl.formatMessage({
                id: 'getacar.spectator.message.driver',
              })}
              isPseudonym={true}
            />
          ),
          label: intl.formatMessage({
            id: 'getacar.spectator.message.driver',
          }),
          labelIcon: <ParticipantRideProviderIcon />,
        });
      }
    }
    if (participantType === 'ride_provider') {
      if (stateRideProviderInformation) {
        const dataAccessPassenger: DataModalInformation[] = [];
        if (stateRideProviderInformation.passengerList !== undefined) {
          for (const passenger of stateRideProviderInformation.passengerList) {
            dataAccessPassenger.push({
              accessType: 'transitive',
              description: intl.formatMessage({
                id: 'getacar.spectator.message.passenger.dataAccess',
              }),
              icon: <ParticipantRideProviderIcon />,
              isPseudonym: true,
              name: intl.formatMessage(
                {id: 'current'},
                {
                  name: intl.formatMessage({
                    id: 'getacar.spectator.message.passenger',
                  }),
                }
              ),
              spectatorId: passenger,
            });
          }
        }

        const carData: DataElement[] = [];
        carData.push(
          ...[
            {
              content: stateRideProviderInformation.vehicleIdentificationNumber,
              dataAccessInformation: [...dataAccessPersonalData],
              label: 'VIN (Vehicle Identification Number)',
            },
            {
              content: stateRideProviderInformation.vehicleNumberPlate,
              dataAccessInformation: [
                ...dataAccessPersonalData,
                ...dataAccessPassenger,
              ],
              label: 'Vehicle Number Plate',
            },
          ]
        );
        contentList.push({
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
        const personalData: DataElement[] = [];
        if ('company' in stateRideProviderInformation) {
          personalData.push({
            content: stateRideProviderInformation.company,
            dataAccessInformation: [...dataAccessPersonalData],
            label: 'Company',
          });
        } else {
          personalData.push(
            ...[
              {
                content: stateRideProviderInformation.dateOfBirth,
                dataAccessInformation: [...dataAccessPersonalData],
                label: 'Date of birth',
              },
              {
                content: stateRideProviderInformation.emailAddress,
                dataAccessInformation: [...dataAccessPersonalData],
                label: 'Email Address',
              },
              {
                content: stateRideProviderInformation.fullName,
                dataAccessInformation: [...dataAccessPersonalData],
                label: 'Full Name',
              },
              {
                content: stateRideProviderInformation.gender,
                dataAccessInformation: [
                  ...dataAccessPersonalData,
                  ...dataAccessPassenger,
                ],
                label: 'Gender',
              },
              {
                content: stateRideProviderInformation.homeAddress,
                dataAccessInformation: [...dataAccessPersonalData],
                label: 'Home Address',
              },
              {
                content: stateRideProviderInformation.phoneNumber,
                dataAccessInformation: [...dataAccessPersonalData],
                label: 'Phone Number',
              },
            ]
          );
        }
        contentList.push({
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
      contentList.push({
        content: (
          <List key={`participant-list-queries-${stateParticipantId}`}>
            {stateRideProviderInformation ? (
              <RenderDataElement
                {...props}
                key={'render-data-element-queries'}
                element={{
                  content:
                    stateRideProviderInformation.roundedRating !== -1
                      ? stateRideProviderInformation.roundedRating
                      : intl.formatMessage({
                          id: 'getacar.participant.data.roundedRating.notAvailable',
                        }),
                  dataAccessInformation: dataAccessPersonalData,
                  label: intl.formatMessage({
                    id: 'getacar.participant.data.roundedRating',
                  }),
                }}
                id={stateRideProviderInformation.id}
                dataOriginName={intl.formatMessage(
                  {
                    id: 'getacar.participant.rideProvider.name',
                  },
                  {
                    name: stateRideProviderInformation.id,
                  }
                )}
                dataOriginId={stateRideProviderInformation.id}
                dataOriginIcon={<ParticipantRideProviderIcon />}
                dataOriginInformation={
                  <ParticipantsRideProvider intlValues={intlValues} />
                }
                dataAccessInformation={dataAccessPersonalData}
              />
            ) : null}
          </List>
        ),
        label: intl.formatMessage({id: 'data.section.queries'}),
        labelIcon: <ParticipantQueriesIcon />,
      });
      if (
        stateRideProviderInformation?.passengerList !== undefined &&
        stateRideProviderInformation?.passengerList.length > 0
      ) {
        contentList.push({
          content: (
            <List key={`participant-list-passengers-${stateParticipantId}`}>
              {stateRideProviderInformation.passengerList.map(
                (passengerId, index) => (
                  <ButtonShowSpectator
                    {...props}
                    key={`passenger-${passengerId}-${stateParticipantId}`}
                    spectatorId={passengerId}
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
    if (stateSettingsGlobalDebug === true) {
      contentList.push({
        content: (
          <List
            key={`debug-list-${stateParticipantId}`}
            sx={{
              overflowX: 'scroll',
            }}
          >
            {Object.entries(stateRideProviderInformation ?? {}).map(
              ([key, value]) => (
                <RenderDataElement
                  {...props}
                  key={`debug-data-element-ride-provider-${stateParticipantId}-${key}`}
                  element={{
                    content:
                      typeof value === 'string' ? value : JSON.stringify(value),
                    dataAccessInformation: [],
                    label: key,
                  }}
                  id={stateParticipantId}
                  dataOriginName={`Debug Participant [Ride Provider] (${stateParticipantId})`}
                  dataOriginId={stateParticipantId}
                  dataOriginIcon={<ParticipantRideProviderIcon />}
                  dataOriginInformation={
                    <ParticipantsRideProvider intlValues={intlValues} />
                  }
                  dataAccessInformation={[]}
                />
              )
            )}
            {Object.entries(stateCustomerInformation ?? {}).map(
              ([key, value]) => (
                <RenderDataElement
                  {...props}
                  key={`debug-data-element-customer-${stateParticipantId}-${key}`}
                  element={{
                    content:
                      typeof value === 'string' ? value : JSON.stringify(value),
                    dataAccessInformation: [],
                    label: key,
                  }}
                  id={stateParticipantId}
                  dataOriginName={`Debug Participant [Customer] (${stateParticipantId})`}
                  dataOriginId={stateParticipantId}
                  dataOriginIcon={<ParticipantCustomerIcon />}
                  dataOriginInformation={
                    <ParticipantsCustomer intlValues={intlValues} />
                  }
                  dataAccessInformation={[]}
                />
              )
            )}
          </List>
        ),
        label: intl.formatMessage({
          id: 'page.home.tab.settings.card.debug.title',
        }),
        labelIcon: <SettingsDebugIcon />,
      });
    }
    return contentList;
  }, [
    dataAccessPersonalData,
    intl,
    intlValues,
    participantType,
    props,
    stateCustomerInformation,
    stateParticipantId,
    stateRideProviderInformation,
    stateSettingsGlobalDebug,
  ]);

  /** Action buttons based on global state */
  const actions = useMemo<Array<ReactElement>>(() => {
    const actionsList = [
      <ButtonChangeSpectator
        {...props}
        key={`action-change-spectator-${stateParticipantId}`}
        spectatorId={stateParticipantId}
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
  const finalLabel = useMemo<string | undefined>(() => {
    const labels = [
      stateSpectatorId === stateParticipantId
        ? intl.formatMessage({id: 'getacar.spectator.current'})
        : undefined,
      stateSelectedParticipantId === stateParticipantId
        ? intl.formatMessage({id: 'getacar.spectator.selected'})
        : undefined,
      label,
    ].filter(a => a !== undefined);
    return labels.length > 0 ? labels.join('/') : undefined;
  }, [
    intl,
    label,
    stateParticipantId,
    stateSelectedParticipantId,
    stateSpectatorId,
  ]);

  return (
    <CardGeneric
      {...props}
      key={`generic-card-${stateParticipantId}`}
      label={finalLabel}
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
