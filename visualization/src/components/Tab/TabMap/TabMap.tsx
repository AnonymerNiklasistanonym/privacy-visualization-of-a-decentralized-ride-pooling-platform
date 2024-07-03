'use client';

// Package imports
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {Box, ButtonGroup, Chip, Divider, Grid} from '@mui/material';
import {Clear as DeleteIcon} from '@mui/icons-material';
// Local imports
import {fetchJsonEndpoint, fetchTextEndpoint} from '@misc/fetch';
// > Components
import {
  ConnectedElementsIcon,
  MiscRideContractSmartContractIcon,
  NavigateToLocationIcon,
  ParticipantCustomerIcon,
  ParticipantRideProviderIcon,
  ParticipantRideRequestIcon,
  PinnedElementsIcon,
} from '@components/Icons';
import CardGeneric from '@components/Card/CardGeneric';
import CardRefresh from '@components/Card/CardRefresh';
import GenericButton from '@components/Button/GenericButton';
import GridConnectedElementsLayout from '@components/Grid/GridConnectedElementsLayout';
import InputChangeSpectator from '@components/Input/InputChangeSpectator';
import InputSearchBar from '@components/Input/InputSearchBar';
import Map from '@components/Map';
import TabContainer from '@components/Tab/TabContainer';
import TableDebugData from '@components/Table/TableDebugData';
// > Globals
import {
  pathfinderEndpoints,
  simulationEndpoints,
} from '@globals/defaults/endpoints';
// > Styles
import '@styles/Map.module.scss';
import styles from '@styles/Map.module.scss';
// Type imports
import type {
  ConnectedElementSection,
  InfoElement,
} from '@components/Grid/GridConnectedElementsLayout';
import type {
  GlobalPropsFetch,
  GlobalPropsIntlValues,
  GlobalPropsSearch,
  GlobalPropsShowError,
  GlobalPropsSpectatorMap,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
  GlobalPropsSpectatorsSet,
} from '@misc/props/global';
import type {
  SettingsConnectedElementsProps,
  SettingsMapProps,
  SettingsUiProps,
} from '@misc/props/settings';
import type {
  SimulationEndpointGraphInformation,
  SimulationEndpointParticipantCoordinates,
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointRideRequestInformation,
  SimulationEndpointRideRequests,
  SimulationEndpointSmartContractInformation,
  SimulationEndpointSmartContracts,
} from '@globals/types/simulation';
import type {DebugData} from '@components/Table/DebugData';
import type {MapProps} from '@components/Map';
import type {PathfinderEndpointGraphInformation} from '@globals/types/pathfinder';
import type {ReactElement} from 'react';

export interface TabMapProps
  extends SettingsMapProps,
    SettingsUiProps,
    SettingsConnectedElementsProps,
    MapProps,
    GlobalPropsSpectatorsSet,
    GlobalPropsSpectatorMap,
    GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorSelectedElementsSet,
    GlobalPropsSearch,
    GlobalPropsShowError,
    GlobalPropsIntlValues,
    GlobalPropsFetch {}

