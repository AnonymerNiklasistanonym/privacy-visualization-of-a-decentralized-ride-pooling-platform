'use client';

import {useEffect, useState} from 'react';
// Local imports
import {fetchJsonSimulation, fetchTextSimulation} from '@globals/lib/fetch';
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
  SimulationEndpointGraph,
  SimulationEndpointParticipantCoordinates,
} from '@globals/types/simulation';
import type {SettingsMapPropsStates} from '@misc/settings';
import type {SelectSpectatorOptionStateType} from '@components/Sort/SelectSpectator';

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
    {label: 'everything', type: 'everything'},
    {label: 'public', type: 'public'},
    {label: 'auth', type: 'auth'},
    {label: 'match', type: 'match'},
  ];
  const [selectOptionsState, setSelectOptionsState] = useState(defaultOptions);
  const [participantsState, setParticipantsState] =
    useState<SimulationEndpointParticipantCoordinates>({
      customers: [],
      rideProviders: [],
    });
  const [graphState, setGraphState] = useState<SimulationEndpointGraph>({
    geometry: [],
    vertices: [],
  });

  // React effects
  useEffect(() => {
    // Run this when any listed state dependency changes
    console.log('Spectator changed:', spectatorState);
    setSnackbarOpenState(true);
  }, [spectatorState]);
  useEffect(() => {
    console.log('fetch json/graph');
    fetchJsonSimulation<SimulationEndpointGraph>('json/graph').then(data => {
      setGraphState(data);
    });
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      fetchJsonSimulation<SimulationEndpointParticipantCoordinates>(
        'json/participants'
      ).then(data => {
        setParticipantsState(data);
        setSelectOptionsState([
          ...defaultOptions,
          ...(participantsState.customers.map(a => ({
            label: `${a.id}`,
            type: 'customer',
          })) as SelectSpectatorOptionStateType),
          ...(participantsState.rideProviders.map(a => ({
            label: `${a.id}`,
            type: 'rideProvider',
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
          stateSettingsMapShowTooltips={stateSettingsMapShowTooltips}
          stateSettingsMapOpenPopupOnHover={stateSettingsMapOpenPopupOnHover}
        />

        <p className={styles.view}>
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
        </p>
        <p className={styles.view}>
          <Button
            onClick={() => {
              switchSpectator('everything');
            }}
          >
            Everything
          </Button>
          <Button
            onClick={() => {
              switchSpectator('public');
            }}
          >
            Public
          </Button>
          <Button
            onClick={() => {
              switchSpectator('auth');
            }}
          >
            AuthService
          </Button>
          <Button
            onClick={() => {
              switchSpectator('match');
            }}
          >
            MatchService
          </Button>
        </p>
      </Container>
      <Snackbar
        openState={snackbarOpenState}
        textState={spectatorState}
        setStateOpen={setSnackbarOpenState}
      />
    </>
  );
}
