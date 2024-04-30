'use client';

// Package imports
import {useEffect, useState} from 'react';
// > Components
import {Box, ButtonGroup, Chip, Divider} from '@mui/material';
// Local imports
import {fetchJsonEndpoint, fetchTextEndpoint} from '@misc/fetch';
// > Components
import Button from '@components/Button';
import Map from '@components/Map';
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
import type {GlobalStates, GlobalStatesShowError} from '@misc/globalStates';
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
import type {PathfinderEndpointGraphInformation} from '@globals/types/pathfinder';
import type {SettingsMapPropsStates} from '@misc/settings';
import type {TextInputSpectatorOptionStateType} from '@components/TextInput/TextInputSpectator/TextInputSpectator';

export interface TabMapProps
  extends SettingsMapPropsStates,
    GlobalStatesShowError,
    GlobalStates {}

export default function TabMap({
  setStateSpectator,
  stateSpectator,
  stateShowError,
  stateSettingsMapBaseUrlPathfinder,
  stateSettingsMapBaseUrlSimulation,
  stateSettingsMapOpenPopupOnHover,
  stateSettingsMapShowTooltips,
  stateSelectedParticipant,
  setStateSelectedParticipant,
  stateSettingsMapUpdateRateInMs,
  stateSelectedRideRequest,
  setStateSelectedRideRequest,
}: TabMapProps) {
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
  const [stateSelectOptions, setSelectOptionsState] = useState(defaultOptions);
  const [stateDebugData, setStateDebugData] = useState<DebugData>({
    customers: [],
    rideProviders: [],
    rideRequests: [],
    smartContracts: [],
  });
  const [stateParticipants, setParticipantsState] =
    useState<SimulationEndpointParticipantCoordinates>({
      customers: [],
      rideProviders: [],
    });
  const [stateGraph, setGraphState] =
    useState<SimulationEndpointGraphInformation>({
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
        geometry: [],
        vertices: [],
      });
      setPathfinderGraphState({
        edges: [],
        vertices: [],
      });
      return;
    }
    fetchJsonEndpoint<SimulationEndpointGraphInformation>(
      stateSettingsMapBaseUrlSimulation,
      simulationEndpoints.apiV1.graphInformation,
      {showFetch: true, showResponse: true}
    )
      .then(data => setGraphState(data))
      .catch(err => stateShowError('Fetch simulation graph', err));
    fetchJsonEndpoint<PathfinderEndpointGraphInformation>(
      stateSettingsMapBaseUrlPathfinder,
      pathfinderEndpoints.graphInformation,
      {showFetch: true, showResponse: true}
    )
      .then(data => setPathfinderGraphState(data))
      .catch(err => stateShowError('Fetch pathfinder graph', err));
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
      fetchJsonEndpoint<SimulationEndpointParticipantCoordinates>(
        stateSettingsMapBaseUrlSimulation,
        simulationEndpoints.apiV1.participantCoordinates
      ),
      fetchJsonEndpoint<SimulationEndpointRideRequests>(
        stateSettingsMapBaseUrlSimulation,
        simulationEndpoints.apiV1.rideRequests
      ),
      fetchJsonEndpoint<SimulationEndpointSmartContracts>(
        stateSettingsMapBaseUrlSimulation,
        simulationEndpoints.apiV1.smartContracts
      ),
    ])
      .then(
        ([participantCoordinatesData, rideRequestsData, smartContractsData]) =>
          Promise.all([
            Promise.all(
              participantCoordinatesData.customers.map(a =>
                fetchJsonEndpoint<SimulationEndpointParticipantInformationCustomer>(
                  stateSettingsMapBaseUrlSimulation,
                  simulationEndpoints.apiV1.participantInformationCustomer(a.id)
                )
              )
            ),
            Promise.all(
              participantCoordinatesData.rideProviders.map(a =>
                fetchJsonEndpoint<SimulationEndpointParticipantInformationRideProvider>(
                  stateSettingsMapBaseUrlSimulation,
                  simulationEndpoints.apiV1.participantInformationRideProvider(
                    a.id
                  )
                )
              )
            ),
            Promise.all(
              rideRequestsData.rideRequests.map(a =>
                fetchJsonEndpoint<SimulationEndpointRideRequestInformation>(
                  stateSettingsMapBaseUrlSimulation,
                  simulationEndpoints.apiV1.rideRequestInformation(a)
                )
              )
            ),
            Promise.all(
              smartContractsData.smartContracts.map(a =>
                fetchJsonEndpoint<SimulationEndpointSmartContractInformation>(
                  stateSettingsMapBaseUrlSimulation,
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
      .catch(err => stateShowError('Fetch debug data', err));
  };

  // React: Effects
  useEffect(() => {
    const interval = setInterval(() => {
      fetchJsonEndpoint<SimulationEndpointParticipantCoordinates>(
        stateSettingsMapBaseUrlSimulation,
        simulationEndpoints.apiV1.participantCoordinates
      )
        .then(data => {
          setParticipantsState(data);
          setSelectOptionsState([
            ...defaultOptions,
            ...(stateParticipants.customers.map(a => ({
              label: `${a.id}`,
              translationId: 'getacar.spectator.participant.customerid',
              type: 'customer',
            })) as TextInputSpectatorOptionStateType),
            ...(stateParticipants.rideProviders.map(a => ({
              label: `${a.id}`,
              translationId: 'getacar.spectator.participant.rideProviderid',
              type: 'rideProvider',
            })) as TextInputSpectatorOptionStateType),
          ]);
        })
        .catch(err =>
          stateShowError('Fetch simulation participant coordinates', err)
        );
    }, stateSettingsMapUpdateRateInMs);
    return () => {
      clearInterval(interval);
    };
  });
  const switchSpectator = (newSpectator: string) => {
    setStateSpectator(newSpectator);
  };
  return (
    <Box display="flex" justifyContent="center">
      <Box component="section" className={styles['tab-map']}>
        <TextInputSpectator
          stateOptions={stateSelectOptions}
          stateSpectator={stateSpectator}
          setStateSpectator={setStateSpectator}
        />

        <Map
          stateParticipants={stateParticipants}
          startPos={{lat: 48.7784485, long: 9.1800132, zoom: 11}}
          stateSpectator={stateSpectator}
          setStateSpectator={setStateSpectator}
          stateSelectedParticipant={stateSelectedParticipant}
          setStateSelectedParticipant={setStateSelectedParticipant}
          stateGraph={stateGraph}
          stateGraphPathfinder={stateGraphPathfinder}
          stateSettingsMapShowTooltips={stateSettingsMapShowTooltips}
          stateSettingsMapOpenPopupOnHover={stateSettingsMapOpenPopupOnHover}
          stateSettingsMapBaseUrlPathfinder={stateSettingsMapBaseUrlPathfinder}
          stateSettingsMapBaseUrlSimulation={stateSettingsMapBaseUrlSimulation}
          stateSettingsMapUpdateRateInMs={stateSettingsMapUpdateRateInMs}
          stateSelectedRideRequest={stateSelectedRideRequest}
          setStateSelectedRideRequest={setStateSelectedRideRequest}
          stateShowError={stateShowError}
        />

        <Box
          sx={{
            '& > *': {m: 1},
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            marginTop: '1vh',
          }}
        >
          <Divider>
            <Chip label="Control Simulation" size="small" />
          </Divider>
          <ButtonGroup variant="contained" aria-label="Basic button group">
            <Button
              onClick={() =>
                fetchTextEndpoint(
                  stateSettingsMapBaseUrlSimulation,
                  simulationEndpoints.simulation.state
                )
                  .then(a => alert(`Simulation state: ${a}`))
                  .catch(err => stateShowError('Fetch simulation state', err))
              }
            >
              State
            </Button>
            <Button
              onClick={() =>
                fetchTextEndpoint(
                  stateSettingsMapBaseUrlSimulation,
                  simulationEndpoints.simulation.pause
                ).catch(err =>
                  stateShowError('Fetch simulation state pause', err)
                )
              }
            >
              Pause
            </Button>
            <Button
              onClick={() =>
                fetchTextEndpoint(
                  stateSettingsMapBaseUrlSimulation,
                  simulationEndpoints.simulation.run
                ).catch(err =>
                  stateShowError('Fetch simulation state run', err)
                )
              }
            >
              Run
            </Button>
          </ButtonGroup>

          <Divider>
            <Chip label="Change Spectator" size="small" />
          </Divider>
          <ButtonGroup variant="contained" aria-label="Basic button group">
            <Button onClick={() => switchSpectator('everything')}>
              Everything
            </Button>
            <Button onClick={() => switchSpectator('public')}>Public</Button>
            <Button onClick={() => switchSpectator('auth')}>AuthService</Button>
            <Button onClick={() => switchSpectator('match')}>
              MatchService
            </Button>
          </ButtonGroup>
          <Divider>
            <Chip label="Debug Graphs/Pathfinder" size="small" />
          </Divider>
          <ButtonGroup variant="contained" aria-label="Basic button group">
            <Button onClick={() => fetchGraphs()}>Fetch Graphs</Button>
            <Button onClick={() => fetchGraphs(true)}>Clear Graphs</Button>
          </ButtonGroup>
          <Divider>
            <Chip label="Debug Data" size="small" />
          </Divider>
          <ButtonGroup variant="contained" aria-label="Basic button group">
            <Button onClick={() => fetchDebugData()}>Fetch Debug Data</Button>
            <Button onClick={() => fetchDebugData(true)}>
              Clear Debug Data
            </Button>
          </ButtonGroup>
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
        </Box>
      </Box>
    </Box>
  );
}
