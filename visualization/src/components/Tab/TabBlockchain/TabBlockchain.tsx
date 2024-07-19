'use client';

// Package imports
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {Box, Grid, Paper, Typography} from '@mui/material';
// Local imports
import {simulationEndpoints} from '@globals/defaults/endpoints';
// > Components
import {
  ConnectedElementsIcon,
  ResetParticipantFilterIcon,
  ResetSpectatorIcon,
} from '@components/Icons';
import CardRefresh from '@components/Card/CardRefresh';
import GridConnectedElements from '@components/Grid/GridConnectedElements';
import GridConnectedElementsCard from '@components/Grid/GridConnectedElements/GridConnectedElementsCard';
import InputChangeSpectator from '@components/Input/InputChangeSpectator';
import InputSearchBar from '@components/Input/InputSearchBar';
import TabContainer from '@components/Tab/TabContainer';
import TableDebugData from '@components/Table/TableDebugData';
// > Misc
import {debugRequestBlock, debugVisibilityChange} from '@misc/debug';
import {SearchBarId} from '@misc/searchBarIds';
import {SpectatorId} from '@misc/spectatorIds';
// Type imports
import type {
  GlobalPropsFetch,
  GlobalPropsFetchSmartContracts,
  GlobalPropsShowError,
  GlobalPropsSpectatorMap,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
  GlobalSearchElement,
} from '@misc/props/global';
import type {
  GridConnectedElementsSectionCards,
  GridConnectedElementsSectionInfoElement,
} from '@components/Grid/GridConnectedElements';
import type {ReactSetState, ReactState} from '@misc/react';
import type {
  SettingsBlockchainProps,
  SettingsUiProps,
} from '@misc/props/settings';
import type {
  SimulationEndpointParticipantIdFromPseudonym,
  SimulationEndpointSmartContractConnectedRideRequests,
  SimulationEndpointSmartContractInformation,
} from '@globals/types/simulation';
import type {CardRefreshProps} from '@components/Card/CardRefresh';
import type {InputExtraActionsAction} from '@components/Input/InputExtraActions';
import type {InputSearchBarProps} from '@components/Input/InputSearchBar';
import type {ReactElement} from 'react';

export interface TabBlockchainProps
  extends CardRefreshProps,
    InputSearchBarProps,
    SettingsBlockchainProps,
    GlobalPropsFetch,
    GlobalPropsFetchSmartContracts,
    GlobalPropsShowError,
    GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorSelectedElementsSet,
    SettingsUiProps,
    GlobalPropsSpectatorMap {
  stateInfoCardBlockchainDismissed: ReactState<boolean>;
  setStateInfoCardBlockchainDismissed: ReactSetState<boolean>;
}

