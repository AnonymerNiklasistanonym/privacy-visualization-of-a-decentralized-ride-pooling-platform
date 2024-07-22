// Package imports
import {useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {List} from '@mui/material';
// Local imports
// > Components
import {
  ParticipantCustomerIcon,
  ParticipantRideProviderIcon,
  ParticipantRideRequestIcon,
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
import InputButtonSpectatorShow from '@components/Input/InputButton/InputButtonSpectatorShow';
// > Globals
import {simulationEndpoints} from '@globals/defaults/endpoints';
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
  SimulationEndpointParticipantIdFromPseudonym,
  SimulationEndpointRideRequestInformation,
} from '@globals/types/simulation';
import type {InputButtonSpectatorChangeProps} from '@components/Input/InputButton/InputButtonSpectatorChange';
import type {InputButtonSpectatorShowProps} from '@components/Input/InputButton/InputButtonSpectatorShow';
import type {ReactState} from '@misc/react';
import type {SettingsGlobalProps} from '@misc/props/settings';
import useResolvePseudonym from '@/hooks/useResolvePseudonym';

export interface CardRideRequestProps
  extends InputButtonSpectatorChangeProps,
    InputButtonSpectatorShowProps,
    SettingsGlobalProps,
    CardGenericProps,
    DataAccessElementProps,
    GlobalPropsModalDataInformation,
    GlobalPropsIntlValues {}

export interface CardRideRequestPropsInput extends CardRideRequestProps {
  stateRideRequestInformation: ReactState<SimulationEndpointRideRequestInformation | null>;
  stateRideRequestId: ReactState<string>;
}

export default function CardRideRequest(props: CardRideRequestPropsInput) {
  const {
    fetchJsonSimulation,
    showError,
    stateRideRequestInformation,
    stateRideRequestId,
    stateSettingsGlobalDebug,
    intlValues,
    fetchJsonSimulationWait,
    setStateSelectedParticipantId,
    setStateSelectedSmartContractId,
    setStateShowParticipantId,
    setStateSpectatorId,
    setStateTabIndex,
    stateSelectedParticipantId,
    stateSelectedSmartContractId,
    stateShowParticipantId,
    stateSpectatorId,
    setStateDataModalInformation,
    setStateOpenModalData,
    stateOpenModalData,
    stateSpectators,
  } = props;

  const propsInputButton = useMemo<
    InputButtonSpectatorShowProps & InputButtonSpectatorChangeProps
  >(() => {
    debugComponentElementUpdate(
      `CardRideRequest#propsInputButton#${stateRideRequestId}`
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
    stateRideRequestId,
    stateSelectedParticipantId,
    stateSelectedSmartContractId,
    stateShowParticipantId,
    stateSpectatorId,
  ]);
  const propsDataAccessElement = useMemo<DataAccessElementProps>(() => {
    debugComponentElementUpdate(
      `CardRideRequest#propsDataAccessElement#${stateRideRequestId}`
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
    stateRideRequestId,
    stateSelectedParticipantId,
    stateSelectedSmartContractId,
    stateShowParticipantId,
    stateSpectatorId,
    stateSpectators,
  ]);

  const intl = useIntl();

  // React: States
  // > Fetching of actual actor ID in case it was a pseudonym
  const stateResolvedPseudonymCustomer = useResolvePseudonym(
    stateRideRequestInformation?.userId,
    props
  );
  const stateResolvedPseudonymAuctionWinner = useResolvePseudonym(
    stateRideRequestInformation?.auctionWinner,
    props
  );

  // Icons
  const iconRideProvider = useMemo(() => <ParticipantRideProviderIcon />, []);
  const iconCustomer = useMemo(() => <ParticipantCustomerIcon />, []);
  const iconRideRequest = useMemo(() => <ParticipantRideRequestIcon />, []);
  const iconAuth = useMemo(() => <ServiceAuthenticationIcon />, []);
  const iconMatch = useMemo(() => <ServiceMatchingIcon />, []);
  const iconEverything = useMemo(() => <SpectatorEverythingIcon />, []);
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
  const dataAccessDebug = useMemo<Array<ModalDataInformationAccess>>(
    () => [...dataAccessNotPublic],
    [dataAccessNotPublic]
  );
  const dataAccessPseudonyms = useMemo<Array<ModalDataInformationAccess>>(
    () => [
      {
        accessType: 'transitive',
        description: intl.formatMessage({id: 'dataAccess.rideRequestData.as'}),
        icon: iconAuth,
        name: intl.formatMessage({
          id: 'getacar.spectator.service.authentication',
        }),
        spectatorId: SpectatorId.AUTHENTICATION_SERVICE,
        spectatorInformation: spectatorInfoAuth,
      },
      {
        accessType: 'local_storage',
        description: intl.formatMessage({id: 'dataAccess.rideRequestData.ms'}),
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
  const dataAccessPseudonymResolved = useMemo<
    Array<ModalDataInformationAccess>
  >(() => {
    const dataAccessInformationList: Array<ModalDataInformationAccess> = [];
    if (stateResolvedPseudonymCustomer !== undefined) {
      const customer = stateSpectators.get(stateResolvedPseudonymCustomer.id);
      dataAccessInformationList.push({
        accessType: 'transitive',
        description: intl.formatMessage({
          id: 'dataAccess.rideRequestData.customer',
        }),
        icon: iconCustomer,
        name:
          customer !== undefined
            ? `${customer.name} (${stateResolvedPseudonymCustomer.id})`
            : intl.formatMessage(
                {
                  id: 'getacar.participant.customer.name',
                },
                {
                  name: stateResolvedPseudonymCustomer.id,
                }
              ),
        spectatorId: stateResolvedPseudonymCustomer.id,
        spectatorInformation: spectatorInfoCustomer,
      });
    }
    if (stateResolvedPseudonymAuctionWinner !== undefined) {
      const rideProvider = stateSpectators.get(
        stateResolvedPseudonymAuctionWinner.id
      );
      dataAccessInformationList.push({
        accessType: 'transitive',
        description: intl.formatMessage({
          id: 'dataAccess.rideRequestData.rideProvider',
        }),
        icon: iconRideProvider,
        name:
          rideProvider !== undefined
            ? `${rideProvider.name} (${stateResolvedPseudonymAuctionWinner.id})`
            : intl.formatMessage(
                {
                  id: 'getacar.participant.rideProvider.name',
                },
                {
                  name: stateResolvedPseudonymAuctionWinner.id,
                }
              ),
        spectatorId: stateResolvedPseudonymAuctionWinner.id,
        spectatorInformation: spectatorInfoRideProvider,
      });
    }
    return [...dataAccessInformationList, ...dataAccessPseudonyms];
  }, [
    dataAccessPseudonyms,
    iconCustomer,
    iconRideProvider,
    intl,
    spectatorInfoCustomer,
    spectatorInfoRideProvider,
    stateResolvedPseudonymAuctionWinner,
    stateResolvedPseudonymCustomer,
    stateSpectators,
  ]);

  // Origin lists
  const originMatch = useMemo<ModalDataInformationOrigin>(() => {
    return {
      dataOriginIcon: iconMatch,
      dataOriginId: SpectatorId.MATCHING_SERVICE,
      dataOriginInformation: spectatorInfoMatch,
      dataOriginName: intl.formatMessage({
        id: 'getacar.service.match',
      }),
    };
  }, [iconMatch, intl, spectatorInfoMatch]);

  // Content lists
  const contentDebug = useMemo<Array<DataAccessElementInfo>>(() => {
    const contentList: Array<DataAccessElementInfo> = [];
    if (stateSettingsGlobalDebug === true) {
      for (const [label, value] of [
        ...Object.entries(stateRideRequestInformation ?? {}),
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
  }, [dataAccessDebug, stateRideRequestInformation, stateSettingsGlobalDebug]);

  const content = useMemo<Array<CardGenericPropsContentElement>>(() => {
    debugComponentElementUpdate(
      `CardRideRequest#content#${stateRideRequestId}`
    );

    const contentList: Array<CardGenericPropsContentElement> = [];
    if (stateRideRequestInformation?.userId !== undefined) {
      contentList.push({
        content: (
          <DataAccessElement
            {...propsDataAccessElement}
            {...originMatch}
            key={`data-access-element-ride-request-auction-creator-${stateRideRequestId}`}
            id={stateRideRequestId}
            label={intl.formatMessage({
              id: 'getacar.spectator.message.auctionCreator',
            })}
            content={
              <InputButtonSpectatorShow
                {...propsInputButton}
                key={`ride-request-auction-creator-${stateRideRequestId}`}
                spectatorId={stateRideRequestInformation.userId}
                icon={iconCustomer}
                label={intl.formatMessage({
                  id: 'getacar.participant.customer',
                })}
                isPseudonym={true}
              />
            }
            dataAccessInformation={dataAccessPseudonymResolved}
          />
        ),
        label: intl.formatMessage({
          id: 'getacar.spectator.message.auctionCreator',
        }),
        labelIcon: iconCustomer,
      });
    }

    if (stateRideRequestInformation?.auctionWinner !== undefined) {
      contentList.push({
        content: (
          <DataAccessElement
            {...propsDataAccessElement}
            {...originMatch}
            key={`data-access-element-ride-request-auction-winner-${stateRideRequestId}`}
            id={stateRideRequestId}
            label={intl.formatMessage({
              id: 'getacar.spectator.message.auctionWinner',
            })}
            content={
              <InputButtonSpectatorShow
                {...propsInputButton}
                key={`ride-request-auction-winner-${stateRideRequestId}`}
                spectatorId={stateRideRequestInformation.auctionWinner}
                icon={iconRideProvider}
                label={intl.formatMessage({
                  id: 'getacar.participant.rideProvider',
                })}
                isPseudonym={true}
              />
            }
            dataAccessInformation={dataAccessPseudonymResolved}
          />
        ),
        label: intl.formatMessage({
          id: 'getacar.spectator.message.auctionWinner',
        }),
        labelIcon: iconRideProvider,
      });
    }
    return contentList;
  }, [
    dataAccessPseudonymResolved,
    iconCustomer,
    iconRideProvider,
    intl,
    originMatch,
    propsDataAccessElement,
    propsInputButton,
    stateRideRequestId,
    stateRideRequestInformation?.auctionWinner,
    stateRideRequestInformation?.userId,
  ]);

  const contentOther = useMemo<Array<CardGenericPropsContentElement>>(() => {
    debugComponentElementUpdate(
      `CardRideRequest#contentDebug#${stateRideRequestId}`
    );

    const contentList: Array<CardGenericPropsContentElement> = [];
    if (stateSettingsGlobalDebug === true) {
      contentList.push({
        content:
          contentDebug.length > 0 ? (
            <List
              key={`rideRequest-list-debug-${stateRideRequestId}`}
              sx={{
                overflowX: 'scroll',
              }}
            >
              {contentDebug.map(element => (
                <DataAccessElement
                  {...propsDataAccessElement}
                  key={`render-data-element-${element.label}-${stateRideRequestId}`}
                  id={stateRideRequestId}
                  dataOriginName={intl.formatMessage({
                    id: 'page.home.tab.settings.card.debug.title',
                  })}
                  dataOriginId={SpectatorId.EVERYTHING}
                  dataOriginIcon={iconEverything}
                  {...element}
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
    stateRideRequestId,
    stateSettingsGlobalDebug,
  ]);

  const contentFinal = useMemo<Array<CardGenericPropsContentElement>>(() => {
    debugComponentElementUpdate(
      `CardRideRequest#contentFinal#${stateRideRequestId}`
    );

    return [...content, ...contentOther];
  }, [content, contentOther, stateRideRequestId]);

  return (
    <CardGeneric
      {...props}
      icon={iconRideRequest}
      name={intl.formatMessage({id: 'getacar.rideRequest'})}
      id={stateRideRequestId}
      status={stateRideRequestInformation?.auctionStatus}
      content={contentFinal}
    />
  );
}
