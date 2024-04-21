'use client';

import {useEffect, useState} from 'react';
// Local imports
import {fetchJsonSimulation, fetchTextSimulation} from '@globals/lib/fetch';
// > Components
import Map from '@components/Map';
import Container from '@components/Container';
import Button from '@components/Button';
import DynamicTitle from './DynamicTitle';
// > Styles
import styles from '@styles/Home.module.scss';
// Type imports
import type {FC} from 'react';
import type {DefaultPropsI18n} from '@globals/types/react';
import type {
  SimulationEndpointGraph,
  SimulationEndpointParticipantCoordinates,
} from '@globals/types/simulation';
import CustomizedSnackbar from '@components/Test/Snackbar';

export type TabMapProps = DefaultPropsI18n<React.ReactNode>;

const TabMap: FC<TabMapProps> = () => {
  // React states
  const [openState, setStateOpen] = useState(false);
  const [spectatorState, setStateSpectator] = useState('everything');
  const [participantsState, setStateParticipants] =
    useState<SimulationEndpointParticipantCoordinates>({
      customers: [],
      rideProviders: [],
    });
  const [graphState, setStateGraph] = useState<SimulationEndpointGraph>({
    edges: [],
    vertices: [],
  });

  // React effects
  useEffect(() => {
    // Run this when any listed state dependency changes
    console.log('Spectator changed:', spectatorState);
    setStateOpen(true);
  }, [spectatorState]);
  useEffect(() => {
    fetchJsonSimulation<SimulationEndpointGraph>('json/graph').then(data => {
      setStateGraph(data);
    });
  });
  useEffect(() => {
    const interval = setInterval(() => {
      fetchJsonSimulation<SimulationEndpointParticipantCoordinates>(
        'json/participants'
      ).then(data => {
        setStateParticipants(data);
      });
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
        <DynamicTitle spectatorState={spectatorState} />

        <Map
          participantsState={participantsState}
          startPos={{lat: 48.7784485, long: 9.1800132, zoom: 11}}
          spectatorState={spectatorState}
          setStateSpectator={setStateSpectator}
          graphState={graphState}
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
      <CustomizedSnackbar
        openState={openState}
        textState={spectatorState}
        setStateOpen={setStateOpen}
      />
    </>
  );
};

export default TabMap;
