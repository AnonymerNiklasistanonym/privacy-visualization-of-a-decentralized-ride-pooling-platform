'use client';

import MapTestDynamic from '@components/Map/MapTestDynamic';

import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Home.module.scss';

import DynamicTitle from './DynamicTitle';

import {useEffect, useState} from 'react';
import type {FC} from 'react';

import {signal, effect} from '@preact/signals-react';
import Buttons from '@components/Buttons';

//import CustomerIcon from "../assets/icons/directions_walk_FILL0_wght400_GRAD0_opsz24.svg"

const port = 2222;
const baseUrl = `http://localhost:${port}`;
const fetchElement = async <T,>(endpoint: string): Promise<T> => {
  const result = await fetch(`${baseUrl}/json/${endpoint}`).then(data =>
    data.json()
  );
  //console.debug(`requested endpoint '${endpoint}':`, result);
  return result;
};
const buttonSimulation = async (endpoint: string) => {
  const result = await fetch(`${baseUrl}/simulation/${endpoint}`).then(data =>
    data.text()
  );
  //console.debug(`requested simulation endpoint '${endpoint}':`, result);
};

export interface OldMapProps {
  test: string;
}

const OldMap: FC<OldMapProps> = ({test}) => {
  const getCurrentTime = () => new Date().toLocaleTimeString('de-DE');
  const dateStringSignal = signal(getCurrentTime());
  const spectatorSignal = signal('everything');
  const customersSignal = signal<any[]>([]);
  const rideProvidersSignal = signal<any[]>([]);
  const [spectatorState, setStateSpectator] = useState(spectatorSignal.value);
  const [customersState, setStateCustomers] = useState<any[]>([]);
  const [rideProvidersState, setStateRideProviders] = useState<any[]>([]);
  effect(() => {
    // Run this when any signal changes
    //console.log("Signals updated titleDate:", titleDate.value)
    //console.log("Signals updated spectator:", spectator.value)
    //console.log("Signals updated customers:", customers.value)
    //console.log("Signals updated rideProviders:", rideProviders.value)
  });
  useEffect(() => {
    // Run this when any listed state dependency changes
    console.log('Listening to spectator state:', spectatorState);
    spectatorSignal.value = spectatorState;
  }, [spectatorState, spectatorSignal]);
  useEffect(() => {
    // Run this code client side
    const interval = setInterval(() => {
      //setTime(new Date);
      fetchElement<{customers: any[]}>('customers').then(data => {
        customersSignal.value = data.customers;
        setStateCustomers(data.customers);
      });
      fetchElement<{rideProviders: any[]}>('ride_providers').then(data => {
        rideProvidersSignal.value = data.rideProviders;
        setStateRideProviders(data.rideProviders);
      });
    }, 50);
    const intervalTime = setInterval(() => {
      const currentTime = getCurrentTime();
      if (dateStringSignal.value !== currentTime) {
        dateStringSignal.value = currentTime;
      }
    }, 50);
    return () => {
      clearInterval(interval);
      clearInterval(intervalTime);
    };
  });
  const switchSpectator = (newSpectator: string) => {
    setStateSpectator(newSpectator);
  };
  const serverValue = 'serverValue';
  return (
    <>
      <Container>
        <DynamicTitle
          dateStringSignal={dateStringSignal}
          spectatorSignal={spectatorSignal}
          spectatorState={spectatorState}
        />

        <MapTestDynamic
          test={serverValue}
          customersSignal={customersSignal}
          rideProvidersSignal={rideProvidersSignal}
          customersState={customersState}
          rideProvidersState={rideProvidersState}
          startPos={{lat: 48.7784485, long: 9.1800132, zoom: 11}}
          spectatorSignal={spectatorSignal}
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
          <Button
            onClick={() => {
              console.error('Not yet implemented');
            }}
          >
            TODO: Specific Actor
          </Button>
        </p>

        <Buttons test={serverValue} />
      </Container>
    </>
  );
};

export default OldMap;
