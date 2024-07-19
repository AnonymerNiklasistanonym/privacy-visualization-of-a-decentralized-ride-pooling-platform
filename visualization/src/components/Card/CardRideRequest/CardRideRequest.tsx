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
import InputButtonSpectatorShow from '@components/Input/InputButton/InputButtonSpectatorShow';
import {RenderDataElement} from '../CardParticipant/PopupContentGeneric';
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
  GlobalPropsIntlValues,
  GlobalPropsModalDataInformation,
} from '@misc/props/global';
import type {
  SimulationEndpointParticipantIdFromPseudonym,
  SimulationEndpointRideRequestInformation,
} from '@globals/types/simulation';
import type {InputButtonSpectatorChangeProps} from '@components/Input/InputButton/InputButtonSpectatorChange';
import type {InputButtonSpectatorShowProps} from '@components/Input/InputButton/InputButtonSpectatorShow';
import type {ModalDataInformationAccess} from '@components/Modal/ModalData';
import type {ReactState} from '@misc/react';
import type {SettingsGlobalProps} from '@misc/props/settings';

export interface CardRideRequestProps
  extends InputButtonSpectatorChangeProps,
    InputButtonSpectatorShowProps,
    SettingsGlobalProps,
    CardGenericProps,
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

  const rideRequestUserId = stateRideRequestInformation?.userId;
  const rideRequestAuctionWinner = stateRideRequestInformation?.auctionWinner;

  const intl = useIntl();

  // React: States
  // > Fetching of actual actor ID in case it was a pseudonym
  const [stateResolvedPseudonymCustomer, setStateResolvedPseudonymCustomer] =
    useState<SimulationEndpointParticipantIdFromPseudonym | undefined>(
      undefined
    );
  const [
    stateResolvedPseudonymAuctionWinner,
    setStateResolvedPseudonymAuctionWinner,
  ] = useState<SimulationEndpointParticipantIdFromPseudonym | undefined>(
    undefined
  );

  const iconRideProvider = useMemo(() => <ParticipantRideProviderIcon />, []);

  const iconCustomer = useMemo(() => <ParticipantCustomerIcon />, []);

  // React: Run on first render
  useEffect(() => {
    if (rideRequestUserId !== undefined) {
      fetchJsonSimulation<SimulationEndpointParticipantIdFromPseudonym>(
        simulationEndpoints.apiV1.participantIdFromPseudonym(rideRequestUserId)
      )
        .then(data => setStateResolvedPseudonymCustomer(data))
        .catch(err =>
          showError(
            'Simulation fetch participant ID from pseudonym [CardRideRequest:userId]',
            err
          )
        );
    }
  }, [rideRequestUserId, fetchJsonSimulation, showError]);
  useEffect(() => {
    if (rideRequestAuctionWinner !== undefined) {
      fetchJsonSimulation<SimulationEndpointParticipantIdFromPseudonym>(
        simulationEndpoints.apiV1.participantIdFromPseudonym(
          rideRequestAuctionWinner
        )
      )
        .then(data => setStateResolvedPseudonymAuctionWinner(data))
        .catch(err =>
          showError(
            'Simulation fetch participant ID from pseudonym [CardRideRequest:auctionWinner]',
            err
          )
        );
    }
  }, [rideRequestAuctionWinner, fetchJsonSimulation, showError]);

  const dataAccessPseudonyms = useMemo<Array<ModalDataInformationAccess>>(
    () => [
      {
        accessType: 'transitive',
        description: intl.formatMessage({id: 'dataAccess.rideRequestData.as'}),
        icon: <ServiceAuthenticationIcon />,
        name: intl.formatMessage({
          id: 'getacar.spectator.service.authentication',
        }),
        spectatorId: SpectatorId.AUTHENTICATION_SERVICE,
        spectatorInformation: <ServiceAuthentication intlValues={intlValues} />,
      },
      {
        accessType: 'none',
        description: intl.formatMessage({id: 'dataAccess.rideRequestData.ms'}),
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

  const dataAccessInformation = useMemo<
    Array<ModalDataInformationAccess>
  >(() => {
    const dataAccessInformationList: Array<ModalDataInformationAccess> = [
      ...dataAccessPseudonyms,
    ];

    if (stateResolvedPseudonymCustomer !== undefined) {
      dataAccessInformationList.push({
        accessType: 'none',
        description: intl.formatMessage({
          id: 'dataAccess.rideRequestData.customer',
        }),
        icon: iconCustomer,
        name: intl.formatMessage({id: 'getacar.service.match'}),
        spectatorId: stateResolvedPseudonymCustomer.id,
        spectatorInformation: <ParticipantsCustomer intlValues={intlValues} />,
      });
    }
    if (stateResolvedPseudonymAuctionWinner !== undefined) {
      dataAccessInformationList.push({
        accessType: 'none',
        description: intl.formatMessage({
          id: 'dataAccess.rideRequestData.rideProvider',
        }),
        icon: iconRideProvider,
        name: intl.formatMessage({id: 'getacar.service.match'}),
        spectatorId: stateResolvedPseudonymAuctionWinner.id,
        spectatorInformation: (
          <ParticipantsRideProvider intlValues={intlValues} />
        ),
      });
    }
    return dataAccessInformationList;
  }, [
    dataAccessPseudonyms,
    iconCustomer,
    iconRideProvider,
    intl,
    intlValues,
    stateResolvedPseudonymAuctionWinner,
    stateResolvedPseudonymCustomer,
  ]);

  const dataAccessInformationDebug = useMemo<Array<ModalDataInformationAccess>>(
    () => [],
    []
  );

  const content = useMemo<Array<CardGenericPropsContentElement>>(() => {
    debugComponentElementUpdate(
      `CardRideRequest#content#${stateRideRequestId}`
    );
    const contentList: Array<CardGenericPropsContentElement> = [];

    if (stateRideRequestInformation?.userId !== undefined) {
      contentList.push({
        content: (
          <InputButtonSpectatorShow
            {...propsInputButton}
            key={`ride-request-auction-winner-${stateRideRequestId}`}
            spectatorId={stateRideRequestInformation.userId}
            icon={iconCustomer}
            label={intl.formatMessage({
              id: 'getacar.participant.customer',
            })}
            isPseudonym={true}
          />
        ),
        label: intl.formatMessage({
          id: 'getacar.participant.customer',
        }),
        labelIcon: iconCustomer,
      });
    }

    if (stateRideRequestInformation?.auctionWinner !== undefined) {
      contentList.push({
        content: (
          <InputButtonSpectatorShow
            {...propsInputButton}
            key={`ride-request-auction-winner-${stateRideRequestId}`}
            spectatorId={stateRideRequestInformation.auctionWinner}
            icon={iconRideProvider}
            label={intl.formatMessage({
              id: 'getacar.spectator.message.auctionWinner',
            })}
            isPseudonym={true}
          />
        ),
        label: intl.formatMessage({
          id: 'getacar.spectator.message.auctionWinner',
        }),
        labelIcon: iconRideProvider,
      });
    }

    if (stateSettingsGlobalDebug === true) {
      contentList.push({
        content: (
          <List
            key={`debug-list-ride-request-${stateRideRequestId}`}
            sx={{
              overflowX: 'scroll',
            }}
          >
            {Object.entries(stateRideRequestInformation ?? {}).map(
              ([key, value]) => (
                <RenderDataElement
                  {...props}
                  key={`debug-data-element-ride-provider-${stateRideRequestId}-${key}`}
                  element={{
                    content:
                      typeof value === 'string' ? value : JSON.stringify(value),
                    dataAccessInformation: dataAccessInformationDebug,
                    label: key,
                  }}
                  id={stateRideRequestId}
                  dataOriginName={`Debug Ride Request (${stateRideRequestId})`}
                  dataOriginId={stateRideRequestId}
                  dataOriginIcon={<ParticipantRideRequestIcon />}
                  dataAccessInformation={dataAccessInformation}
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
    dataAccessInformation,
    dataAccessInformationDebug,
    iconCustomer,
    iconRideProvider,
    intl,
    props,
    propsInputButton,
    stateRideRequestId,
    stateRideRequestInformation,
    stateSettingsGlobalDebug,
  ]);

  return (
    <CardGeneric
      {...props}
      icon={<ParticipantRideRequestIcon />}
      name={intl.formatMessage({id: 'getacar.rideRequest'})}
      id={stateRideRequestId}
      status={stateRideRequestInformation?.auctionStatus}
      content={content}
    />
  );
}
