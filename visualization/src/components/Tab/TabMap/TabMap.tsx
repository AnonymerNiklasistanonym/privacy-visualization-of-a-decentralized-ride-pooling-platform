'use client';

// Package imports
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {Box, ButtonGroup, Chip, Divider, Grid, Typography} from '@mui/material';
// Local imports
import {fetchJsonEndpoint} from '@misc/fetch';
// > Components
import {
  ClearSelectedParticipantIcon,
  ConnectedElementsIcon,
  NavigateToLocationIcon,
  PinnedElementsIcon,
  ResetSpectatorIcon,
} from '@components/Icons';
import CardRefresh from '@components/Card/CardRefresh';
import GenericButton from '@components/Input/InputButton/InputButtonGeneric';
import GridConnectedElements from '@components/Grid/GridConnectedElements';
import GridConnectedElementsCard from '@components/Grid/GridConnectedElements/GridConnectedElementsCard';
import InputChangeSpectator from '@components/Input/InputChangeSpectator';
import InputSearchBar from '@components/Input/InputSearchBar';
import Map from '@components/Map';
import TabContainer from '@components/Tab/TabContainer';
// > Globals
import {
  pathfinderEndpoints,
  simulationEndpoints,
} from '@globals/defaults/endpoints';
// > Misc
import {SearchBarId} from '@misc/searchBarIds';
import {SpectatorId} from '@misc/spectatorIds';
// > Styles
import '@styles/Map.module.scss';
import styles from '@styles/Map.module.scss';
// Type imports
import type {
  GlobalPropsFetch,
  GlobalPropsIntlValues,
  GlobalPropsPinnedParticipants,
  GlobalPropsSearch,
  GlobalPropsShowError,
  GlobalPropsSpectatorMap,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
  GlobalPropsSpectatorsSet,
  GlobalSearchElement,
} from '@misc/props/global';
import type {
  GridConnectedElementsSectionCards,
  GridConnectedElementsSectionInfoElement,
} from '@components/Grid/GridConnectedElements';
import type {ReactSetState, ReactState} from '@misc/react';
import type {
  SettingsConnectedElementsProps,
  SettingsFetchProps,
  SettingsMapProps,
  SettingsUiProps,
} from '@misc/props/settings';
import type {
  SimulationEndpointGraphInformation,
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
} from '@globals/types/simulation';
import type {InputExtraActionsAction} from '@components/Input/InputExtraActions';
import type {MapProps} from '@components/Map';
import type {PathfinderEndpointGraphInformation} from '@globals/types/pathfinder';
import type {ReactElement} from 'react';

export interface TabMapProps
  extends GlobalPropsFetch,
    GlobalPropsIntlValues,
    GlobalPropsSearch,
    GlobalPropsShowError,
    GlobalPropsSpectatorMap,
    GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorSelectedElementsSet,
    GlobalPropsSpectatorsSet,
    GlobalPropsPinnedParticipants,
    MapProps,
    SettingsConnectedElementsProps,
    SettingsFetchProps,
    SettingsMapProps,
    SettingsUiProps {
  stateInfoCardMapDismissed: ReactState<boolean>;
  setStateInfoCardMapDismissed: ReactSetState<boolean>;
}

