'use client';

// Package imports
import {useEffect, useState} from 'react';
// > Components
import {
  Box,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
// Local imports
import {fetchJsonEndpoint, fetchTextEndpoint} from '@misc/fetch';
// > Components
import {
  ParticipantCustomerIcon,
  ParticipantRideProviderIcon,
  ServiceAuthenticationIcon,
  ServiceMatchingIcon,
  SpectatorEverythingIcon,
  SpectatorPublicIcon,
} from '@components/Icons';
import CardParticipant from '@components/Card/CardParticipant';
import CardRideRequest from '@components/Card/CardRideRequest';
import GenericButton from '@components/Button/GenericButton';
import Map from '@components/Map';
import SearchBar from '@components/TextInput/SearchBar';
import TabContainer from '@components/Tab/TabContainer';
import TableDebugData from '@components/Table/TableDebugData';
//import TextInputSpectator from '@components/TextInput/TextInputSpectator';
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
  GlobalPropsFetch,
  GlobalPropsParticipantSelectedElements,
  GlobalPropsParticipantSelectedElementsSet,
  GlobalPropsSearch,
  GlobalPropsShowError,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
  GlobalPropsSpectatorsSet,
} from '@misc/props/global';
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
import type {ReactNode} from 'react';
import type {SettingsMapProps} from '@misc/props/settings';

export interface TabMapProps
  extends SettingsMapProps,
    MapProps,
    GlobalPropsSpectatorsSet,
    GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorSelectedElementsSet,
    GlobalPropsParticipantSelectedElements,
    GlobalPropsParticipantSelectedElementsSet,
    GlobalPropsSearch,
    GlobalPropsShowError,
    GlobalPropsFetch {}

