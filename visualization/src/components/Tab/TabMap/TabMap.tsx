'use client';

// Package imports
import {useEffect, useState} from 'react';
// > Components
import {Box, ButtonGroup, Chip, Divider} from '@mui/material';
// Local imports
import {showErrorBuilder} from '@misc/modals';
// > Components
import Button from '@components/Button';
import Container from '@components/Container';
import Map from '@components/Map';
import TableDebugData from '@components/Table/TableDebugData';
import TextInputSpectator from '@components/TextInput/TextInputSpectator';
// > Globals
import {fetchJson, fetchText} from '@globals/lib/fetch';
import {
  pathfinderEndpoints,
  simulationEndpoints,
} from '@globals/defaults/endpoints';
// Type imports
import type {ReactSetState, ReactState} from '@misc/react';
import type {
  SimulationEndpointGraphInformation,
  SimulationEndpointParticipantCoordinates,
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointRideRequestInformation,
  SimulationEndpointRideRequests,
} from '@globals/types/simulation';
import type {DebugData} from '@components/Table/DebugData';
import type {ErrorModalPropsErrorBuilder} from '@misc/modals';
import type {FetchJsonOptions} from '@globals/lib/fetch';
import type {PathfinderEndpointGraphInformation} from '@globals/types/pathfinder';
import type {SettingsMapPropsStates} from '@misc/settings';
import type {TextInputSpectatorOptionStateType} from '@components/TextInput/TextInputSpectator/TextInputSpectator';

export interface TabMapProps
  extends SettingsMapPropsStates,
    ErrorModalPropsErrorBuilder {
  stateSpectator: ReactState<string>;
  setStateSpectator: ReactSetState<string>;
  stateSelectedParticipant: ReactState<string | undefined>;
  setStateSelectedParticipant: ReactSetState<string | undefined>;
}

export default function TabMap({
  setStateSpectator,
  setStateErrorModalContent,
  setStateErrorModalOpen,
  stateSpectator,
  stateErrorModalContent,
  stateSettingsMapBaseUrlPathfinder,
  stateSettingsMapBaseUrlSimulation,
  stateSettingsMapOpenPopupOnHover,
  stateSettingsMapShowTooltips,
  stateSelectedParticipant,
  setStateSelectedParticipant,
}: TabMapProps) {
  const fetchJsonSimulation = async <T,>(
    endpoint: string,
    options?: FetchJsonOptions
  ): Promise<T> =>
    fetchJson<T>(`${stateSettingsMapBaseUrlSimulation}${endpoint}`, options);
  const fetchTextSimulation = async (endpoint: string): Promise<string> =>
    fetchText(`${stateSettingsMapBaseUrlSimulation}${endpoint}`);
  const fetchJsonPathfinder = async <T,>(
    endpoint: string,
    options?: FetchJsonOptions
  ): Promise<T> =>
    fetchJson<T>(`${stateSettingsMapBaseUrlPathfinder}/${endpoint}`, options);
  const showError = showErrorBuilder({
    setStateErrorModalContent,
    setStateErrorModalOpen,
    stateErrorModalContent,
  });
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
    fetchJsonSimulation<SimulationEndpointGraphInformation>(
      simulationEndpoints.json.graphInformation,
      {showFetch: true, showResponse: true}
    )
      .then(data => setGraphState(data))
      .catch(err => showError('Fetch simulation graph', err));
    fetchJsonPathfinder<PathfinderEndpointGraphInformation>(
      pathfinderEndpoints.graphInformation,
      {showFetch: true, showResponse: true}
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
        simulationEndpoints.json.participantCoordinates
      ),
      fetchJsonSimulation<SimulationEndpointRideRequests>(
        simulationEndpoints.json.rideRequests
      ),
    ])
      .then(([participantCoordinatesData, rideRequestsData]) =>
        Promise.all([
          Promise.all(
            participantCoordinatesData.customers.map(a =>
              fetchJsonSimulation<SimulationEndpointParticipantInformationCustomer>(
                simulationEndpoints.json.participantInformationCustomer(a.id)
              )
            )
          ),
          Promise.all(
            participantCoordinatesData.rideProviders.map(a =>
              fetchJsonSimulation<SimulationEndpointParticipantInformationRideProvider>(
                simulationEndpoints.json.participantInformationRideProvider(
                  a.id
                )
              )
            )
          ),
          Promise.all(
            rideRequestsData.rideRequests.map(a =>
              fetchJsonSimulation<SimulationEndpointRideRequestInformation>(
                simulationEndpoints.json.rideRequestInformation(a)
              )
            )
          ),
        ])
      )
      .then(([customers, rideProviders, rideRequests]) =>
        setStateDebugData({
          customers,
          rideProviders,
          rideRequests,
          smartContracts: [],
        })
      )
      .catch(err => showError('Fetch debug data', err));
  };

  // React effects
  useEffect(() => {
    const interval = setInterval(() => {
      fetchJsonSimulation<SimulationEndpointParticipantCoordinates>(
        simulationEndpoints.json.participantCoordinates
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
          showError('Fetch simulation participant coordinates', err)
        );
    }, 100);
    return () => {
      clearInterval(interval);
    };
  });
  const switchSpectator = (newSpectator: string) => {
    setStateSpectator(newSpectator);
  };
  return (
    <>
      <Container>
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
              onClick={() => {
                fetchTextSimulation(simulationEndpoints.simulation.state)
                  .then(a => alert(`Simulation state: ${a}`))
                  .catch(err => showError('Fetch simulation state', err));
              }}
            >
              State
            </Button>
            <Button
              onClick={() => {
                fetchTextSimulation(simulationEndpoints.simulation.pause).catch(
                  err => showError('Fetch simulation state pause', err)
                );
              }}
            >
              Pause
            </Button>
            <Button
              onClick={() => {
                fetchTextSimulation(simulationEndpoints.simulation.run).catch(
                  err => showError('Fetch simulation state run', err)
                );
              }}
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
            <Chip label="Ride Providers" size="small" variant="outlined" />
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
      </Container>
    </>
  );
}
