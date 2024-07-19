// Package imports
import {ReactElement, memo, useMemo} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {List} from '@mui/material';
// Local imports
// > Components
import {DataElement, RenderDataElement} from './PopupContentGeneric';
import {
  NavigateToLocationIcon,
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
import CardGeneric from '@components/Card/CardGeneric';
import InputButtonSpectatorChange from '@components/Input/InputButton/InputButtonSpectatorChange';
import InputButtonSpectatorShow from '@components/Input/InputButton/InputButtonSpectatorShow';
// > Misc
import {SpectatorId} from '@misc/spectatorIds';
import {debugComponentElementUpdate} from '@misc/debug';
// Type imports
import type {
  CardGenericProps,
  CardGenericPropsContentElement,
} from '@components/Card/CardGeneric';
import type {
  GlobalPropsIntlValues,
  GlobalPropsModalDataInformation,
} from '@misc/props/global';
import type {
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantTypes,
} from '@globals/types/simulation';
import type {InputButtonSpectatorChangeProps} from '@components/Input/InputButton/InputButtonSpectatorChange';
import type {InputButtonSpectatorShowProps} from '@components/Input/InputButton/InputButtonSpectatorShow';
import type {ModalDataInformationAccess} from '@components/Modal/ModalData';
import type {ReactState} from '@misc/react';
import type {SettingsGlobalProps} from '@misc/props/settings';

export interface CardParticipantProps
  extends InputButtonSpectatorChangeProps,
    InputButtonSpectatorShowProps,
    CardGenericProps,
    GlobalPropsIntlValues,
    GlobalPropsModalDataInformation,
    SettingsGlobalProps {}

export interface CardParticipantPropsInput extends CardParticipantProps {
  stateParticipantId: ReactState<string>;
  stateCustomerInformation: ReactState<null | SimulationEndpointParticipantInformationCustomer>;
  stateRideProviderInformation: ReactState<null | SimulationEndpointParticipantInformationRideProvider>;
  participantType: SimulationEndpointParticipantTypes;
  showRideRequest?: boolean;
}

export default memo(CardParticipant);

export function CardParticipant(props: CardParticipantPropsInput) {
  const {
    fetchJsonSimulation,
    fetchJsonSimulationWait,
    fixMarker,
    intlValues,
    label,
    participantType,
    setStateSelectedParticipantId,
    setStateSelectedSmartContractId,
    setStateShowParticipantId,
    setStateSpectatorId,
    setStateTabIndex,
    showError,
    stateCustomerInformation,
    stateParticipantId,
    stateRideProviderInformation,
    stateSelectedParticipantId,
    stateSelectedSmartContractId,
    stateSettingsGlobalDebug,
    stateShowParticipantId,
    stateSpectatorId,
  } = props;

  const intl = useIntl();

  const propsInputButton = useMemo<
    InputButtonSpectatorShowProps & InputButtonSpectatorChangeProps
  >(() => {
    debugComponentElementUpdate(
      `CardParticipant#propsInputButton#${stateParticipantId}`
    );
    return {
      fetchJsonSimulation,
      fetchJsonSimulationWait,
      setStateSelectedParticipantId,
      setStateSelectedSmartContractId,
      setStateShowParticipantId,
      setStateSpectatorId,
      setStateTabIndex,
      showError,
      stateSelectedParticipantId,
      stateSelectedSmartContractId,
      stateShowParticipantId,
      stateSpectatorId,
    };
  }, [
    fetchJsonSimulation,
    fetchJsonSimulationWait,
    setStateSelectedParticipantId,
    setStateSelectedSmartContractId,
    setStateShowParticipantId,
    setStateSpectatorId,
    setStateTabIndex,
    showError,
    stateParticipantId,
    stateSelectedParticipantId,
    stateSelectedSmartContractId,
    stateShowParticipantId,
    stateSpectatorId,
  ]);

  const iconRideProvider = useMemo(() => <ParticipantRideProviderIcon />, []);

  const iconCustomer = useMemo(() => <ParticipantCustomerIcon />, []);

  const dataAccessPersonalData = useMemo<Array<ModalDataInformationAccess>>(
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
    debugComponentElementUpdate(
      `CardParticipant#content#${stateParticipantId}`
    );

    const contentList: Array<CardGenericPropsContentElement> = [];
    if (participantType === 'customer') {
      const dataAccessDriver: ModalDataInformationAccess[] = [];
      if (stateCustomerInformation?.passenger) {
        dataAccessDriver.push({
          accessType: 'transitive',
          description: intl.formatMessage({
            id: 'getacar.participant.rideProvider.driver.message.dataAccess',
          }),
          icon: iconRideProvider,
          isPseudonym: true,
          name: intl.formatMessage(
            {id: 'current'},
            {
              name: intl.formatMessage({
                id: 'getacar.participant.rideProvider.driver.message.connected',
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
        content: stateCustomerInformation ? (
          <List key={`participant-list-personalData-${stateParticipantId}`}>
            {personalData.map(a => (
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
                dataOriginIcon={iconCustomer}
                dataOriginInformation={
                  <ParticipantsCustomer intlValues={intlValues} />
                }
                dataAccessInformation={a.dataAccessInformation}
              />
            ))}
          </List>
        ) : null,
        label: intl.formatMessage({id: 'data.section.personalDetails'}),
        labelIcon: <ParticipantPersonalDataIcon />,
      });
      contentList.push({
        content: stateCustomerInformation ? (
          <List key={`participant-list-queries-${stateParticipantId}`}>
            {
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
                dataOriginIcon={iconCustomer}
                dataOriginInformation={
                  <ParticipantsCustomer intlValues={intlValues} />
                }
                dataAccessInformation={dataAccessPersonalData}
              />
            }
          </List>
        ) : null,
        label: intl.formatMessage({id: 'data.section.queries'}),
        labelIcon: <ParticipantQueriesIcon />,
      });
      if (stateCustomerInformation?.passenger !== undefined) {
        contentList.push({
          content: (
            <InputButtonSpectatorShow
              {...propsInputButton}
              key={`participant-change-spectator-rideProvider-${stateParticipantId}`}
              spectatorId={stateCustomerInformation.passenger}
              icon={iconRideProvider}
              label={intl.formatMessage({
                id: 'getacar.participant.rideProvider.driver',
              })}
              isPseudonym={true}
            />
          ),
          label: intl.formatMessage({
            id: 'getacar.participant.rideProvider.driver.message.connected',
          }),
          labelIcon: iconRideProvider,
        });
      }
    }
    if (participantType === 'ride_provider') {
      const dataAccessPassenger: ModalDataInformationAccess[] = [];
      if (stateRideProviderInformation?.passengerList !== undefined) {
        for (const passenger of stateRideProviderInformation.passengerList) {
          dataAccessPassenger.push({
            accessType: 'transitive',
            description: intl.formatMessage({
              id: 'getacar.spectator.message.passenger.dataAccess',
            }),
            icon: iconRideProvider,
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
      if (stateRideProviderInformation) {
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
      }
      contentList.push({
        content:
          carData.length > 0 ? (
            <List key={`participant-list-carData-${stateParticipantId}`}>
              {carData.map((a, index) => (
                <RenderDataElement
                  {...props}
                  key={`render-car-data-element-${index}`}
                  element={a}
                  id={stateParticipantId}
                  dataOriginName={`Ride Provider (${stateParticipantId})`}
                  dataOriginId={stateParticipantId}
                  dataOriginIcon={iconRideProvider}
                  dataOriginInformation={
                    <ParticipantsRideProvider intlValues={intlValues} />
                  }
                  dataAccessInformation={a.dataAccessInformation}
                />
              ))}
            </List>
          ) : null,
        label: 'Car Details',
        labelIcon: iconRideProvider,
      });
      const personalData: DataElement[] = [];
      if (stateRideProviderInformation) {
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
      }
      contentList.push({
        content:
          personalData.length > 0 ? (
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
                  dataOriginIcon={iconRideProvider}
                  dataOriginInformation={
                    <ParticipantsRideProvider intlValues={intlValues} />
                  }
                  dataAccessInformation={a.dataAccessInformation}
                />
              ))}
            </List>
          ) : null,
        label: intl.formatMessage({id: 'data.section.personalDetails'}),
        labelIcon: <ParticipantPersonalDataIcon />,
      });
      contentList.push({
        content: stateRideProviderInformation ? (
          <List key={`participant-list-queries-${stateParticipantId}`}>
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
              dataOriginIcon={iconRideProvider}
              dataOriginInformation={
                <ParticipantsRideProvider intlValues={intlValues} />
              }
              dataAccessInformation={dataAccessPersonalData}
            />
          </List>
        ) : null,
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
                  <InputButtonSpectatorShow
                    {...propsInputButton}
                    key={`passenger-${passengerId}-${stateParticipantId}`}
                    spectatorId={passengerId}
                    icon={iconCustomer}
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
          labelIcon: iconRideProvider,
        });
      }
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
                  dataOriginIcon={iconRideProvider}
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
                  dataOriginIcon={iconCustomer}
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
    iconCustomer,
    iconRideProvider,
    intl,
    intlValues,
    participantType,
    props,
    propsInputButton,
    stateCustomerInformation,
    stateParticipantId,
    stateRideProviderInformation,
    stateSettingsGlobalDebug,
  ]);

  /** Action buttons based on global state */
  const actions = useMemo<Array<ReactElement>>(() => {
    debugComponentElementUpdate(
      `CardParticipant#actions#${stateParticipantId}`
    );

    const actionsList = [
      <InputButtonSpectatorChange
        {...propsInputButton}
        key={`action-change-spectator-${stateParticipantId}`}
        spectatorId={stateParticipantId}
        icon={participantType === 'customer' ? iconCustomer : iconRideProvider}
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
    if (fixMarker !== true) {
      actionsList.push(
        <InputButtonSpectatorShow
          {...propsInputButton}
          key={`action-show-spectator-${stateParticipantId}`}
          spectatorId={stateParticipantId}
          icon={<NavigateToLocationIcon />}
          label={undefined}
        />
      );
    }
    return actionsList;
  }, [
    fixMarker,
    iconCustomer,
    iconRideProvider,
    intl,
    participantType,
    propsInputButton,
    stateParticipantId,
  ]);

  /** Additional information label based on global state */
  const finalLabel = useMemo<string | undefined>(() => {
    const labels = [
      stateSpectatorId === stateParticipantId
        ? intl.formatMessage({id: 'getacar.spectator.current'})
        : undefined,
      stateSelectedParticipantId === stateParticipantId
        ? intl.formatMessage({id: 'getacar.participant.selected'})
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
      icon={participantType === 'customer' ? iconCustomer : iconRideProvider}
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
