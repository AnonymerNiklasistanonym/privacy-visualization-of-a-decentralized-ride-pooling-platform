'use client';

import MapTestDynamic from '@components/Map/MapTestDynamic';

import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Home.module.scss';

import DynamicTitle from './DynamicTitle';

import {useEffect, useState} from 'react';
import type {FC} from 'react';

//import CustomerIcon from "../assets/icons/directions_walk_FILL0_wght400_GRAD0_opsz24.svg"

const port = 2222;
const baseUrl = `http://localhost:${port}`;
const fetchElement = async <T,>(endpoint: string): Promise<T> => {
  const result = await fetch(`${baseUrl}/json/${endpoint}`).then(data =>
    data.json()
  );
  return result;
};
const buttonSimulation = async (endpoint: string) => {
  await fetch(`${baseUrl}/simulation/${endpoint}`).then(data => data.text());
};

const OldMap: FC = () => {
  const getCurrentTime = () => new Date().toLocaleTimeString('de-DE');
  const [dateStringTimeState, setStateDateString] = useState(getCurrentTime());
  const [spectatorState, setStateSpectator] = useState('everything');
  const [customersState, setStateCustomers] = useState<any[]>([]);
  const [rideProvidersState, setStateRideProviders] = useState<any[]>([]);
  useEffect(() => {
    // Run this when any listed state dependency changes
    console.log('Spectator changed:', spectatorState);
  }, [spectatorState]);
  useEffect(() => {
    // Run this code client side
    const interval = setInterval(() => {
      //setTime(new Date);
      fetchElement<{customers: any[]}>('customers').then(data => {
        setStateCustomers(data.customers);
      });
      fetchElement<{rideProviders: any[]}>('ride_providers').then(data => {
        setStateRideProviders(data.rideProviders);
      });
    }, 50);
    const intervalTime = setInterval(() => {
      setStateDateString(getCurrentTime());
    }, 50);
    return () => {
      clearInterval(interval);
      clearInterval(intervalTime);
    };
  });
  const switchSpectator = (newSpectator: string) => {
    setStateSpectator(newSpectator);
  };
  return (
    <>
      <Container>
        <DynamicTitle
          dateStringTimeState={dateStringTimeState}
          spectatorState={spectatorState}
        />

        <MapTestDynamic
          customersState={customersState}
          rideProvidersState={rideProvidersState}
          startPos={{lat: 48.7784485, long: 9.1800132, zoom: 11}}
          spectatorState={spectatorState}
          setStateSpectator={setStateSpectator}
        />

        <p className={styles.view}>
          <Button
            onClick={() => {
              buttonSimulation('state').catch(err => console.error(err));
            }}
          >
            State
          </Button>
          <Button
            onClick={() => {
              buttonSimulation('pause').catch(err => console.error(err));
            }}
          >
            Pause
          </Button>
          <Button
            onClick={() => {
              buttonSimulation('run').catch(err => console.error(err));
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
    </>
  );
};

export default OldMap;
