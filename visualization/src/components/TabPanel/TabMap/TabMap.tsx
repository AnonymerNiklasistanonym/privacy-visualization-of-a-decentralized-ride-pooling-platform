'use client';

import {useEffect, useState} from 'react';
// Local imports
import {baseUrlSimulation, baseUrlPathfinder} from '@globals/defaults/urls';
import {fetchJson, fetchText} from '@globals/lib/fetch';
import {
  pathfinderEndpoints,
  simulationEndpoints,
} from '@globals/defaults/endpoints';
// > Components
import Map from '@components/Map';
import Container from '@components/Container';
import Button from '@components/Button';
import Snackbar from '@components/Snackbar';
import SelectSpectator from '@components/Sort/SelectSpectator';
// > Styles
import styles from '@styles/Home.module.scss';
// Type imports
import type {
  SimulationEndpointGraphInformation,
  SimulationEndpointParticipantCoordinates,
} from '@globals/types/simulation';
import type {SettingsMapPropsStates} from '@misc/settings';
import type {SelectSpectatorOptionStateType} from '@components/Sort/SelectSpectator';
import type {PathfinderEndpointGraphInformation} from '@globals/types/pathfinder';
import type {FetchJsonOptions} from '@globals/lib/fetch';

export const fetchJsonSimulation = async <T,>(
  endpoint: string,
  options?: FetchJsonOptions
): Promise<T> => fetchJson<T>(`${baseUrlSimulation}/${endpoint}`, options);

export const fetchTextSimulation = async (endpoint: string): Promise<string> =>
  fetchText(`${baseUrlSimulation}/${endpoint}`);

export const fetchJsonPathfinder = async <T,>(
  endpoint: string,
  options?: FetchJsonOptions
): Promise<T> => fetchJson<T>(`${baseUrlPathfinder}/${endpoint}`, options);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TabMapProps extends SettingsMapPropsStates {}

export default function TabMap({
  stateSettingsMapShowTooltips,
  stateSettingsMapOpenPopupOnHover,
}: TabMapProps) {
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
    ).then(data => setGraphState(data));
    fetchJsonPathfinder<PathfinderEndpointGraphInformation>(
      pathfinderEndpoints.graphInformation,
      {showFetch: true, showResponse: true}
    ).then(data => setPathfinderGraphState(data));
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
      ).then(data => {
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
      });
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
        />

        <div className={styles.view}>
          <Button
            onClick={() => {
              fetchTextSimulation('state').catch(err => console.error(err));
            }}
          >
            State
          </Button>
          <Button
            onClick={() => {
              fetchTextSimulation('pause').catch(err => console.error(err));
            }}
          >
            Pause
          </Button>
          <Button
            onClick={() => {
              fetchTextSimulation('run').catch(err => console.error(err));
            }}
          >
            Run
          </Button>
        </div>
        <div className={styles.view}>
          <Button onClick={() => switchSpectator('everything')}>
            Everything
          </Button>
          <Button onClick={() => switchSpectator('public')}>Public</Button>
          <Button onClick={() => switchSpectator('auth')}>AuthService</Button>
          <Button onClick={() => switchSpectator('match')}>MatchService</Button>
        </div>
        <div className={styles.view}>
          <Button onClick={() => fetchGraphs()}>Fetch Graphs</Button>
          <Button onClick={() => fetchGraphs(true)}>Clear Graphs</Button>
        </div>
      </Container>
      <Snackbar
        openState={snackbarOpenState}
        textState={spectatorState}
        setStateOpen={setSnackbarOpenState}
      />
    </>
  );
}
