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
  ParticipantCustomerIcon,
  ParticipantRideProviderIcon,
} from '@components/Icons';
import CardParticipant from '@components/Card/CardParticipant';
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
  DismissibleElement,
} from '@components/Grid/GridConnectedElementsLayout';
import type {
  GlobalPropsFetch,
  GlobalPropsParticipantSelectedElements,
  GlobalPropsParticipantSelectedElementsSet,
  GlobalPropsSearch,
  GlobalPropsShowError,
  GlobalPropsSpectatorMap,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
  GlobalPropsSpectatorsSet,
} from '@misc/props/global';
import type {SettingsMapProps, SettingsUiProps} from '@misc/props/settings';
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
    MapProps,
    GlobalPropsSpectatorsSet,
    GlobalPropsSpectatorMap,
    GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorSelectedElementsSet,
    GlobalPropsParticipantSelectedElements,
    GlobalPropsParticipantSelectedElementsSet,
    GlobalPropsSearch,
    GlobalPropsShowError,
    GlobalPropsFetch {}

export default function TabMap(props: TabMapProps) {
  const intl = useIntl();
  const {
    fetchJsonSimulation,
    showError,
    stateSettingsGlobalDebug,
    stateSettingsMapBaseUrlPathfinder,
    stateSettingsMapBaseUrlSimulation,
    stateSettingsMapUpdateRateInMs,
    stateSettingsUiGridSpacing,
    setStateSettingsUiGridSpacing,
    updateGlobalSearch,
  } = props;

  // React states
  const [stateDebugData, setStateDebugData] = useState<DebugData>({
    customers: [],
    rideProviders: [],
    rideRequests: [],
    smartContracts: [],
  });
  const [stateParticipantCoordinatesList, setStateParticipantCoordinatesList] =
    useState<SimulationEndpointParticipantCoordinates>({
      customers: [],
      rideProviders: [],
    });
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
    showRideRequest: true,
    stateGraph,
    stateGraphPathfinder,
    stateParticipantCoordinatesList,
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

  const stateDismissibleElements = useMemo<Array<DismissibleElement>>(
    () => [],
    []
  );

  const stateConnectedElements = useMemo<Array<ConnectedElementSection>>(() => {
    const selectedElements: Array<ReactElement> = [];
    if (
      props.stateSelectedParticipantTypeGlobal === 'customer' &&
      props.stateSelectedParticipantCustomerInformationGlobal !== undefined
    ) {
      selectedElements.push(
        <CardParticipant
          {...props}
          participantType={props.stateSelectedParticipantTypeGlobal}
          stateCustomerInformation={
            props.stateSelectedParticipantCustomerInformationGlobal
          }
          stateRideProviderInformation={null}
          stateParticipantId={
            props.stateSelectedParticipantCustomerInformationGlobal.id
          }
          label={intl.formatMessage(
            {
              id: 'getacar.spectator.message.lastSelected',
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
    if (
      props.stateSelectedParticipantTypeGlobal === 'ride_provider' &&
      props.stateSelectedParticipantRideProviderInformationGlobal !== undefined
    ) {
      selectedElements.push(
        <CardParticipant
          {...props}
          participantType={props.stateSelectedParticipantTypeGlobal}
          stateCustomerInformation={null}
          stateRideProviderInformation={
            props.stateSelectedParticipantRideProviderInformationGlobal
          }
          stateParticipantId={
            props.stateSelectedParticipantRideProviderInformationGlobal.id
          }
          label={intl.formatMessage(
            {
              id: 'getacar.spectator.message.lastSelected',
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
    if (
      props.stateSelectedParticipantRideRequestInformationGlobal !== undefined
    ) {
      selectedElements.push(
        <CardRideRequest
          {...props}
          stateRideRequestInformation={
            props.stateSelectedParticipantRideRequestInformationGlobal
          }
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
    if (
      props.stateSelectedParticipantTypeGlobal !== 'ride_provider' &&
      props.stateSelectedParticipantRideProviderInformationGlobal !== undefined
    ) {
      selectedElements.push(
        <CardParticipant
          {...props}
          participantType={
            props.stateSelectedParticipantRideProviderInformationGlobal.type
          }
          stateCustomerInformation={null}
          stateRideProviderInformation={
            props.stateSelectedParticipantRideProviderInformationGlobal
          }
          stateParticipantId={
            props.stateSelectedParticipantRideProviderInformationGlobal.id
          }
          label={intl.formatMessage({
            id: 'getacar.spectator.message.driver',
          })}
        />
      );
    }
    if (
      props.stateSelectedParticipantTypeGlobal !== 'customer' &&
      props.stateSelectedParticipantCustomerInformationGlobal !== undefined
    ) {
      selectedElements.push(
        <CardParticipant
          {...props}
          participantType={
            props.stateSelectedParticipantCustomerInformationGlobal.type
          }
          stateCustomerInformation={
            props.stateSelectedParticipantCustomerInformationGlobal
          }
          stateRideProviderInformation={null}
          stateParticipantId={
            props.stateSelectedParticipantCustomerInformationGlobal.id
          }
          label={intl.formatMessage({
            id: 'getacar.spectator.message.passenger',
          })}
        />
      );
    }
    return [
      {
        elements: selectedElements,
        icon: <ConnectedElementsIcon fontSize="large" />,
        title: 'Connected Elements',
      },
    ];
  }, [intl, props]);

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
          stateDismissibleElements={stateDismissibleElements}
        >
          <Grid container spacing={stateSettingsUiGridSpacing}>
            <Grid item xs={12}>
              <SearchBar
                placeholder="TODO: Search map"
                {...props}
                {...propsTabMap}
              />
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
                  {...props}
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
