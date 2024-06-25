'use client';

// Package imports
import {useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {Box, ButtonGroup, Chip, Divider, Grid} from '@mui/material';
// Local imports
import {fetchJsonEndpoint, fetchTextEndpoint} from '@misc/fetch';
// > Components
import {
  ConnectedElementsIcon,
  MiscRideContractSmartContractIcon,
  ParticipantCustomerIcon,
  ParticipantRideProviderIcon,
  ParticipantRideRequestIcon,
  PinnedElementsIcon,
} from '@components/Icons';
import CardGeneric from '@components/Card/CardGeneric';
import CardParticipant from '@components/Card/CardParticipant';
import CardRefresh from '@components/Card/CardRefresh';
import CardRideRequest from '@components/Card/CardRideRequest';
import GenericButton from '@components/Button/GenericButton';
import GridConnectedElementsLayout from '@components/Grid/GridConnectedElementsLayout';
import Map from '@components/Map';
import SearchBar from '@components/TextInput/SearchBar';
import SectionChangeSpectator from './SectionChangeSpectator';
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
    stateSelectedParticipantId,
    stateSelectedParticipantType,
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

  const fetchGraphs = (clear = false) => {
    if (clear === true) {
      setGraphState({
        edges: [],
        geometry: [],
        vertices: [],
      });
      setPathfinderGraphState({
        edges: [],
        vertices: [],
      });
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
  };

  const fetchDebugData = (clear = false) => {
    if (clear === true) {
      setStateDebugData({
        customers: [],
        rideProviders: [],
        rideRequests: [],
        smartContracts: [],
      });
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
        ([participantCoordinatesData, rideRequestsData, smartContractsData]) =>
          Promise.all([
            Promise.all(
              participantCoordinatesData.customers.map(a =>
                fetchJsonSimulation<SimulationEndpointParticipantInformationCustomer>(
                  simulationEndpoints.apiV1.participantInformationCustomer(a.id)
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
  };

  const changeSpectatorInfo = intl.formatMessage({
    id: 'getacar.spectator.change',
  });

  const fetchParticipantCoordinates = () =>
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
                  simulationEndpoints.apiV1.participantInformationCustomer(a.id)
                );
              const customer = intl.formatMessage({
                id: 'getacar.participant.customer',
              });
              return {
                callback: () => {
                  console.log(`Selected Customer ${a.id}`);
                },
                icon: <ParticipantCustomerIcon />,
                keywords: [
                  changeSpectatorInfo,
                  customer,
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
                icon: <ParticipantRideProviderIcon />,
                keywords: [
                  changeSpectatorInfo,
                  rideProvider,
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
      .catch(err => showError('Fetch simulation participant coordinates', err));

  // TODO: Start Position

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

  // React: Effects
  useEffect(() => {
    const interval = setInterval(
      () => fetchParticipantCoordinates(),
      stateSettingsMapUpdateRateInMs
    );
    return () => {
      clearInterval(interval);
    };
  });

  /** Specify dismissible cards that should be displayed */
  const stateInfoElements = useMemo<Array<InfoElement>>(
    () => [
      {
        description: intl.formatMessage({
          id: 'page.home.tab.map.section.info.content',
        }),
        title: intl.formatMessage({
          id: 'page.home.tab.map.section.info.title',
        }),
      },
    ],
    [intl]
  );

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

    // Pinned participants
    // > Customers
    for (const pinnedCustomerId of statePinnedCustomers) {
      pinnedParticipants.push(
        <CardRefresh
          {...props}
          cardType={'customer'}
          id={pinnedCustomerId}
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
          cardType={'ride_provider'}
          id={pinnedRideProviderId}
          onUnpin={() =>
            setStatePinnedRideProviders(prev =>
              prev.filter(id => id !== pinnedRideProviderId)
            )
          }
        />
      );
    }

    // Selected Participant
    const participantSelected =
      stateSelectedParticipantId !== undefined &&
      stateSelectedParticipantType !== undefined;
    // > Connected ride requests
    if (participantSelected) {
      // TODO
      connectedRideRequests.push(
        <CardGeneric
          {...props}
          name={intl.formatMessage({
            id: 'getacar.rideRequest',
          })}
          content={[{content: 'TODO'}]}
          icon={<ParticipantRideRequestIcon />}
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
    if (participantSelected) {
      // TODO
      connectedSmartContracts.push(
        <CardGeneric
          {...props}
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
      participantSelected &&
      stateSelectedParticipantType === 'ride_provider'
    ) {
      // TODO
      connectedParticipants.push(
        <CardGeneric
          {...props}
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
    if (participantSelected && stateSelectedParticipantType === 'customer') {
      // TODO
      connectedParticipants.push(
        <CardGeneric
          {...props}
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
    statePinnedCustomers,
    statePinnedRideProviders,
    stateSelectedParticipantId,
    stateSelectedParticipantType,
  ]);

  return (
    <TabContainer fullPage={true}>
      <Box
        sx={{
          '& > *': {m: 1},
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          marginBottom: `${stateSettingsUiGridSpacing / 2}rem`,
          marginTop: `${stateSettingsUiGridSpacing / 2}rem`,
        }}
      >
        <SectionChangeSpectator {...props} />
      </Box>
      <Box component="section" className={styles['tab-map']}>
        <GridConnectedElementsLayout
          stateSettingsUiGridSpacing={stateSettingsUiGridSpacing}
          stateConnectedElements={stateConnectedElements}
          stateInfoElements={stateInfoElements}
        >
          <Grid container spacing={stateSettingsUiGridSpacing}>
            <Grid item xs={12}>
              <SearchBar {...propsTabMap} />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  height: `calc(100vh - 13rem - ${
                    (stateSettingsUiGridSpacing / 2) * 3
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
                <GenericButton onClick={() => fetchGraphs()}>
                  Fetch Graphs
                </GenericButton>
                <GenericButton onClick={() => fetchGraphs(true)}>
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
                <GenericButton onClick={() => fetchDebugData()}>
                  Fetch Debug Data
                </GenericButton>
                <GenericButton onClick={() => fetchDebugData(true)}>
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
