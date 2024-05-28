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
  ServiceAuthenticationIcon,
  ServiceMatchingIcon,
  SpectatorEverythingIcon,
  SpectatorPublicIcon,
} from '@components/Icons';
import CardParticipant from '@components/Card/CardParticipant';
import CardRideRequest from '@components/Card/CardRideRequest';
import GenericButton from '@components/Button/GenericButton';
import Map from '@components/Map';
import TabContainer from '@components/Tab/TabContainer';
import TableDebugData from '@components/Table/TableDebugData';
import TextInputSpectator from '@components/TextInput/TextInputSpectator';
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
  GlobalPropsShowError,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
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
import type {TextInputSpectatorOptionStateType} from '@components/TextInput/TextInputSpectator';

export interface TabMapProps
  extends SettingsMapProps,
    MapProps,
    GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorSelectedElementsSet,
    GlobalPropsParticipantSelectedElements,
    GlobalPropsParticipantSelectedElementsSet,
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
  } = props;

  // React states
  const defaultOptions: TextInputSpectatorOptionStateType = [
    {
      label: 'everything',
      translationId: 'getacar.spectator.everything',
      type: 'everything',
    },
    {
      label: 'public',
      translationId: 'getacar.spectator.public',
      type: 'public',
    },
    {
      label: 'auth',
      translationId: 'getacar.spectator.service.authentication',
      type: 'auth',
    },
    {
      label: 'match',
      translationId: 'getacar.spectator.service.matching',
      type: 'match',
    },
  ];
  const [stateOptions, setStateOptions] = useState(defaultOptions);
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
      .then(([customers, rideProviders, rideRequests, smartContracts]) =>
        setStateDebugData({
          customers,
          rideProviders,
          rideRequests,
          smartContracts,
        })
      )
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
          setStateOptions([
            ...defaultOptions,
            ...(stateParticipantCoordinatesList.customers.map(a => ({
              label: `${a.id}`,
              translationId: 'getacar.spectator.participant.customerid',
              type: 'customer',
            })) as TextInputSpectatorOptionStateType),
            ...(stateParticipantCoordinatesList.rideProviders.map(a => ({
              label: `${a.id}`,
              translationId: 'getacar.spectator.participant.rideProviderid',
              type: 'rideProvider',
            })) as TextInputSpectatorOptionStateType),
          ]);
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
        label="Ride Request of last selected Participant"
      />
    );
  }

  return (
    <TabContainer fullPage={true}>
      <Box component="section" className={styles['tab-map']}>
        <TextInputSpectator {...props} stateOptions={stateOptions} />
        <Grid container spacing={2} justifyContent="left" alignItems="stretch">
          <Grid
            item
            xs={12}
            sm={12}
            md={selectedElements.length === 0 ? 12 : 8}
          >
            <Map
              {...props}
              {...propsTabMap}
              startPos={{lat: 48.7784485, long: 9.1800132, zoom: 11}}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={selectedElements.length === 0 ? 0 : 4}>
            <Grid
              container
              spacing={2}
              justifyContent="space-around"
              alignItems="stretch"
            >
              {selectedElements.map((a, index) => (
                <Grid item xs={12} sm={6} md={12} key={index}>
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
          <SectionChangeSpectator {...props} />

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
      <ButtonGroup variant="contained" aria-label="Basic button group">
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