// eslint-disable-next-line no-empty-pattern
export default function TabBlockchain(props: TabBlockchainProps) {
  const {
    fetchJsonSimulation,
    fetchJsonSimulationWaitSmartContracts,
    setStateSelectedParticipantId,
    setStateSelectedSmartContractId,
    setStateSpectatorId,
    showError,
    stateSelectedParticipantId,
    stateSelectedSmartContractId,
    stateSettingsBlockchainUpdateRateInMs,
    stateSettingsGlobalDebug,
    stateSettingsUiGridSpacing,
    stateSpectatorId,
    stateSpectators,
    stateInfoCardBlockchainDismissed,
    setStateInfoCardBlockchainDismissed,
  } = props;
  const intl = useIntl();

  const [stateSelectedCustomerPseudonym, setStateSelectedCustomerPseudonym] =
    useState<string | undefined>(undefined);
  const [
    stateSelectedRideProviderPseudonym,
    setStateSelectedRideProviderPseudonym,
  ] = useState<string | undefined>(undefined);

  const [stateSelectedCustomerResolved, setStateSelectedCustomerResolved] =
    useState<string | undefined>(undefined);
  const [
    stateSelectedRideProviderResolved,
    setStateSelectedRideProviderResolved,
  ] = useState<string | undefined>(undefined);
  // > Fetching smart contracts
  const [stateFetchingSmartContracts, setStateFetchingSmartContracts] =
    useState<boolean>(true);

  const [stateConnectedRideRequests, setStateConnectedRideRequests] = useState<
    Array<string>
  >([]);

  useEffect(() => {
    if (
      stateSelectedCustomerPseudonym !== undefined &&
      stateSelectedRideProviderPseudonym !== undefined &&
      stateSelectedSmartContractId !== undefined
    ) {
      console.warn(
        'Fetch connected ride requests of smart contract...',
        stateSelectedSmartContractId
      );
      fetchJsonSimulation<SimulationEndpointSmartContractConnectedRideRequests>(
        simulationEndpoints.apiV1.smartContractConnectedRideRequests(
          stateSelectedSmartContractId
        )
      )
        .then(data => {
          // TODO Not working
          console.warn(
            'Fetched connected ride requests of smart contract',
            data
          );
          setStateConnectedRideRequests(data.connectedRideRequests);
        })
        .catch(err =>
          showError('Simulation fetch customer ID from pseudonym', err)
        );
    } else {
      setStateConnectedRideRequests([]);
    }
  }, [
    fetchJsonSimulation,
    stateSelectedSmartContractId,
    showError,
    stateSelectedCustomerPseudonym,
    stateSelectedRideProviderPseudonym,
  ]);

  useEffect(() => {
    if (stateSelectedCustomerPseudonym !== undefined) {
      fetchJsonSimulation<SimulationEndpointParticipantIdFromPseudonym>(
        simulationEndpoints.apiV1.participantIdFromPseudonym(
          stateSelectedCustomerPseudonym
        )
      )
        .then(data => setStateSelectedCustomerResolved(data.id))
        .catch(err =>
          showError('Simulation fetch customer ID from pseudonym', err)
        );
    }
  }, [
    fetchJsonSimulation,
    setStateSelectedCustomerResolved,
    showError,
    stateSelectedCustomerPseudonym,
  ]);

  useEffect(() => {
    if (stateSelectedRideProviderPseudonym !== undefined) {
      fetchJsonSimulation<SimulationEndpointParticipantIdFromPseudonym>(
        simulationEndpoints.apiV1.participantIdFromPseudonym(
          stateSelectedRideProviderPseudonym
        )
      )
        .then(data => setStateSelectedRideProviderResolved(data.id))
        .catch(err =>
          showError('Simulation fetch ride provider ID from pseudonym', err)
        );
    }
  }, [
    fetchJsonSimulation,
    setStateSelectedRideProviderResolved,
    showError,
    stateSelectedRideProviderPseudonym,
  ]);

  useEffect(() => {
    if (stateSelectedRideProviderPseudonym === undefined) {
      setStateSelectedRideProviderResolved(undefined);
    }
  }, [stateSelectedRideProviderPseudonym]);

  useEffect(() => {
    if (stateSelectedCustomerPseudonym === undefined) {
      setStateSelectedCustomerResolved(undefined);
    }
  }, [stateSelectedCustomerPseudonym]);

  const stateConnectedElements = useMemo<
    Array<GridConnectedElementsSectionCards>
  >(() => {
    const selectedParticipants: Array<ReactElement> = [];
    const selectedRideRequests: Array<ReactElement> = [];
    if (stateSelectedCustomerResolved !== undefined) {
      selectedParticipants.push(
        <CardRefresh
          {...props}
          cardType="customer"
          id={stateSelectedCustomerResolved}
          label={intl.formatMessage(
            {
              id: 'connected',
            },
            {
              name: intl.formatMessage({
                id: 'getacar.participant.customer',
              }),
            }
          )}
        />
      );
    }
    if (stateSelectedRideProviderResolved !== undefined) {
      selectedParticipants.push(
        <CardRefresh
          {...props}
          cardType="ride_provider"
          id={stateSelectedRideProviderResolved}
          label={intl.formatMessage(
            {
              id: 'connected',
            },
            {
              name: intl.formatMessage({
                id: 'getacar.participant.rideProvider',
              }),
            }
          )}
        />
      );
    }
    for (const stateConnectedRideRequest of stateConnectedRideRequests) {
      selectedRideRequests.push(
        <CardRefresh
          {...props}
          id={stateConnectedRideRequest}
          cardType={'ride_request'}
          label={intl.formatMessage(
            {
              id: 'connected',
            },
            {
              name: intl.formatMessage({
                id: 'getacar.rideRequest',
              }),
            }
          )}
        />
      );
    }
    return [
      {
        cards: selectedParticipants,
        icon: <ConnectedElementsIcon fontSize="large" />,
        title: intl.formatMessage({
          id: 'getacar.participant.message.connected.plural',
        }),
      },
      {
        cards: selectedRideRequests,
        icon: <ConnectedElementsIcon fontSize="large" />,
        title: intl.formatMessage({
          id: 'getacar.rideRequest.message.connected.plural',
        }),
      },
    ];
  }, [
    intl,
    props,
    stateConnectedRideRequests,
    stateSelectedCustomerResolved,
    stateSelectedRideProviderResolved,
  ]);

  const searchActions = useMemo<Array<InputExtraActionsAction>>(
    () => [
      {
        callback: () => setStateSelectedParticipantId(undefined),
        disabled: stateSelectedParticipantId === undefined,
        icon: <ResetParticipantFilterIcon />,
        text: intl.formatMessage({
          id: 'getacar.participant.resetFilter.smartContracts',
        }),
      },
    ],
    [intl, stateSelectedParticipantId, setStateSelectedParticipantId]
  );

  const spectatorActions = useMemo<Array<InputExtraActionsAction>>(() => {
    return [
      {
        callback: () => setStateSpectatorId(SpectatorId.EVERYTHING),
        disabled: stateSpectatorId === SpectatorId.EVERYTHING,
        icon: <ResetSpectatorIcon />,
        text: intl.formatMessage({
          id: 'getacar.spectator.reset',
        }),
      },
    ];
  }, [stateSpectatorId, intl, setStateSpectatorId]);

  const stateInfoElements = useMemo<
    Array<GridConnectedElementsSectionInfoElement>
  >(() => {
    return [
      {
        content: (
          <InputChangeSpectator
            key="change-spectator"
            {...props}
            actions={spectatorActions}
          />
        ),
      },
    ];
  }, [props, spectatorActions]);

  const [stateSmartContracts, setStateSmartContracts] = useState<
    Array<SimulationEndpointSmartContractInformation>
  >([]);

  const stateSmartContractsFinal = useMemo<
    Array<SimulationEndpointSmartContractInformation>
  >(() => {
    if (stateSelectedParticipantId !== undefined) {
      const spectator = stateSpectators.get(stateSelectedParticipantId);
      if (spectator !== undefined) {
        const categoryCustomer = intl.formatMessage({
          id: 'getacar.participant.customer',
        });
        const categoryRideProvider = intl.formatMessage({
          id: 'getacar.participant.rideProvider',
        });
        return stateSmartContracts.filter(a =>
          spectator.category === categoryCustomer
            ? a.customerIdResolved === stateSelectedParticipantId
            : spectator.category === categoryRideProvider
              ? a.rideProviderIdResolved === stateSelectedParticipantId
              : true
        );
      }
    }
    return stateSmartContracts;
  }, [stateSelectedParticipantId, stateSmartContracts, stateSpectators, intl]);

  const requestBalancerFetchSmartContracts = useRef(false);
  const fetchSmartContracts = useCallback(
    () =>
      fetchJsonSimulationWaitSmartContracts(requestBalancerFetchSmartContracts)
        .then(data => {
          if (data === null) {
            return;
          }
          setStateSmartContracts(data);
          setStateFetchingSmartContracts(false);
        })
        .catch(err => showError('Fetch simulation smart contracts', err)),
    [fetchJsonSimulationWaitSmartContracts, showError]
  );

  const [stateWindowIsHidden, setStateWindowIsHidden] = useState(false);

  // React: Effects
  useEffect(() => {
    // Initial fetch
    fetchSmartContracts();

    // Detect when window is hidden
    const visibilityChangeListener = () => {
      setStateWindowIsHidden(document.hidden);
      debugVisibilityChange(document.hidden, 'Blockchain');
    };
    document.addEventListener('visibilitychange', visibilityChangeListener);

    // Fetch continuously
    const interval = setInterval(() => {
      if (stateWindowIsHidden) {
        debugRequestBlock(
          'Smart contracts not fetched because window not visible',
          'Blockchain'
        );
        return;
      }
      fetchSmartContracts();
    }, stateSettingsBlockchainUpdateRateInMs);

    return () => {
      // On close stop interval and remove window visibility change listener
      clearInterval(interval);
      document.removeEventListener(
        'visibilitychange',
        visibilityChangeListener
      );
    };
  });

  const onRowSelect = useCallback(
    (
      smartContractId: string,
      customerPseudonym: string,
      rideProviderPseudonym: string
    ) => {
      setStateSelectedSmartContractId(smartContractId);
      setStateSelectedCustomerPseudonym(customerPseudonym);
      setStateSelectedRideProviderPseudonym(rideProviderPseudonym);
    },
    [setStateSelectedSmartContractId]
  );

  useEffect(() => {
    if (stateSelectedSmartContractId === undefined) {
      setStateSelectedCustomerPseudonym(undefined);
      setStateSelectedRideProviderPseudonym(undefined);
    } else {
      const smartContract = stateSmartContractsFinal.find(
        a => stateSelectedSmartContractId === a.walletId
      );
      if (smartContract !== undefined) {
        onRowSelect(
          smartContract.walletId,
          smartContract.customerId,
          smartContract.rideProviderId
        );
      }
    }
  }, [onRowSelect, stateSelectedSmartContractId, stateSmartContractsFinal]);

  const searchIsCurrentSelectedParticipant = useCallback<
    (element: Readonly<GlobalSearchElement>) => boolean
  >(
    element => {
      return (
        stateSelectedParticipantId !== undefined &&
        element.participantId === stateSelectedParticipantId
      );
    },
    [stateSelectedParticipantId]
  );

  const callbackOnDismiss = useCallback(() => {
    setStateInfoCardBlockchainDismissed(true);
  }, [setStateInfoCardBlockchainDismissed]);

  const selectSmartContract = useCallback(
    (_: unknown, id: string) => {
      const smartContract = stateSmartContracts.find(a => a.walletId === id);
      if (smartContract) {
        onRowSelect(
          smartContract.walletId,
          smartContract.customerId,
          smartContract.rideProviderId
        );
      }
    },
    [onRowSelect, stateSmartContracts]
  );

  return (
    <TabContainer fullPage={true}>
      <GridConnectedElements
        stateSettingsUiGridSpacing={stateSettingsUiGridSpacing}
        stateConnectedElements={stateConnectedElements}
        stateInfoElements={stateInfoElements}
        stateSettingsGlobalDebug={stateSettingsGlobalDebug}
      >
        <Grid container spacing={stateSettingsUiGridSpacing}>
          <Grid item xs={12}>
            <InputSearchBar
              {...props}
              key="search-bar-blockchain"
              placeholder={intl.formatMessage({
                id: 'page.home.tab.blockchain.search',
              })}
              searchActionTooltip={intl.formatMessage({
                id: 'page.home.tab.blockchain.search',
              })}
              primaryFilter={SearchBarId.FILTER_SMART_CONTRACT_PARTICIPANT}
              actionsPost={searchActions}
              loading={stateFetchingSmartContracts}
              displayValueFilter={searchIsCurrentSelectedParticipant}
            />
          </Grid>
          {stateInfoCardBlockchainDismissed === false ? (
            <GridConnectedElementsCard
              key="connected-elements-card-info"
              muiGridItemSize={12}
              icon={undefined}
              title={intl.formatMessage({
                id: 'page.home.tab.blockchain.section.info.title',
              })}
              onDismiss={callbackOnDismiss}
            >
              <Typography variant="body2">
                {intl.formatMessage({
                  id: 'page.home.tab.blockchain.section.info.content',
                })}
              </Typography>
            </GridConnectedElementsCard>
          ) : undefined}
          <Grid item xs={12}>
            <Box
              sx={{
                height: `calc(100vh - 10rem - ${stateInfoCardBlockchainDismissed ? '0rem' : '10rem'} - ${
                  (stateSettingsUiGridSpacing / 2) * 2
                }rem)`,
              }}
            >
              <Paper
                sx={{
                  height: '100%',
                  width: '100%',
                }}
                elevation={2}
              >
                <TableDebugData
                  height={'100%'}
                  stateDebugData={{
                    customers: [],
                    rideProviders: [],
                    rideRequests: [],
                    smartContracts: stateSmartContractsFinal,
                  }}
                  debugDataType="smart_contract"
                  onRowClick={selectSmartContract}
                />
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </GridConnectedElements>
    </TabContainer>
  );
}
