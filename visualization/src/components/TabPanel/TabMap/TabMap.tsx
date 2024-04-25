'use client';

// Package imports
import {useEffect, useState} from 'react';
// > Components
import {Box, ButtonGroup, Chip, Divider} from '@mui/material';
// Local imports
import {showErrorBuilder} from '@misc/modals';
// > Components
import Map from '@components/Map';
import Container from '@components/Container';
import Button from '@components/Button';
import Snackbar from '@components/Snackbar';
import SelectSpectator from '@components/Sort/SelectSpectator';
// > Globals
import {fetchJson, fetchText} from '@globals/lib/fetch';
import {
  pathfinderEndpoints,
  simulationEndpoints,
} from '@globals/defaults/endpoints';
// Type imports
import type {
  SimulationEndpointGraphInformation,
  SimulationEndpointParticipantCoordinates,
} from '@globals/types/simulation';
import type {SettingsMapPropsStates} from '@misc/settings';
import type {SelectSpectatorOptionStateType} from '@components/Sort/SelectSpectator';
import type {PathfinderEndpointGraphInformation} from '@globals/types/pathfinder';
import type {FetchJsonOptions} from '@globals/lib/fetch';
import type {ErrorModalPropsErrorBuilder} from '@misc/modals';

export interface TabMapProps
  extends SettingsMapPropsStates,
    ErrorModalPropsErrorBuilder {}

export default function TabMap({
  stateSettingsMapShowTooltips,
  stateSettingsMapOpenPopupOnHover,
  stateSettingsMapBaseUrlPathfinder,
  stateSettingsMapBaseUrlSimulation,
  stateErrorModalContent,
  setStateErrorModalContent,
  setStateErrorModalOpen,
}: TabMapProps) {
  const fetchJsonSimulation = async <T,>(
    endpoint: string,
    options?: FetchJsonOptions
  ): Promise<T> =>
    fetchJson<T>(`${stateSettingsMapBaseUrlSimulation}/${endpoint}`, options);
  const fetchTextSimulation = async (endpoint: string): Promise<string> =>
    fetchText(`${stateSettingsMapBaseUrlSimulation}/${endpoint}`);
  const fetchJsonPathfinder = async <T,>(
    endpoint: string,
    options?: FetchJsonOptions
  ): Promise<T> =>
    fetchJson<T>(`${stateSettingsMapBaseUrlPathfinder}/${endpoint}`, options);
  const showError = showErrorBuilder({
    setStateErrorModalOpen,
    setStateErrorModalContent,
    stateErrorModalContent,
  });
  // React states
  const [snackbarOpenState, setSnackbarOpenState] = useState(false);
  const [spectatorState, setSpectatorState] = useState('everything');
  const defaultOptions: SelectSpectatorOptionStateType = [
    {
      label: 'everything',
      type: 'everything',
      translationId: 'getacar.spectator.everything',
    },
    {
      label: 'public',
      type: 'public',
      translationId: 'getacar.spectator.public',
    },
    {
      label: 'auth',
      type: 'auth',
      translationId: 'getacar.spectator.service.authentication',
    },
    {
      label: 'match',
      type: 'match',
      translationId: 'getacar.spectator.service.matching',
    },
  ];
  const [selectOptionsState, setSelectOptionsState] = useState(defaultOptions);
  const [participantsState, setParticipantsState] =
    useState<SimulationEndpointParticipantCoordinates>({
      customers: [],
      rideProviders: [],
    });
  const [graphState, setGraphState] =
    useState<SimulationEndpointGraphInformation>({
      geometry: [],
      vertices: [],
    });
  const [graphPathfinderState, setPathfinderGraphState] =
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
      simulationEndpoints.graphInformation,
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

  // React effects
  useEffect(() => {
    // Run this when any listed state dependency changes
    console.log('Spectator changed:', spectatorState);
    setSnackbarOpenState(true);
  }, [spectatorState]);
  //useEffect(() => {
  //  fetchJsonSimulation<SimulationEndpointGraphInformation>(
  //    simulationEndpoints.graphInformation
  //  ).then(data => setGraphState(data));
  //}, []);
  //useEffect(() => {
  //  fetchJsonPathfinder<PathfinderEndpointGraphInformation>(
  //    pathfinderEndpoints.graphInformation,
  //    {showFetch: true, showResponse: true}
  //  ).then(data => setPathfinderGraphState(data));
  //}, []);
  useEffect(() => {
    const interval = setInterval(() => {
      fetchJsonSimulation<SimulationEndpointParticipantCoordinates>(
        simulationEndpoints.participantCoordinates
      )
        .then(data => {
          setParticipantsState(data);
          setSelectOptionsState([
            ...defaultOptions,
            ...(participantsState.customers.map(a => ({
              label: `${a.id}`,
              type: 'customer',
              translationId: 'getacar.spectator.participant.customerid',
            })) as SelectSpectatorOptionStateType),
            ...(participantsState.rideProviders.map(a => ({
              label: `${a.id}`,
              type: 'rideProvider',
              translationId: 'getacar.spectator.participant.rideProviderid',
            })) as SelectSpectatorOptionStateType),
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
    setSpectatorState(newSpectator);
  };
  return (
    <>
      <Container>
        <SelectSpectator
          optionsState={selectOptionsState}
          spectatorState={spectatorState}
          setSpectatorState={setSpectatorState}
        />

        <Map
          participantsState={participantsState}
          startPos={{lat: 48.7784485, long: 9.1800132, zoom: 11}}
          spectatorState={spectatorState}
          setSpectatorState={setSpectatorState}
          graphState={graphState}
          graphPathfinderState={graphPathfinderState}
          stateSettingsMapShowTooltips={stateSettingsMapShowTooltips}
          stateSettingsMapOpenPopupOnHover={stateSettingsMapOpenPopupOnHover}
          stateSettingsMapBaseUrlPathfinder={stateSettingsMapBaseUrlPathfinder}
          stateSettingsMapBaseUrlSimulation={stateSettingsMapBaseUrlSimulation}
        />

        <Box
          sx={{
            marginTop: '1vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& > *': {
              m: 1,
            },
          }}
        >
          <Divider>
            <Chip label="Control Simulation" size="small" />
          </Divider>
          <ButtonGroup variant="contained" aria-label="Basic button group">
            <Button
              onClick={() => {
                fetchTextSimulation('state')
                  .then(a => alert(`Simulation state: ${a}`))
                  .catch(err => showError('Fetch simulation state', err));
              }}
            >
              State
            </Button>
            <Button
              onClick={() => {
                fetchTextSimulation('pause').catch(err =>
                  showError('Fetch simulation state pause', err)
                );
              }}
            >
              Pause
            </Button>
            <Button
              onClick={() => {
                fetchTextSimulation('run').catch(err =>
                  showError('Fetch simulation state run', err)
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
        </Box>
      </Container>
      <Snackbar
        openState={snackbarOpenState}
        textState={spectatorState}
        setStateOpen={setSnackbarOpenState}
      />
    </>
  );
}
