// Package imports
import {ReactElement, memo, useMemo} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {List} from '@mui/material';
// Local imports
// > Components
import {
  CompanyIcon,
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
  ModalDataInformationAccess,
  ModalDataInformationOrigin,
} from '@components/Modal/ModalData';
import type {
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantTypes,
} from '@globals/types/simulation';
import type {InputButtonSpectatorChangeProps} from '@components/Input/InputButton/InputButtonSpectatorChange';
import type {InputButtonSpectatorShowProps} from '@components/Input/InputButton/InputButtonSpectatorShow';
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
    stateSpectators,
    setStateDataModalInformation,
    setStateOpenModalData,
    stateOpenModalData,
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
  const propsDataAccessElement = useMemo<DataAccessElementProps>(() => {
    debugComponentElementUpdate(
      `CardParticipant#propsDataAccessElement#${stateParticipantId}`
    );
    return {
      setStateDataModalInformation,
      setStateOpenModalData,
      stateOpenModalData,
      stateSelectedParticipantId,
      stateSelectedSmartContractId,
      stateShowParticipantId,
      stateSpectatorId,
      stateSpectators,
    };
  }, [
    setStateDataModalInformation,
    setStateOpenModalData,
    stateOpenModalData,
    stateParticipantId,
    stateSelectedParticipantId,
    stateSelectedSmartContractId,
    stateShowParticipantId,
    stateSpectatorId,
    stateSpectators,
  ]);

  // Icons
  const iconRideProvider = useMemo(() => <ParticipantRideProviderIcon />, []);
  const iconCustomer = useMemo(() => <ParticipantCustomerIcon />, []);
  const iconAuth = useMemo(() => <ServiceAuthenticationIcon />, []);
  const iconMatch = useMemo(() => <ServiceMatchingIcon />, []);
  const iconEverything = useMemo(() => <SpectatorEverythingIcon />, []);
  const iconPersonalDetails = useMemo(
    () => <ParticipantPersonalDataIcon />,
    []
  );
  const iconQueries = useMemo(() => <ParticipantQueriesIcon />, []);
  const iconCompany = useMemo(() => <CompanyIcon />, []);
  const iconDebug = useMemo(() => <SettingsDebugIcon />, []);

  // Spectator infos
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
  const spectatorInfoCustomer = useMemo(
    () => <ParticipantsCustomer intlValues={intlValues} />,
    [intlValues]
  );
  const spectatorInfoRideProvider = useMemo(
    () => <ParticipantsRideProvider intlValues={intlValues} />,
    [intlValues]
  );

  // Data access lists
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
  const dataAccessCustomerPassenger = useMemo<
    Array<ModalDataInformationAccess>
  >(() => {
    const dataAccessCustomerPassengerList: Array<ModalDataInformationAccess> =
      [];
    if (stateCustomerInformation?.passenger) {
      dataAccessCustomerPassengerList.push({
        accessType: 'transitive',
        description: intl.formatMessage({
          id: 'getacar.participant.rideProvider.driver.message.dataAccess',
        }),
        icon: iconRideProvider,
        isPseudonym: true,
        name: intl.formatMessage({
          id: 'getacar.participant.rideProvider.driver',
        }),
        spectatorId: stateCustomerInformation.passenger,
      });
    }
    return [
      ...dataAccessCustomerPassengerList,
      {
        accessType: 'transitive',
        description: intl.formatMessage({id: 'dataAccess.driver.as'}),
        icon: iconAuth,
        name: intl.formatMessage({
          id: 'getacar.spectator.service.authentication',
        }),
        spectatorId: SpectatorId.AUTHENTICATION_SERVICE,
        spectatorInformation: spectatorInfoAuth,
      },
      {
        accessType: 'transitive',
        description: intl.formatMessage({id: 'dataAccess.driverPassenger.ms'}),
        icon: iconMatch,
        name: intl.formatMessage({id: 'getacar.service.match'}),
        spectatorId: SpectatorId.MATCHING_SERVICE,
        spectatorInformation: spectatorInfoMatch,
      },
      ...dataAccessNotPublic,
    ];
  }, [
    dataAccessNotPublic,
    iconAuth,
    iconMatch,
    iconRideProvider,
    intl,
    spectatorInfoAuth,
    spectatorInfoMatch,
    stateCustomerInformation?.passenger,
  ]);
  const dataAccessRideProviderDriver = useMemo<
    Array<ModalDataInformationAccess>
  >(() => {
    const dataAccessRideProviderDriverList: Array<ModalDataInformationAccess> =
      [];
    if (stateRideProviderInformation?.passengerList !== undefined) {
      stateRideProviderInformation.passengerList.map(passengerPseudonym => {
        dataAccessRideProviderDriverList.push({
          accessType: 'transitive',
          description: intl.formatMessage({
            id: 'getacar.participant.customer.passenger.message.dataAccess',
          }),
          icon: iconRideProvider,
          isPseudonym: true,
          name: intl.formatMessage({
            id: 'getacar.participant.rideProvider.passenger',
          }),
          spectatorId: passengerPseudonym,
        });
      });
    }
    return [
      ...dataAccessRideProviderDriverList,
      {
        accessType: 'transitive',
        description: intl.formatMessage({id: 'dataAccess.passenger.as'}),
        icon: iconAuth,
        name: intl.formatMessage({
          id: 'getacar.spectator.service.authentication',
        }),
        spectatorId: SpectatorId.AUTHENTICATION_SERVICE,
        spectatorInformation: spectatorInfoAuth,
      },
      {
        accessType: 'transitive',
        description: intl.formatMessage({id: 'dataAccess.driverPassenger.ms'}),
        icon: iconMatch,
        name: intl.formatMessage({id: 'getacar.service.match'}),
        spectatorId: SpectatorId.MATCHING_SERVICE,
        spectatorInformation: spectatorInfoMatch,
      },
      ...dataAccessNotPublic,
    ];
  }, [
    dataAccessNotPublic,
    iconAuth,
    iconMatch,
    iconRideProvider,
    intl,
    spectatorInfoAuth,
    spectatorInfoMatch,
    stateRideProviderInformation?.passengerList,
  ]);

  // Data access infos
  const contentPersonalData = useMemo<Array<DataAccessElementInfo>>(() => {
    const personalData: Array<DataAccessElementInfo> = [];
    if (participantType === 'customer') {
      if (stateCustomerInformation?.dateOfBirth) {
        personalData.push({
          content: stateCustomerInformation.dateOfBirth,
          dataAccessInformation: dataAccessPersonalData,
          label: intl.formatMessage({id: 'data.section.personalDetails.dob'}),
        });
      }
      if (stateCustomerInformation?.emailAddress) {
        personalData.push({
          content: stateCustomerInformation.emailAddress,
          dataAccessInformation: dataAccessPersonalData,
          label: intl.formatMessage({id: 'data.section.personalDetails.email'}),
        });
      }
      if (stateCustomerInformation?.fullName) {
        personalData.push({
          content: stateCustomerInformation.fullName,
          dataAccessInformation: dataAccessPersonalData,
          label: intl.formatMessage({
            id: 'data.section.personalDetails.fullName',
          }),
        });
      }
      if (stateCustomerInformation?.gender) {
        personalData.push({
          content: stateCustomerInformation.gender,
          dataAccessInformation: dataAccessPersonalData,
          label: intl.formatMessage({
            id: 'data.section.personalDetails.gender',
          }),
        });
      }
      if (stateCustomerInformation?.homeAddress) {
        personalData.push({
          content: stateCustomerInformation.homeAddress,
          dataAccessInformation: dataAccessPersonalData,
          label: intl.formatMessage({
            id: 'data.section.personalDetails.address.home',
          }),
        });
      }
      if (stateCustomerInformation?.phoneNumber) {
        personalData.push({
          content: stateCustomerInformation.phoneNumber,
          dataAccessInformation: dataAccessPersonalData,
          label: intl.formatMessage({id: 'data.section.personalDetails.phone'}),
        });
      }
    }
    return personalData;
  }, [
    dataAccessPersonalData,
    intl,
    participantType,
    stateCustomerInformation?.dateOfBirth,
    stateCustomerInformation?.emailAddress,
    stateCustomerInformation?.fullName,
    stateCustomerInformation?.gender,
    stateCustomerInformation?.homeAddress,
    stateCustomerInformation?.phoneNumber,
  ]);
  const contentCarData = useMemo<Array<DataAccessElementInfo>>(() => {
    const carData: Array<DataAccessElementInfo> = [];
    if (participantType === 'ride_provider') {
      if (stateRideProviderInformation?.vehicleIdentificationNumber) {
        carData.push({
          content: stateRideProviderInformation.vehicleIdentificationNumber,
          dataAccessInformation: dataAccessPersonalData,
          label: intl.formatMessage({id: 'data.section.carDetails.vin'}),
        });
      }
      if (stateRideProviderInformation?.vehicleNumberPlate) {
        carData.push({
          content: stateRideProviderInformation.vehicleNumberPlate,
          dataAccessInformation: dataAccessPersonalData,
          label: intl.formatMessage({id: 'data.section.carDetails.vnp'}),
        });
      }
    }
    return carData;
  }, [
    dataAccessPersonalData,
    intl,
    participantType,
    stateRideProviderInformation?.vehicleIdentificationNumber,
    stateRideProviderInformation?.vehicleNumberPlate,
  ]);
  const contentQueries = useMemo<Array<DataAccessElementInfo>>(() => {
    const queryData: Array<DataAccessElementInfo> = [];

    const dataNotAvailable = intl.formatMessage({
      id: 'getacar.participant.data.rating.notAvailable',
    });

    if (participantType === 'customer') {
      if (stateCustomerInformation?.roundedRating !== undefined) {
        queryData.push({
          content:
            stateCustomerInformation.roundedRating !== -1
              ? stateCustomerInformation.roundedRating
              : dataNotAvailable,
          dataAccessInformation: dataAccessQueryRoundedRating,
          label: intl.formatMessage({
            id: 'getacar.participant.data.rating.rounded',
          }),
        });
      }
      if (stateCustomerInformation?.realRating !== undefined) {
        queryData.push({
          content:
            stateCustomerInformation.realRating !== -1
              ? stateCustomerInformation.realRating
              : dataNotAvailable,
          dataAccessInformation: dataAccessQueryRealRating,
          label: intl.formatMessage({id: 'getacar.participant.data.rating'}),
        });
      }
    }
    if (participantType === 'ride_provider') {
      if (stateRideProviderInformation?.roundedRating !== undefined) {
        queryData.push({
          content:
            stateRideProviderInformation.roundedRating !== -1
              ? stateRideProviderInformation.roundedRating
              : dataNotAvailable,
          dataAccessInformation: dataAccessQueryRoundedRating,
          label: intl.formatMessage({
            id: 'getacar.participant.data.rating.rounded',
          }),
        });
      }
      if (stateRideProviderInformation?.realRating !== undefined) {
        queryData.push({
          content:
            stateRideProviderInformation.realRating !== -1
              ? stateRideProviderInformation.realRating
              : dataNotAvailable,
          dataAccessInformation: dataAccessQueryRealRating,
          label: intl.formatMessage({id: 'getacar.participant.data.rating'}),
        });
      }
    }
    return queryData;
  }, [
    dataAccessQueryRealRating,
    dataAccessQueryRoundedRating,
    intl,
    participantType,
    stateCustomerInformation?.realRating,
    stateCustomerInformation?.roundedRating,
    stateRideProviderInformation?.realRating,
    stateRideProviderInformation?.roundedRating,
  ]);
  const contentCompanyData = useMemo<Array<DataAccessElementInfo>>(() => {
    const companyData: Array<DataAccessElementInfo> = [];

    if (
      participantType === 'ride_provider' &&
      stateRideProviderInformation !== null &&
      'company' in stateRideProviderInformation
    ) {
      if (stateRideProviderInformation.company) {
        companyData.push({
          content: stateRideProviderInformation.company,
          dataAccessInformation: dataAccessPersonalData,
          label: intl.formatMessage({
            id: 'data.section.companyDetails.company',
          }),
        });
      }
    }
    return companyData;
  }, [
    dataAccessPersonalData,
    intl,
    participantType,
    stateRideProviderInformation,
  ]);
  const contentDebug = useMemo<Array<DataAccessElementInfo>>(() => {
    const contentList: Array<DataAccessElementInfo> = [];
    if (stateSettingsGlobalDebug === true) {
      for (const [label, value] of [
        ...Object.entries(stateRideProviderInformation ?? {}),
        ...Object.entries(stateCustomerInformation ?? {}),
      ]) {
        contentList.push({
          content:
            typeof value === 'string' || typeof value === 'number'
              ? value
              : JSON.stringify(value),
          dataAccessInformation: dataAccessDebug,
          label: label,
        });
      }
    }
    return contentList;
  }, [
    dataAccessDebug,
    stateCustomerInformation,
    stateRideProviderInformation,
    stateSettingsGlobalDebug,
  ]);

  // Origin information
  const originCustomer = useMemo<ModalDataInformationOrigin>(() => {
    const spectator = stateSpectators.get(stateParticipantId);
    return {
      dataOriginIcon: spectator?.icon ?? iconCustomer,
      dataOriginId: stateParticipantId,
      dataOriginInformation: spectatorInfoCustomer,
      dataOriginName:
        spectator !== undefined
          ? `${spectator.name} [${stateParticipantId}]`
          : intl.formatMessage(
              {
                id: 'getacar.participant.customer.name',
              },
              {
                name: stateParticipantId,
              }
            ),
    };
  }, [
    iconCustomer,
    intl,
    spectatorInfoCustomer,
    stateParticipantId,
    stateSpectators,
  ]);
  const originRideProvider = useMemo<ModalDataInformationOrigin>(() => {
    const spectator = stateSpectators.get(stateParticipantId);
    return {
      dataOriginIcon: spectator?.icon ?? iconRideProvider,
      dataOriginId: stateParticipantId,
      dataOriginInformation: spectatorInfoRideProvider,
      dataOriginName:
        spectator !== undefined
          ? `${spectator.name} [${stateParticipantId}]`
          : intl.formatMessage(
              {
                id: 'getacar.participant.rideProvider.name',
              },
              {
                name: stateParticipantId,
              }
            ),
    };
  }, [
    iconRideProvider,
    intl,
    spectatorInfoRideProvider,
    stateParticipantId,
    stateSpectators,
  ]);
  const originAuth = useMemo<ModalDataInformationOrigin>(() => {
    return {
      dataOriginIcon: iconAuth,
      dataOriginId: SpectatorId.AUTHENTICATION_SERVICE,
      dataOriginInformation: spectatorInfoAuth,
      dataOriginName: intl.formatMessage({
        id: 'getacar.service.auth',
      }),
    };
  }, [iconAuth, intl, spectatorInfoAuth]);

  // Other information
  const isCompanyCar = useMemo<boolean>(
    () =>
      stateRideProviderInformation !== null &&
      'company' in stateRideProviderInformation,
    [stateRideProviderInformation]
  );

  /** Card content */
  const content = useMemo<Array<CardGenericPropsContentElement>>(() => {
    debugComponentElementUpdate(
      `CardParticipant#content#${stateParticipantId}`
    );

    const contentList: Array<CardGenericPropsContentElement> = [];
    if (participantType === 'customer') {
      contentList.push({
        content:
          contentPersonalData.length > 0 ? (
            <List key={`participant-list-personalData-${stateParticipantId}`}>
              {contentPersonalData.map(element => (
                <DataAccessElement
                  {...propsDataAccessElement}
                  {...originCustomer}
                  {...element}
                  key={`render-data-element-${element.label}-${stateParticipantId}`}
                  id={stateParticipantId}
                />
              ))}
            </List>
          ) : null,
        label: intl.formatMessage({id: 'data.section.personalDetails'}),
        labelIcon: iconPersonalDetails,
      });
      contentList.push({
        content:
          contentQueries.length > 0 ? (
            <List key={`participant-list-queries-${stateParticipantId}`}>
              {contentQueries.map(element => (
                <DataAccessElement
                  {...propsDataAccessElement}
                  {...originAuth}
                  {...element}
                  key={`render-data-element-${element.label}-${stateParticipantId}`}
                  id={stateParticipantId}
                />
              ))}
            </List>
          ) : null,
        label: intl.formatMessage({id: 'data.section.queries'}),
        labelIcon: iconQueries,
      });
      if (stateCustomerInformation?.passenger !== undefined) {
        contentList.push({
          content: (
            <List
              key={`participant-list-customerPassenger-${stateParticipantId}`}
            >
              <DataAccessElement
                {...propsDataAccessElement}
                {...originCustomer}
                key={`render-data-element-customerPassenger-${stateParticipantId}`}
                id={stateParticipantId}
                label={intl.formatMessage({
                  id: 'getacar.participant.rideProvider.driver',
                })}
                content={
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
                }
                dataAccessInformation={dataAccessCustomerPassenger}
              />
            </List>
          ),
          label: intl.formatMessage({
            id: 'getacar.participant.rideProvider.driver',
          }),
          labelIcon: iconRideProvider,
        });
      }
    }
    if (participantType === 'ride_provider') {
      contentList.push({
        content:
          contentCarData.length > 0 ? (
            <List key={`participant-list-carData-${stateParticipantId}`}>
              {contentCarData.map(element => (
                <DataAccessElement
                  {...propsDataAccessElement}
                  {...originRideProvider}
                  {...element}
                  key={`render-data-element-${element.label}-${stateParticipantId}`}
                  id={stateParticipantId}
                />
              ))}
            </List>
          ) : null,
        label: intl.formatMessage({id: 'data.section.carDetails'}),
        labelIcon: iconRideProvider,
      });
      if (isCompanyCar) {
        contentList.push({
          content:
            contentCompanyData.length > 0 ? (
              <List key={`participant-list-companyData-${stateParticipantId}`}>
                {contentCompanyData.map(element => (
                  <DataAccessElement
                    {...propsDataAccessElement}
                    {...originRideProvider}
                    {...element}
                    key={`render-data-element-${element.label}-${stateParticipantId}`}
                    id={stateParticipantId}
                  />
                ))}
              </List>
            ) : null,
          label: intl.formatMessage({id: 'data.section.companyDetails'}),
          labelIcon: iconCompany,
        });
      } else {
        contentList.push({
          content:
            contentPersonalData.length > 0 ? (
              <List key={`participant-list-personalData-${stateParticipantId}`}>
                {contentPersonalData.map(element => (
                  <DataAccessElement
                    {...propsDataAccessElement}
                    {...originRideProvider}
                    {...element}
                    key={`render-data-element-${element.label}-${stateParticipantId}`}
                    id={stateParticipantId}
                  />
                ))}
              </List>
            ) : null,
          label: intl.formatMessage({id: 'data.section.personalDetails'}),
          labelIcon: iconPersonalDetails,
        });
      }
      contentList.push({
        content:
          contentQueries.length > 0 ? (
            <List key={`participant-list-queries-${stateParticipantId}`}>
              {contentQueries.map(element => (
                <DataAccessElement
                  {...propsDataAccessElement}
                  {...originAuth}
                  {...element}
                  key={`render-data-element-${element.label}-${stateParticipantId}`}
                  id={stateParticipantId}
                />
              ))}
            </List>
          ) : null,
        label: intl.formatMessage({id: 'data.section.queries'}),
        labelIcon: iconQueries,
      });
      if (stateRideProviderInformation?.passengerList !== undefined) {
        contentList.push({
          content: (
            <List key={`participant-list-passengerList-${stateParticipantId}`}>
              {stateRideProviderInformation.passengerList.map(
                (passengerPseudonym, index) => (
                  <DataAccessElement
                    {...propsDataAccessElement}
                    {...originRideProvider}
                    key={`render-data-element-passengerList-${passengerPseudonym}-${stateParticipantId}`}
                    id={stateParticipantId}
                    label={intl.formatMessage(
                      {
                        id: 'getacar.participant.rideProvider.passengerNumber',
                      },
                      {
                        name: index,
                      }
                    )}
                    content={
                      <InputButtonSpectatorShow
                        {...propsInputButton}
                        key={`participant-change-spectator-customer-${stateParticipantId}`}
                        spectatorId={passengerPseudonym}
                        icon={iconCustomer}
                        label={intl.formatMessage(
                          {
                            id: 'getacar.participant.rideProvider.passengerNumber',
                          },
                          {
                            name: index,
                          }
                        )}
                        isPseudonym={true}
                      />
                    }
                    dataAccessInformation={dataAccessRideProviderDriver}
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
    return contentList;
  }, [
    contentCarData,
    contentCompanyData,
    contentPersonalData,
    contentQueries,
    dataAccessCustomerPassenger,
    dataAccessRideProviderDriver,
    iconCompany,
    iconCustomer,
    iconPersonalDetails,
    iconQueries,
    iconRideProvider,
    intl,
    isCompanyCar,
    originAuth,
    originCustomer,
    originRideProvider,
    participantType,
    propsDataAccessElement,
    propsInputButton,
    stateCustomerInformation?.passenger,
    stateParticipantId,
    stateRideProviderInformation?.passengerList,
  ]);

  const contentDebug2 = useMemo<Array<CardGenericPropsContentElement>>(() => {
    debugComponentElementUpdate(
      `CardParticipant#contentDebug#${stateParticipantId}`
    );

    const contentList: Array<CardGenericPropsContentElement> = [];
    if (stateSettingsGlobalDebug === true) {
      contentList.push({
        content:
          contentDebug.length > 0 ? (
            <List
              key={`participant-list-debug-${stateParticipantId}`}
              sx={{
                overflowX: 'scroll',
              }}
            >
              {contentDebug.map(element => (
                <DataAccessElement
                  {...propsDataAccessElement}
                  dataOriginName={intl.formatMessage({
                    id: 'page.home.tab.settings.card.debug.title',
                  })}
                  dataOriginId={SpectatorId.EVERYTHING}
                  dataOriginIcon={iconEverything}
                  {...element}
                  key={`render-data-element-${element.label}-${stateParticipantId}`}
                  id={stateParticipantId}
                />
              ))}
            </List>
          ) : null,
        label: intl.formatMessage({
          id: 'page.home.tab.settings.card.debug.title',
        }),
        labelIcon: iconDebug,
      });
    }
    return contentList;
  }, [
    contentDebug,
    iconDebug,
    iconEverything,
    intl,
    propsDataAccessElement,
    stateParticipantId,
    stateSettingsGlobalDebug,
  ]);

  const contentFinal = useMemo<Array<CardGenericPropsContentElement>>(() => {
    debugComponentElementUpdate(
      `CardParticipant#contentFinal#${stateParticipantId}`
    );

    return [...content, ...contentDebug2];
  }, [content, contentDebug2, stateParticipantId]);

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
      content={contentFinal}
      actions={actions}
    />
  );
}
