// Package imports
import {ReactElement, memo, useMemo} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {List} from '@mui/material';
// Local imports
// > Components
import {
  NavigateToLocationIcon,
  ParticipantCustomerIcon,
  ParticipantPersonalDataIcon,
  ParticipantQueriesIcon,
  ParticipantRideProviderIcon,
  ServiceAuthenticationIcon,
  ServiceMatchingIcon,
  SettingsDebugIcon,
  SpectatorEverythingIcon,
} from '@components/Icons';
import {
  ParticipantsCustomer,
  ParticipantsRideProvider,
  Public,
  ServiceAuthentication,
  ServiceMatching,
} from '@components/Tab/TabGuide';
import CardGeneric from '@components/Card/CardGeneric';
import DataAccessElement from '@components/DataAccessElement';
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
  DataAccessElementInfo,
  DataAccessElementProps,
} from '@components/DataAccessElement';
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
    DataAccessElementProps,
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
  const iconAuth = useMemo(() => <ServiceAuthenticationIcon />, []);
  const iconMatch = useMemo(() => <ServiceMatchingIcon />, []);
  const iconEverything = useMemo(() => <SpectatorEverythingIcon />, []);

  const spectatorInfoPublic = useMemo(
    () => <Public intlValues={intlValues} />,
    [intlValues]
  );
  const spectatorInfoAuth = useMemo(
    () => <ServiceAuthentication intlValues={intlValues} />,
    [intlValues]
  );
  const spectatorInfoMatch = useMemo(
    () => <ServiceMatching intlValues={intlValues} />,
    [intlValues]
  );

  const dataAccessNotPublic = useMemo<Array<ModalDataInformationAccess>>(
    () => [
      {
        accessType: 'none',
        description: intl.formatMessage({
          id: 'dataAccess.NotPubliclyAvailable',
        }),
        icon: iconEverything,
        name: intl.formatMessage({id: 'getacar.spectator.public'}),
        spectatorId: SpectatorId.PUBLIC,
        spectatorInformation: spectatorInfoPublic,
      },
    ],
    [iconEverything, intl, spectatorInfoPublic]
  );

  const dataAccessPersonalData = useMemo<Array<ModalDataInformationAccess>>(
    () => [
      {
        accessType: 'local_storage',
        description: intl.formatMessage({id: 'dataAccess.personalData.as'}),
        icon: iconAuth,
        name: intl.formatMessage({
          id: 'getacar.spectator.service.authentication',
        }),
        spectatorId: SpectatorId.AUTHENTICATION_SERVICE,
        spectatorInformation: spectatorInfoAuth,
      },
      {
        accessType: 'none',
        description: intl.formatMessage({id: 'dataAccess.personalData.ms'}),
        icon: iconMatch,
        name: intl.formatMessage({id: 'getacar.service.match'}),
        spectatorId: SpectatorId.MATCHING_SERVICE,
        spectatorInformation: spectatorInfoMatch,
      },
      ...dataAccessNotPublic,
    ],
    [
      dataAccessNotPublic,
      iconAuth,
      iconMatch,
      intl,
      spectatorInfoAuth,
      spectatorInfoMatch,
    ]
  );

  const dataAccessQueryRealRating = useMemo<Array<ModalDataInformationAccess>>(
    () => [
      {
        accessType: 'transitive',
        description: intl.formatMessage({id: 'dataAccess.queryData.rating.as'}),
        icon: iconAuth,
        name: intl.formatMessage({
          id: 'getacar.spectator.service.authentication',
        }),
        spectatorId: SpectatorId.AUTHENTICATION_SERVICE,
        spectatorInformation: spectatorInfoAuth,
      },
      ...dataAccessNotPublic,
    ],
    [dataAccessNotPublic, iconAuth, intl, spectatorInfoAuth]
  );

  const dataAccessQueryRoundedRating = useMemo<
    Array<ModalDataInformationAccess>
  >(
    () => [
      {
        accessType: 'transitive',
        description: intl.formatMessage({
          id: 'dataAccess.queryData.rating.rounded.as',
        }),
        icon: iconAuth,
        name: intl.formatMessage({
          id: 'getacar.spectator.service.authentication',
        }),
        spectatorId: SpectatorId.AUTHENTICATION_SERVICE,
        spectatorInformation: spectatorInfoAuth,
      },
      {
        accessType: 'transitive',
        description: intl.formatMessage({
          id: 'dataAccess.queryData.rating.rounded.ms',
        }),
        icon: iconMatch,
        name: intl.formatMessage({id: 'getacar.service.match'}),
        spectatorId: SpectatorId.MATCHING_SERVICE,
        spectatorInformation: spectatorInfoMatch,
      },
      ...dataAccessNotPublic,
    ],
    [
      dataAccessNotPublic,
      iconAuth,
      iconMatch,
      intl,
      spectatorInfoAuth,
      spectatorInfoMatch,
    ]
  );

  const dataAccessDebug = useMemo<Array<ModalDataInformationAccess>>(
    () => [...dataAccessNotPublic],
    [dataAccessNotPublic]
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
      const personalData: Array<DataAccessElementInfo> = [];
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
            {personalData.map(({content, dataAccessInformation, label}) => (
              <DataAccessElement
                {...props}
                key={`render-data-element-${label}-${stateParticipantId}`}
                content={content}
                label={label}
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
                dataAccessInformation={dataAccessInformation}
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
            <DataAccessElement
              {...props}
              key={'render-data-element-queries-rating-rounded'}
              content={
                stateCustomerInformation.roundedRating !== undefined &&
                stateCustomerInformation.roundedRating !== -1
                  ? stateCustomerInformation.roundedRating
                  : intl.formatMessage({
                      id: 'getacar.participant.data.rating.notAvailable',
                    })
              }
              label={intl.formatMessage({
                id: 'getacar.participant.data.rating.rounded',
              })}
              id={stateCustomerInformation.id}
              dataOriginName={intl.formatMessage({
                id: 'getacar.service.auth',
              })}
              dataOriginId={SpectatorId.AUTHENTICATION_SERVICE}
              dataOriginIcon={iconAuth}
              dataOriginInformation={spectatorInfoAuth}
              dataAccessInformation={dataAccessQueryRoundedRating}
            />
            <DataAccessElement
              {...props}
              key={'render-data-element-queries-rating'}
              content={
                stateCustomerInformation.realRating !== undefined &&
                stateCustomerInformation.realRating !== -1
                  ? stateCustomerInformation.realRating
                  : intl.formatMessage({
                      id: 'getacar.participant.data.rating.notAvailable',
                    })
              }
              label={intl.formatMessage({
                id: 'getacar.participant.data.rating',
              })}
              id={stateCustomerInformation.id}
              dataOriginName={intl.formatMessage({
                id: 'getacar.service.auth',
              })}
              dataOriginId={SpectatorId.AUTHENTICATION_SERVICE}
              dataOriginIcon={iconAuth}
              dataOriginInformation={spectatorInfoAuth}
              dataAccessInformation={dataAccessQueryRealRating}
            />
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

      const carData: Array<DataAccessElementInfo> = [];
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
              {carData.map((element, index) => (
                <DataAccessElement
                  {...props}
                  {...element}
                  key={`render-car-data-element-${index}`}
                  id={stateParticipantId}
                  dataOriginName={`Ride Provider (${stateParticipantId})`}
                  dataOriginId={stateParticipantId}
                  dataOriginIcon={iconRideProvider}
                  dataOriginInformation={
                    <ParticipantsRideProvider intlValues={intlValues} />
                  }
                />
              ))}
            </List>
          ) : null,
        label: 'Car Details',
        labelIcon: iconRideProvider,
      });
      const personalData: Array<DataAccessElementInfo> = [];
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
              {personalData.map((element, index) => (
                <DataAccessElement
                  {...props}
                  {...element}
                  key={`render-car-personal-data-element-${index}`}
                  id={stateParticipantId}
                  dataOriginName={`Ride Provider (${stateParticipantId})`}
                  dataOriginId={stateParticipantId}
                  dataOriginIcon={iconRideProvider}
                  dataOriginInformation={
                    <ParticipantsRideProvider intlValues={intlValues} />
                  }
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
            <DataAccessElement
              {...props}
              key={'render-data-element-queries-roundedRating'}
              content={
                stateRideProviderInformation.roundedRating !== undefined &&
                stateRideProviderInformation.roundedRating !== -1
                  ? stateRideProviderInformation.roundedRating
                  : intl.formatMessage({
                      id: 'getacar.participant.data.rating.notAvailable',
                    })
              }
              label={intl.formatMessage({
                id: 'getacar.participant.data.rating.rounded',
              })}
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
              dataAccessInformation={dataAccessQueryRoundedRating}
            />
            <DataAccessElement
              {...props}
              key={'render-data-element-queries-realRating'}
              content={
                stateRideProviderInformation.realRating !== undefined &&
                stateRideProviderInformation.realRating !== -1
                  ? stateRideProviderInformation.realRating
                  : intl.formatMessage({
                      id: 'getacar.participant.data.rating.notAvailable',
                    })
              }
              label={intl.formatMessage({
                id: 'getacar.participant.data.rating',
              })}
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
              dataAccessInformation={dataAccessQueryRealRating}
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
            {[
              ...Object.entries(stateRideProviderInformation ?? {}),
              ...Object.entries(stateCustomerInformation ?? {}),
            ].map(([key, value]) => (
              <DataAccessElement
                {...props}
                key={`debug-data-element-${stateParticipantId}-${key}`}
                content={
                  typeof value === 'string' || typeof value === 'number'
                    ? value
                    : JSON.stringify(value)
                }
                label={key}
                id={stateParticipantId}
                dataOriginName="Debug"
                dataOriginId={SpectatorId.EVERYTHING}
                dataOriginIcon={iconEverything}
                dataAccessInformation={dataAccessDebug}
              />
            ))}
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
    dataAccessDebug,
    dataAccessPersonalData,
    dataAccessQueryRealRating,
    dataAccessQueryRoundedRating,
    iconAuth,
    iconCustomer,
    iconEverything,
    iconRideProvider,
    intl,
    intlValues,
    participantType,
    props,
    propsInputButton,
    spectatorInfoAuth,
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