export default function TabMap(props: TabMapProps) {
  const intl = useIntl();
  const {
    fetchJsonSimulation,
    showError,
    setStateShowSpectator,
    setStateSelectedSpectator,
    setStateSpectator,
    stateSpectator,
    stateSpectators,
    stateSelectedSpectator,
    stateSettingsGlobalDebug,
    stateSettingsMapBaseUrlPathfinder,
    stateSettingsMapBaseUrlSimulation,
    stateSettingsMapUpdateRateInMs,
    stateSettingsUiGridSpacing,
    updateGlobalSearch,
  } = props;

  // React states
  // > Debug
  const [stateDebugData, setStateDebugData] = useState<DebugData>({
    customers: [],
    rideProviders: [],
    rideRequests: [],
    smartContracts: [],
  });
  // > Participant coordinates
  const [stateParticipantCoordinatesList, setStateParticipantCoordinatesList] =
    useState<SimulationEndpointParticipantCoordinates>({
      customers: [],
      rideProviders: [],
    });
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
  // > Pinned participants
  const [statePinnedCustomers, setStatePinnedCustomers] = useState<
    Array<string>
  >([]);
  const [statePinnedRideProviders, setStatePinnedRideProviders] = useState<
    Array<string>
  >([]);

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
        .then(data => setGraphState(data))
        .catch(err => showError('Fetch simulation graph', err));
      fetchJsonEndpoint<PathfinderEndpointGraphInformation>(
        stateSettingsMapBaseUrlPathfinder,
        pathfinderEndpoints.graphInformation
      )
        .then(data => setPathfinderGraphState(data))
        .catch(err => showError('Fetch pathfinder graph', err));
    },
    [fetchJsonSimulation, showError, stateSettingsMapBaseUrlPathfinder]
  );
  const clearGraphs = useCallback(() => fetchGraphs(true), [fetchGraphs]);

  const fetchDebugData = useCallback(
    (clear = false) => {
      if (clear === true) {
        setStateDebugData(prev => ({
          ...prev,
          customers: [],
          rideProviders: [],
          rideRequests: [],
          smartContracts: [],
        }));
        return;
      }

      Promise.all([
        fetchJsonSimulation<SimulationEndpointParticipantCoordinates>(
          simulationEndpoints.apiV1.participantCoordinates
        ),
        fetchJsonSimulation<SimulationEndpointRideRequests>(
          simulationEndpoints.apiV1.rideRequests
        ),
        fetchJsonSimulation<SimulationEndpointSmartContracts>(
          simulationEndpoints.apiV1.smartContracts
        ),
      ])
        .then(
          ([
            participantCoordinatesData,
            rideRequestsData,
            smartContractsData,
          ]) =>
            Promise.all([
              Promise.all(
                participantCoordinatesData.customers.map(a =>
                  fetchJsonSimulation<SimulationEndpointParticipantInformationCustomer>(
                    simulationEndpoints.apiV1.participantInformationCustomer(
                      a.id
                    )
                  )
                )
              ),
              Promise.all(
                participantCoordinatesData.rideProviders.map(a =>
                  fetchJsonSimulation<SimulationEndpointParticipantInformationRideProvider>(
                    simulationEndpoints.apiV1.participantInformationRideProvider(
                      a.id
                    )
                  )
                )
              ),
              Promise.all(
                rideRequestsData.rideRequests.map(a =>
                  fetchJsonSimulation<SimulationEndpointRideRequestInformation>(
                    simulationEndpoints.apiV1.rideRequestInformation(a)
                  )
                )
              ),
              Promise.all(
                smartContractsData.smartContracts.map(a =>
                  fetchJsonSimulation<SimulationEndpointSmartContractInformation>(
                    simulationEndpoints.apiV1.smartContract(a)
                  )
                )
              ),
            ])
        )
        .then(([customers, rideProviders, rideRequests, smartContracts]) => {
          setStateDebugData({
            customers,
            rideProviders,
            rideRequests,
            smartContracts,
          });
        })
        .catch(err => showError('Fetch debug data', err));
    },
    [fetchJsonSimulation, showError]
  );
  const clearDebugData = useCallback(
    () => fetchDebugData(true),
    [fetchDebugData]
  );

  const changeSpectatorInfo = intl.formatMessage({
    id: 'getacar.spectator.change',
  });

  const fetchParticipantCoordinates = useCallback(
    () =>
      fetchJsonSimulation<SimulationEndpointParticipantCoordinates>(
        simulationEndpoints.apiV1.participantCoordinates
      )
        .then(data => {
          setStateParticipantCoordinatesList(data);
          updateGlobalSearch(
            data.customers.map(a => [
              a.id,
              async () => {
                const customerInformation =
                  await fetchJsonSimulation<SimulationEndpointParticipantInformationCustomer>(
                    simulationEndpoints.apiV1.participantInformationCustomer(
                      a.id
                    )
                  );
                const customer = intl.formatMessage({
                  id: 'getacar.participant.customer',
                });
                return {
                  callback: () => {
                    console.log(`Selected Customer ${a.id}`);
                  },
                  category: customer,
                  icon: <ParticipantCustomerIcon />,
                  keywords: [
                    changeSpectatorInfo,
                    a.id,
                    customerInformation.fullName,
                  ],
                  name: `${customer} ${customerInformation.fullName}`,
                };
              },
            ]),
            [],
            []
          );
          updateGlobalSearch(
            data.rideProviders.map(a => [
              a.id,
              async () => {
                const rideProviderInformation =
                  await fetchJsonSimulation<SimulationEndpointParticipantInformationRideProvider>(
                    simulationEndpoints.apiV1.participantInformationRideProvider(
                      a.id
                    )
                  );
                const rideProvider = intl.formatMessage({
                  id: 'getacar.participant.rideProvider',
                });
                return {
                  callback: () => {
                    console.log(`Selected Ride Provider ${a.id}`);
                  },
                  category: rideProvider,
                  icon: <ParticipantRideProviderIcon />,
                  keywords: [
                    changeSpectatorInfo,
                    a.id,
                    'company' in rideProviderInformation
                      ? rideProviderInformation.company
                      : rideProviderInformation.fullName,
                  ],
                  name: `${rideProvider} ${
                    'company' in rideProviderInformation
                      ? rideProviderInformation.company
                      : rideProviderInformation.fullName
                  }`,
                };
              },
            ]),
            [],
            []
          );
        })
        .catch(err =>
          showError('Fetch simulation participant coordinates', err)
        ),
    [
      changeSpectatorInfo,
      fetchJsonSimulation,
      intl,
      showError,
      updateGlobalSearch,
    ]
  );

  const propsTabMap = {
    ...props,
    setStatePinnedCustomers,
    setStatePinnedRideProviders,
    showRideRequest: true,
    stateGraph,
    stateGraphPathfinder,
    stateParticipantCoordinatesList,
    statePinnedCustomers,
    statePinnedRideProviders,
  };

  const requestBalancer = useRef(false);

  // React: Effects
  // > Fetch Participant Coordinates
  useEffect(() => {
    const interval = setInterval(() => {
      if (requestBalancer.current) {
        console.warn(
          'Stopped participant coordinates fetch since a request is already happening'
        );
        return;
      }
      requestBalancer.current = true;
      fetchParticipantCoordinates().finally(() => {
        requestBalancer.current = false;
      });
    }, stateSettingsMapUpdateRateInMs);
    return () => {
      clearInterval(interval);
    };
  });
  // > Fetch Selected Participant
  // TODO Make this better
  useEffect(() => {
    const interval = setInterval(() => {
      if (stateSelectedSpectator === undefined) {
        return;
      }
      const selectedSpectator = stateSpectators.get(stateSelectedSpectator);
      if (selectedSpectator === undefined) {
        return;
      }
      if (
        selectedSpectator.category ===
        intl.formatMessage({
          id: 'getacar.participant.customer',
        })
      ) {
        fetchJsonSimulation<SimulationEndpointParticipantInformationCustomer>(
          simulationEndpoints.apiV1.participantInformationCustomer(
            stateSelectedSpectator
          )
        ).then(customerInformation => {
          const connectedRideRequest = customerInformation.rideRequest;
          if (
            connectedRideRequest !== undefined &&
            !stateConnectedRideRequests.includes(connectedRideRequest)
          ) {
            setStateConnectedRideRequests(prev => [
              ...prev,
              connectedRideRequest,
            ]);
          }
        });
      } else if (
        selectedSpectator.category ===
        intl.formatMessage({
          id: 'getacar.participant.rideProvider',
        })
      ) {
        fetchJsonSimulation<SimulationEndpointParticipantInformationRideProvider>(
          simulationEndpoints.apiV1.participantInformationRideProvider(
            stateSelectedSpectator
          )
        ).then(rideProviderInformation => {
          const connectedRideRequest = rideProviderInformation.rideRequest;
          if (
            connectedRideRequest !== undefined &&
            !stateConnectedRideRequests.includes(connectedRideRequest)
          ) {
            setStateConnectedRideRequests(prev => [
              ...prev,
              connectedRideRequest,
            ]);
          }
        });
      }
    }, stateSettingsMapUpdateRateInMs);
    return () => {
      clearInterval(interval);
    };
  });

  /** Specify dismissible cards that should be displayed */
  const stateInfoElements = useMemo<Array<InfoElement>>(() => {
    const currentSpectator = stateSpectators.get(stateSpectator);
    const currentSelectedSpectator =
      stateSelectedSpectator !== undefined
        ? stateSpectators.get(stateSelectedSpectator)
        : undefined;
    const buttonCurrentSpectator = (
      <GenericButton
        disabled={
          currentSpectator?.category !== undefined
            ? ![
                intl.formatMessage({
                  id: 'getacar.participant.customer',
                }),
                intl.formatMessage({
                  id: 'getacar.participant.rideProvider',
                }),
              ].includes(currentSpectator?.category)
            : true
        }
        icon={<NavigateToLocationIcon />}
        onClick={() => setStateShowSpectator(stateSpectator)}
        secondaryColor={true}
      >
        {intl.formatMessage({
          id: 'getacar.spectator.showCurrent',
        })}
      </GenericButton>
    );
    const buttonCurrentSpectatorClear = (
      <GenericButton
        disabled={stateSpectator === 'everything'}
        icon={<DeleteIcon />}
        onClick={() => setStateSpectator('everything')}
        secondaryColor={true}
      />
    );
    const buttonCurrentSelectedSpectator = (
      <GenericButton
        disabled={
          currentSelectedSpectator?.category !== undefined
            ? ![
                intl.formatMessage({
                  id: 'getacar.participant.customer',
                }),
                intl.formatMessage({
                  id: 'getacar.participant.rideProvider',
                }),
              ].includes(currentSelectedSpectator?.category)
            : true
        }
        icon={<NavigateToLocationIcon />}
        onClick={() => setStateShowSpectator(stateSelectedSpectator)}
      >
        {intl.formatMessage({
          id: 'getacar.participant.showSelected',
        })}
      </GenericButton>
    );
    const buttonCurrentSelectedSpectatorClear = (
      <GenericButton
        disabled={currentSelectedSpectator?.category === undefined}
        icon={<DeleteIcon />}
        onClick={() => setStateSelectedSpectator(undefined)}
      />
    );
    return [
      {
        content: (
          <>
            <InputChangeSpectator {...props} />
            <ButtonGroup
              sx={{
                display: {sm: 'flex', xs: 'none'},
                marginTop: `${stateSettingsUiGridSpacing / 2}rem`,
              }}
            >
              {buttonCurrentSpectator}
              {buttonCurrentSpectatorClear}
              {buttonCurrentSelectedSpectator}
              {buttonCurrentSelectedSpectatorClear}
            </ButtonGroup>
            <ButtonGroup
              sx={{
                display: {sm: 'none', xs: 'flex'},
                marginTop: `${stateSettingsUiGridSpacing / 2}rem`,
              }}
            >
              <Grid
                container
                spacing={stateSettingsUiGridSpacing}
                justifyContent="center"
              >
                <Grid item xs={12} sm={6}>
                  <ButtonGroup sx={{width: '100%'}}>
                    {buttonCurrentSpectator}
                    {buttonCurrentSpectatorClear}
                  </ButtonGroup>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ButtonGroup sx={{width: '100%'}}>
                    {buttonCurrentSelectedSpectator}
                    {buttonCurrentSelectedSpectatorClear}
                  </ButtonGroup>
                </Grid>
              </Grid>
            </ButtonGroup>
          </>
        ),
      },
      {
        content: intl.formatMessage({
          id: 'page.home.tab.map.section.info.content',
        }),
        dismissible: true,
        title: intl.formatMessage({
          id: 'page.home.tab.map.section.info.title',
        }),
      },
    ];
  }, [
    intl,
    props,
    setStateShowSpectator,
    setStateSelectedSpectator,
    setStateSpectator,
    stateSelectedSpectator,
    stateSettingsUiGridSpacing,
    stateSpectator,
    stateSpectators,
  ]);

  const [stateConnectedRideRequests, setStateConnectedRideRequests] = useState<
    Array<string>
  >([]);

  /** Specify which connected elements should be displayed */
  const stateConnectedElements = useMemo<Array<ConnectedElementSection>>(() => {
    /** The pinned participant cards */
    const pinnedParticipants: Array<ReactElement> = [];
    /** The connected participants */
    const connectedParticipants: Array<ReactElement> = [];
    /** The connected ride requests */
    const connectedRideRequests: Array<ReactElement> = [];
    /** The connected smart contracts */
    const connectedSmartContracts: Array<ReactElement> = [];

    const currentSelectedSpectator =
      stateSelectedSpectator !== undefined
        ? stateSpectators.get(stateSelectedSpectator)
        : undefined;

    // Pinned participants
    // > Customers
    for (const pinnedCustomerId of statePinnedCustomers) {
      pinnedParticipants.push(
        <CardRefresh
          {...props}
          key={`connected-element-pinned-customer-${pinnedCustomerId}`}
          cardType={'customer'}
          id={pinnedCustomerId}
          stateRideRequestList={stateConnectedRideRequests}
          setStateRideRequestList={setStateConnectedRideRequests}
          onUnpin={() =>
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
          cardType={'ride_provider'}
          id={pinnedRideProviderId}
          stateRideRequestList={stateConnectedRideRequests}
          setStateRideRequestList={setStateConnectedRideRequests}
          onUnpin={() =>
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
              id: 'getacar.spectator.message.connected',
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
    // > Connected smart contracts
    if (currentSelectedSpectator) {
      // TODO
      connectedSmartContracts.push(
        <CardGeneric
          {...props}
          key={`connected-element-smartContract-${'TODO'}`}
          name={intl.formatMessage({
            id: 'getacar.smartContract',
          })}
          content={[{content: 'TODO'}]}
          icon={<MiscRideContractSmartContractIcon />}
          label={intl.formatMessage(
            {
              id: 'getacar.spectator.message.connected',
            },
            {
              name: intl.formatMessage({
                id: 'getacar.smartContract',
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
      // TODO
      connectedParticipants.push(
        <CardGeneric
          {...props}
          key={`connected-element-passenger-${'TODO'}`}
          name={intl.formatMessage({
            id: 'getacar.participant.customer',
          })}
          content={[{content: 'TODO'}]}
          icon={<ParticipantCustomerIcon />}
          label={intl.formatMessage(
            {
              id: 'getacar.spectator.message.connected',
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
    // > Connected driver
    if (
      currentSelectedSpectator &&
      currentSelectedSpectator.category ===
        intl.formatMessage({id: 'getacar.participant.customer'})
    ) {
      // TODO
      connectedParticipants.push(
        <CardGeneric
          {...props}
          key={`connected-element-driver-${'TODO'}`}
          name={intl.formatMessage({
            id: 'getacar.participant.rideProvider',
          })}
          content={[{content: 'TODO'}]}
          icon={<ParticipantRideProviderIcon />}
          label={intl.formatMessage(
            {
              id: 'getacar.spectator.message.connected',
            },
            {
              name: intl.formatMessage({
                id: 'getacar.spectator.message.driver',
              }),
            }
          )}
        />
      );
    }

    return [
      {
        elements: pinnedParticipants,
        icon: <PinnedElementsIcon fontSize="large" />,
        title: intl.formatMessage(
          {id: 'getacar.spectator.message.pinned'},
          {
            name: intl.formatMessage({id: 'getacar.participant.plural'}),
          }
        ),
      },
      {
        elements: connectedParticipants,
        icon: <ConnectedElementsIcon fontSize="large" />,
        title: intl.formatMessage(
          {id: 'getacar.spectator.message.connected'},
          {
            name: intl.formatMessage({id: 'getacar.participant.plural'}),
          }
        ),
      },
      {
        elements: connectedRideRequests,
        icon: <ConnectedElementsIcon fontSize="large" />,
        title: intl.formatMessage(
          {id: 'getacar.spectator.message.connected'},
          {
            name: intl.formatMessage({id: 'getacar.rideRequest.plural'}),
          }
        ),
      },
      {
        elements: connectedSmartContracts,
        icon: <ConnectedElementsIcon fontSize="large" />,
        title: intl.formatMessage(
          {id: 'getacar.spectator.message.connected'},
          {
            name: intl.formatMessage({id: 'getacar.smartContract.plural'}),
          }
        ),
      },
    ];
  }, [
    intl,
    props,
    stateConnectedRideRequests,
    statePinnedCustomers,
    statePinnedRideProviders,
    stateSelectedSpectator,
    stateSpectators,
  ]);

  return (
    <TabContainer fullPage={true}>
      <Box component="section" className={styles['tab-map']}>
        <GridConnectedElementsLayout
          stateSettingsUiGridSpacing={stateSettingsUiGridSpacing}
          stateConnectedElements={stateConnectedElements}
          stateInfoElements={stateInfoElements}
        >
          <Grid container spacing={stateSettingsUiGridSpacing}>
            <Grid item xs={12}>
              <InputSearchBar
                {...propsTabMap}
                key={'search-bar-map'}
                placeholder={intl.formatMessage({
                  id: 'page.home.tab.map.search',
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  height: `calc(100vh - 10rem - ${
                    (stateSettingsUiGridSpacing / 2) * 2
                  }rem)`,
                }}
              >
                <Map
                  {...propsTabMap}
                  startPos={{lat: 48.7784485, long: 9.1800132, zoom: 11}}
                />
              </Box>
            </Grid>
          </Grid>
        </GridConnectedElementsLayout>
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
                <Chip label="Control Simulation" size="small" />
              </Divider>
              <ButtonGroup variant="contained" aria-label="Basic button group">
                <GenericButton
                  onClick={() =>
                    fetchTextEndpoint(
                      stateSettingsMapBaseUrlSimulation,
                      simulationEndpoints.simulation.state
                    )
                      .then(a => alert(`Simulation state: ${a}`))
                      .catch(err => showError('Fetch simulation state', err))
                  }
                >
                  State
                </GenericButton>
                <GenericButton
                  onClick={() =>
                    fetchTextEndpoint(
                      stateSettingsMapBaseUrlSimulation,
                      simulationEndpoints.simulation.pause
                    ).catch(err =>
                      showError('Fetch simulation state pause', err)
                    )
                  }
                >
                  Pause
                </GenericButton>
                <GenericButton
                  onClick={() =>
                    fetchTextEndpoint(
                      stateSettingsMapBaseUrlSimulation,
                      simulationEndpoints.simulation.run
                    ).catch(err => showError('Fetch simulation state run', err))
                  }
                >
                  Run
                </GenericButton>
              </ButtonGroup>{' '}
            </>
          ) : undefined}

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
          {stateSettingsGlobalDebug ? (
            <>
              <Divider>
                <Chip label="Debug Data" size="small" />
              </Divider>
              <ButtonGroup variant="contained" aria-label="Basic button group">
                <GenericButton onClick={fetchDebugData}>
                  Fetch Debug Data
                </GenericButton>
                <GenericButton onClick={clearDebugData}>
                  Clear Debug Data
                </GenericButton>
              </ButtonGroup>
            </>
          ) : undefined}
          {stateSettingsGlobalDebug ? (
            <>
              <Divider>
                <Chip label="Customers" size="small" variant="outlined" />
              </Divider>
              <TableDebugData
                stateDebugData={stateDebugData}
                debugDataType="customer"
              />
              <Divider>
                <Chip label="Ride Providers" size="small" variant="outlined" />
              </Divider>
              <TableDebugData
                stateDebugData={stateDebugData}
                debugDataType="ride_provider"
              />
              <Divider>
                <Chip label="Ride Requests" size="small" variant="outlined" />
              </Divider>
              <TableDebugData
                stateDebugData={stateDebugData}
                debugDataType="ride_request"
              />
              <Divider>
                <Chip label="Smart Contracts" size="small" variant="outlined" />
              </Divider>
              <TableDebugData
                stateDebugData={stateDebugData}
                debugDataType="smart_contract"
              />
            </>
          ) : undefined}
        </Box>
      </Box>
    </TabContainer>
  );
}