export default function TabMap(props: TabMapProps) {
  const intl = useIntl();
  const {
    fetchJsonSimulation,
    showError,
    setStateShowParticipantId,
    setStateSelectedParticipantId,
    setStateSpectatorId,
    stateSpectatorId,
    stateSpectators,
    stateSelectedParticipantId,
    stateSettingsGlobalDebug,
    stateSettingsMapBaseUrlPathfinder,
    stateSettingsMapUpdateRateInMs,
    stateSettingsUiGridSpacing,
    stateInfoCardMapDismissed,
    setStateInfoCardMapDismissed,
    statePinnedCustomers,
    setStatePinnedCustomers,
    statePinnedRideProviders,
    setStatePinnedRideProviders,
  } = props;

  // React states
  // > Graphs
  const [stateGraph, setGraphState] =
    useState<SimulationEndpointGraphInformation>({
      edges: [],
      geometry: [],
      vertices: [],
    });
  const [stateGraphPathfinder, setPathfinderGraphState] =
    useState<PathfinderEndpointGraphInformation>({
      edges: [],
      vertices: [],
    });
  // > Loading participant coordinates
  const [
    stateLoadingParticipantCoordinates,
    setStateLoadingParticipantCoordinates,
  ] = useState<boolean>(true);

  /** The additional search actions */
  const searchActions = useMemo<Array<InputExtraActionsAction>>(
    () => [
      {
        callback: () => setStateSelectedParticipantId(undefined),
        disabled: stateSelectedParticipantId === undefined,
        icon: <ClearSelectedParticipantIcon />,
        text: intl.formatMessage({id: 'getacar.participant.clearSelected'}),
      },
      {
        callback: () => setStateShowParticipantId(stateSelectedParticipantId),
        disabled: stateSelectedParticipantId === undefined,
        icon: <NavigateToLocationIcon />,
        text: intl.formatMessage({id: 'getacar.participant.selectedShow'}),
      },
    ],
    [
      intl,
      stateSelectedParticipantId,
      setStateSelectedParticipantId,
      setStateShowParticipantId,
    ]
  );

  /** Fetch graph data */
  const fetchGraphs = useCallback(
    (clear = false) => {
      if (clear === true) {
        setGraphState(prev => ({
          ...prev,
          edges: [],
          geometry: [],
          vertices: [],
        }));
        setPathfinderGraphState(prev => ({
          ...prev,
          edges: [],
          vertices: [],
        }));
        return;
      }
      fetchJsonSimulation<SimulationEndpointGraphInformation>(
        simulationEndpoints.apiV1.graphInformation
      )
        .then(data => {
          if (
            window.confirm(
              `This will add ${data.edges.length} edges, ${data.geometry.length} geometries and ${data.vertices.length} vertices to the map [simulation]. Do you still want to continue?`
            )
          ) {
            setGraphState(data);
          }
        })
        .catch(err => showError('Fetch simulation graph', err));
      fetchJsonEndpoint<PathfinderEndpointGraphInformation>(
        stateSettingsMapBaseUrlPathfinder,
        pathfinderEndpoints.graphInformation
      )
        .then(data => {
          if (
            window.confirm(
              `This will add ${data.edges.length} edges and ${data.vertices.length} vertices to the map [pathfinder]. Do you still want to continue?`
            )
          ) {
            setPathfinderGraphState(data);
          }
        })
        .catch(err => showError('Fetch pathfinder graph', err));
    },
    [fetchJsonSimulation, showError, stateSettingsMapBaseUrlPathfinder]
  );
  /** Clear graph data */
  const clearGraphs = useCallback(() => fetchGraphs(true), [fetchGraphs]);

  // React: Effects
  // > Fetch Selected Participant (and it's connected participants for the connected pages)
  useEffect(() => {
    const interval = setInterval(() => {
      if (stateSelectedParticipantId === undefined) {
        return;
      }
      const selectedSpectator = stateSpectators.get(stateSelectedParticipantId);
      if (selectedSpectator === undefined) {
        return;
      }

      const selectedSpectatorCategoryCustomer = intl.formatMessage({
        id: 'getacar.participant.customer',
      });
      const selectedSpectatorCategoryRideProvider = intl.formatMessage({
        id: 'getacar.participant.rideProvider',
      });

      if (selectedSpectator.category === selectedSpectatorCategoryCustomer) {
        fetchJsonSimulation<SimulationEndpointParticipantInformationCustomer>(
          simulationEndpoints.apiV1.participantInformationCustomer(
            stateSelectedParticipantId
          )
        ).then(customerInformation => {
          const connectedRideRequest = customerInformation.rideRequest;
          if (connectedRideRequest !== undefined) {
            if (!stateConnectedRideRequests.includes(connectedRideRequest))
              setStateConnectedRideRequests([connectedRideRequest]);
          } else {
            setStateConnectedRideRequests([]);
          }
          setStateConnectedDriver(customerInformation.passenger);
        });
      } else if (
        selectedSpectator.category === selectedSpectatorCategoryRideProvider
      ) {
        fetchJsonSimulation<SimulationEndpointParticipantInformationRideProvider>(
          simulationEndpoints.apiV1.participantInformationRideProvider(
            stateSelectedParticipantId
          )
        ).then(rideProviderInformation => {
          const connectedRideRequest = rideProviderInformation.rideRequest;
          if (connectedRideRequest !== undefined) {
            if (!stateConnectedRideRequests.includes(connectedRideRequest))
              setStateConnectedRideRequests([connectedRideRequest]);
          } else {
            setStateConnectedRideRequests([]);
          }
          const connectedPassengers = rideProviderInformation.passengerList;
          if (connectedPassengers !== undefined) {
            if (
              connectedPassengers.some(
                a => !stateConnectedPassengers.includes(a)
              )
            ) {
              setStateConnectedPassengers(connectedPassengers);
            }
          } else {
            setStateConnectedPassengers([]);
          }
        });
      }
    }, stateSettingsMapUpdateRateInMs);
    return () => {
      clearInterval(interval);
    };
  });

  const spectatorActions = useMemo<Array<InputExtraActionsAction>>(() => {
    const currentSpectator = stateSpectators.get(stateSpectatorId);
    return [
      {
        callback: () => setStateSpectatorId(SpectatorId.EVERYTHING),
        disabled: stateSpectatorId === SpectatorId.EVERYTHING,
        icon: <ResetSpectatorIcon />,
        text: intl.formatMessage({
          id: 'getacar.spectator.reset',
        }),
      },
      {
        callback: () => setStateShowParticipantId(stateSpectatorId),
        disabled:
          currentSpectator?.category !== undefined
            ? ![
                intl.formatMessage({
                  id: 'getacar.participant.customer',
                }),
                intl.formatMessage({
                  id: 'getacar.participant.rideProvider',
                }),
              ].includes(currentSpectator?.category)
            : true,
        icon: <NavigateToLocationIcon />,
        text: intl.formatMessage({id: 'getacar.spectator.message.showMap'}),
      },
    ];
  }, [
    stateSpectators,
    stateSpectatorId,
    intl,
    setStateShowParticipantId,
    setStateSpectatorId,
  ]);

  /** Specify dismissible cards that should be displayed */
  const stateInfoElements = useMemo<
    Array<GridConnectedElementsSectionInfoElement>
  >(() => {
    return [
      {
        content: (
          <InputChangeSpectator
            key="change-spectator-map"
            {...props}
            actions={spectatorActions}
          />
        ),
        id: 'tab-map-change-spectator',
      },
    ];
  }, [props, spectatorActions]);

  const [stateConnectedRideRequests, setStateConnectedRideRequests] = useState<
    Array<string>
  >([]);

  const [stateConnectedPassengers, setStateConnectedPassengers] = useState<
    Array<string>
  >([]);

  const [stateConnectedDriver, setStateConnectedDriver] = useState<
    string | undefined
  >(undefined);

  /** Specify which connected elements should be displayed */
  const stateConnectedElements = useMemo<
    Array<GridConnectedElementsSectionCards>
  >(() => {
    /** The pinned participant cards */
    const pinnedParticipants: Array<ReactElement> = [];
    /** The connected participants */
    const connectedParticipants: Array<ReactElement> = [];
    /** The connected ride requests */
    const connectedRideRequests: Array<ReactElement> = [];
    /** The connected smart contracts */
    const connectedSmartContracts: Array<ReactElement> = [];

    const currentSelectedSpectator =
      stateSelectedParticipantId !== undefined
        ? stateSpectators.get(stateSelectedParticipantId)
        : undefined;

    // Pinned participants
    // > Customers
    for (const pinnedCustomerId of statePinnedCustomers) {
      pinnedParticipants.push(
        <CardRefresh
          {...props}
          key={`connected-element-pinned-customer-${pinnedCustomerId}`}
          cardType="customer"
          id={pinnedCustomerId}
          //stateRideRequestList={stateConnectedRideRequests}
          //setStateRideRequestList={setStateConnectedRideRequests}
          unpinAction={() =>
            setStatePinnedCustomers(prev =>
              prev.filter(id => id !== pinnedCustomerId)
            )
          }
        />
      );
    }
    // > Ride Providers
    for (const pinnedRideProviderId of statePinnedRideProviders) {
      pinnedParticipants.push(
        <CardRefresh
          {...props}
          key={`connected-element-pinned-rideProvider-${pinnedRideProviderId}`}
          cardType="ride_provider"
          id={pinnedRideProviderId}
          //stateRideRequestList={stateConnectedRideRequests}
          //setStateRideRequestList={setStateConnectedRideRequests}
          unpinAction={() =>
            setStatePinnedRideProviders(prev =>
              prev.filter(id => id !== pinnedRideProviderId)
            )
          }
        />
      );
    }

    // > Connected ride requests
    for (const connectedRideRequest of Array.from(
      new Set(stateConnectedRideRequests)
    )) {
      connectedRideRequests.push(
        <CardRefresh
          {...props}
          key={`connected-element-rideRequest-${connectedRideRequest}`}
          cardType={'ride_request'}
          id={connectedRideRequest}
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
    // > Connected passengers
    if (
      currentSelectedSpectator &&
      currentSelectedSpectator.category ===
        intl.formatMessage({id: 'getacar.participant.rideProvider'})
    ) {
      for (const stateConnectedPassenger of stateConnectedPassengers) {
        connectedParticipants.push(
          <CardRefresh
            {...props}
            key={`connected-element-passenger-${stateConnectedPassenger}`}
            cardType="customer"
            id={stateConnectedPassenger}
            isPseudonym={true}
            label={intl.formatMessage(
              {
                id: 'connected',
              },
              {
                name: intl.formatMessage({
                  id: 'getacar.spectator.message.passenger',
                }),
              }
            )}
          />
        );
      }
    }
    // > Connected driver
    if (
      currentSelectedSpectator &&
      currentSelectedSpectator.category ===
        intl.formatMessage({id: 'getacar.participant.customer'}) &&
      stateConnectedDriver !== undefined
    ) {
      connectedParticipants.push(
        <CardRefresh
          {...props}
          key={`connected-element-driver-${stateConnectedDriver}`}
          cardType="ride_provider"
          id={stateConnectedDriver}
          isPseudonym={true}
          label={intl.formatMessage({
            id: 'getacar.participant.rideProvider.driver.message.connected',
          })}
        />
      );
    }

    return [
      {
        cards: pinnedParticipants,
        icon: <PinnedElementsIcon fontSize="large" />,
        title: intl.formatMessage({
          id: 'getacar.participant.message.pinned.plural',
        }),
      },
      {
        cards: connectedParticipants,
        icon: <ConnectedElementsIcon fontSize="large" />,
        title: intl.formatMessage({
          id: 'getacar.participant.message.connected.plural',
        }),
      },
      {
        cards: connectedRideRequests,
        icon: <ConnectedElementsIcon fontSize="large" />,
        title: intl.formatMessage({
          id: 'getacar.rideRequest.message.connected.plural',
        }),
      },
      {
        cards: connectedSmartContracts,
        icon: <ConnectedElementsIcon fontSize="large" />,
        title: intl.formatMessage(
          {id: 'connected'},
          {
            name: intl.formatMessage({id: 'getacar.smartContract.plural'}),
          }
        ),
      },
    ];
  }, [
    intl,
    props,
    setStatePinnedCustomers,
    setStatePinnedRideProviders,
    stateConnectedDriver,
    stateConnectedPassengers,
    stateConnectedRideRequests,
    statePinnedCustomers,
    statePinnedRideProviders,
    stateSelectedParticipantId,
    stateSpectators,
  ]);

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
    setStateInfoCardMapDismissed(true);
    // Dispatch event for leaflet so that it can fix it's tiles to the new size
    window.dispatchEvent(new Event('resize'));
  }, [setStateInfoCardMapDismissed]);

  return (
    <TabContainer fullPage={true}>
      <Box component="section" className={styles['tab-map']}>
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
                key="search-bar-map"
                placeholder={intl.formatMessage({
                  id: 'page.home.tab.map.search',
                })}
                searchActionTooltip={intl.formatMessage({
                  id: 'page.home.tab.map.search',
                })}
                primaryFilter={SearchBarId.SHOW_PARTICIPANT}
                actionsPost={searchActions}
                loading={stateLoadingParticipantCoordinates}
                displayValueFilter={searchIsCurrentSelectedParticipant}
              />
            </Grid>
            {stateInfoCardMapDismissed === false ? (
              <GridConnectedElementsCard
                key="connected-elements-card-info"
                muiGridItemSize={12}
                icon={undefined}
                title={intl.formatMessage({
                  id: 'page.home.tab.map.section.info.title',
                })}
                onDismiss={callbackOnDismiss}
              >
                <Typography variant="body2">
                  {intl.formatMessage({
                    id: 'page.home.tab.map.section.info.content',
                  })}
                </Typography>
              </GridConnectedElementsCard>
            ) : undefined}
            <Grid item xs={12}>
              <Box
                sx={{
                  height: `calc(100vh - 10rem - ${stateInfoCardMapDismissed ? '0rem' : '10rem'} - ${
                    (stateSettingsUiGridSpacing / 2) * 2
                  }rem)`,
                }}
              >
                <Map
                  {...props}
                  startPos={{lat: 48.7784485, long: 9.1800132, zoom: 11}}
                  setStateLoadingParticipantCoordinates={
                    setStateLoadingParticipantCoordinates
                  }
                  setStatePinnedCustomers={setStatePinnedCustomers}
                  setStatePinnedRideProviders={setStatePinnedRideProviders}
                  stateGraph={stateGraph}
                  stateGraphPathfinder={stateGraphPathfinder}
                  statePinnedCustomers={statePinnedCustomers}
                  statePinnedRideProviders={statePinnedRideProviders}
                />
              </Box>
            </Grid>
          </Grid>
        </GridConnectedElements>
        {/** Debug Section */}
        <Box
          sx={{
            '& > *': {m: 1},
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            marginTop: '1vh',
          }}
        >
          {stateSettingsGlobalDebug ? (
            <>
              <Divider>
                <Chip label="Debug Graphs/Pathfinder" size="small" />
              </Divider>
              <ButtonGroup variant="contained" aria-label="Basic button group">
                <GenericButton onClick={fetchGraphs}>
                  Fetch Graphs
                </GenericButton>
                <GenericButton onClick={clearGraphs}>
                  Clear Graphs
                </GenericButton>
              </ButtonGroup>
            </>
          ) : undefined}
        </Box>
      </Box>
    </TabContainer>
  );
}