export default function TabMap(props: TabMapProps) {
  const {
    fetchJsonSimulation,
    setStateSelectedParticipant,
    setStateSelectedRideRequest,
    showError,
    stateSelectedParticipant,
    stateSelectedRideRequest,
    stateSettingsGlobalDebug,
    stateSettingsMapBaseUrlPathfinder,
    stateSettingsMapBaseUrlSimulation,
    stateSettingsMapUpdateRateInMs,
    stateSelectedParticipantTypeGlobal,
    stateSelectedParticipantCustomerInformationGlobal,
    stateSelectedParticipantRideProviderInformationGlobal,
    stateSelectedParticipantRideRequestInformationGlobal,
    setStateSelectedParticipantTypeGlobal,
    setStateSelectedParticipantCustomerInformationGlobal,
    setStateSelectedParticipantRideRequestInformationGlobal,
    setStateSelectedParticipantRideProviderInformationGlobal,
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

  // TODO: Start Position

  const propsTabMap = {
    setStateSelectedParticipant,
    setStateSelectedRideRequest,
    stateGraph,
    stateGraphPathfinder,
    stateParticipantCoordinatesList,
    stateSelectedParticipant,
    stateSelectedRideRequest,
  };

  // React: Effects
  useEffect(() => {
    const interval = setInterval(() => {
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
                return {
                  callback: () => {
                    console.log(`Selected Customer ${a.id}`);
                  },
                  icon: <ParticipantCustomerIcon />,
                  keywords: ['Customer', a.id, customerInformation.fullName],
                  name: `Customer ${customerInformation.fullName}`,
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
                return {
                  callback: () => {
                    console.log(`Selected Ride Provider ${a.id}`);
                  },
                  icon: <ParticipantRideProviderIcon />,
                  keywords: [
                    'Ride Provider',
                    a.id,
                    'company' in rideProviderInformation
                      ? rideProviderInformation.company
                      : rideProviderInformation.fullName,
                  ],
                  name: `Ride Provider ${
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
        );
    }, stateSettingsMapUpdateRateInMs);
    return () => {
      clearInterval(interval);
    };
  });

  // TODO Fix Text input spectator

  const onDelete = () => {
    setStateSelectedParticipantTypeGlobal(undefined);
    setStateSelectedParticipantCustomerInformationGlobal(undefined);
    setStateSelectedParticipantRideRequestInformationGlobal(undefined);
    setStateSelectedParticipantRideProviderInformationGlobal(undefined);
  };

  const selectedElements: Array<ReactNode> = [];
  if (
    stateSelectedParticipantTypeGlobal === 'customer' &&
    stateSelectedParticipantCustomerInformationGlobal !== undefined
  ) {
    selectedElements.push(
      <CardParticipant
        {...props}
        {...propsTabMap}
        participantType={stateSelectedParticipantTypeGlobal}
        stateCustomerInformation={
          stateSelectedParticipantCustomerInformationGlobal
        }
        stateRideProviderInformation={null}
        stateParticipantId={
          stateSelectedParticipantCustomerInformationGlobal.id
        }
        label="Last selected Participant"
        onDelete={onDelete}
      />
    );
  }
  if (
    stateSelectedParticipantTypeGlobal === 'ride_provider' &&
    stateSelectedParticipantRideProviderInformationGlobal !== undefined
  ) {
    selectedElements.push(
      <CardParticipant
        {...props}
        {...propsTabMap}
        participantType={stateSelectedParticipantTypeGlobal}
        stateCustomerInformation={null}
        stateRideProviderInformation={
          stateSelectedParticipantRideProviderInformationGlobal
        }
        stateParticipantId={
          stateSelectedParticipantRideProviderInformationGlobal.id
        }
        label="Last selected Participant"
        onDelete={onDelete}
      />
    );
  }
  if (stateSelectedParticipantRideRequestInformationGlobal !== undefined) {
    selectedElements.push(
      <CardRideRequest
        {...props}
        {...propsTabMap}
        stateRideRequestInformation={
          stateSelectedParticipantRideRequestInformationGlobal
        }
        label="Connected Ride Request"
      />
    );
  }
  if (
    stateSelectedParticipantTypeGlobal !== 'ride_provider' &&
    stateSelectedParticipantRideProviderInformationGlobal !== undefined
  ) {
    selectedElements.push(
      <CardParticipant
        {...props}
        {...propsTabMap}
        participantType={
          stateSelectedParticipantRideProviderInformationGlobal.type
        }
        stateCustomerInformation={null}
        stateRideProviderInformation={
          stateSelectedParticipantRideProviderInformationGlobal
        }
        stateParticipantId={
          stateSelectedParticipantRideProviderInformationGlobal.id
        }
        label="Driver"
      />
    );
  }
  if (
    stateSelectedParticipantTypeGlobal !== 'customer' &&
    stateSelectedParticipantCustomerInformationGlobal !== undefined
  ) {
    selectedElements.push(
      <CardParticipant
        {...props}
        {...propsTabMap}
        participantType={stateSelectedParticipantCustomerInformationGlobal.type}
        stateCustomerInformation={
          stateSelectedParticipantCustomerInformationGlobal
        }
        stateRideProviderInformation={null}
        stateParticipantId={
          stateSelectedParticipantCustomerInformationGlobal.id
        }
        label="Passenger"
      />
    );
  }
  //<TextInputSpectator {...props} stateOptions={stateOptions} />
  return (
    <TabContainer fullPage={true}>
      <Box
        sx={{
          '& > *': {m: 1},
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          marginTop: '1vh',
        }}
      >
        <SectionChangeSpectator {...props} />
      </Box>
      <Box component="section" className={styles['tab-map']}>
        <Grid container spacing={2} justifyContent="left" alignItems="stretch">
          <Grid
            item
            xs={12}
            sm={12}
            md={selectedElements.length === 0 ? 12 : 6}
            xl={
              selectedElements.length === 0
                ? 12
                : selectedElements.length === 1
                  ? 9
                  : 6
            }
          >
            <Map
              {...props}
              {...propsTabMap}
              startPos={{lat: 48.7784485, long: 9.1800132, zoom: 11}}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={selectedElements.length === 0 ? 0 : 6}
            xl={
              selectedElements.length === 0
                ? 0
                : selectedElements.length === 1
                  ? 3
                  : 6
            }
          >
            <Grid container spacing={2} justifyContent="left">
              {selectedElements.map((a, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={12}
                  xl={selectedElements.length === 1 ? 12 : 6}
                  key={index}
                >
                  <Card>
                    <CardContent>{a}</CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

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

export interface SectionChangeSpectatorProps
  extends GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorSelectedElementsSet {}

export function SectionChangeSpectator({
  stateSpectator,
  setStateSpectator,
}: SectionChangeSpectatorProps) {
  return (
    <>
      <Divider>
        <Chip label="Change Spectator" size="small" />
      </Divider>
      <ButtonGroup
        variant="contained"
        aria-label="Basic button group"
        sx={{
          display: {sm: 'none', xs: 'block'},
        }}
      >
        <GenericButton
          disabled={stateSpectator === 'everything'}
          icon={<SpectatorEverythingIcon />}
          onClick={() => setStateSpectator('everything')}
        >
          Everything
        </GenericButton>
        <GenericButton
          disabled={stateSpectator === 'public'}
          icon={<SpectatorPublicIcon />}
          onClick={() => setStateSpectator('public')}
        >
          Public
        </GenericButton>
      </ButtonGroup>
      <ButtonGroup
        variant="contained"
        aria-label="Basic button group"
        sx={{
          display: {sm: 'none', xs: 'block'},
        }}
      >
        <GenericButton
          disabled={stateSpectator === 'auth'}
          icon={<ServiceAuthenticationIcon />}
          onClick={() => setStateSpectator('auth')}
        >
          AuthService
        </GenericButton>
        <GenericButton
          disabled={stateSpectator === 'match'}
          icon={<ServiceMatchingIcon />}
          onClick={() => setStateSpectator('match')}
        >
          MatchService
        </GenericButton>
      </ButtonGroup>
      <ButtonGroup
        variant="contained"
        aria-label="Basic button group"
        sx={{
          display: {sm: 'block', xs: 'none'},
        }}
      >
        <GenericButton
          disabled={stateSpectator === 'everything'}
          icon={<SpectatorEverythingIcon />}
          onClick={() => setStateSpectator('everything')}
        >
          Everything
        </GenericButton>
        <GenericButton
          disabled={stateSpectator === 'public'}
          icon={<SpectatorPublicIcon />}
          onClick={() => setStateSpectator('public')}
        >
          Public
        </GenericButton>
        <GenericButton
          disabled={stateSpectator === 'auth'}
          icon={<ServiceAuthenticationIcon />}
          onClick={() => setStateSpectator('auth')}
        >
          AuthService
        </GenericButton>
        <GenericButton
          disabled={stateSpectator === 'match'}
          icon={<ServiceMatchingIcon />}
          onClick={() => setStateSpectator('match')}
        >
          MatchService
        </GenericButton>
      </ButtonGroup>
    </>
  );
}
