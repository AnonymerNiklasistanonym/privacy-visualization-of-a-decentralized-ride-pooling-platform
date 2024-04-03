import Head from 'next/head';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Button from '@components/Button';

import MapComponent from '../components/MapComponent';
import DynamicTitle from '../components/DynamicTitle';

import styles from '@styles/Home.module.scss';
import { useEffect, useState } from 'react';

import { signal, effect } from "@preact/signals-react";

//import CustomerIcon from "../assets/icons/directions_walk_FILL0_wght400_GRAD0_opsz24.svg"

const port = 2222;
const baseUrl = `http://localhost:${port}`;
const fetchElement = async (endpoint) => {
  const result = await fetch(`${baseUrl}/json/${endpoint}`).then(data => data.json());
  //console.debug(`requested endpoint '${endpoint}':`, result);
  return result;
}
const buttonSimulation = async (endpoint) => {
  const result = await fetch(`${baseUrl}/simulation/${endpoint}`).then(data => data.text());
  //console.debug(`requested simulation endpoint '${endpoint}':`, result);
}

export default function Home() {
  const getCurrentTime = () => new Date().toLocaleTimeString('de-DE');
  const dateStringSignal = signal(getCurrentTime());
  const spectatorSignal = signal("everything");
  const customersSignal = signal([]);
  const rideProvidersSignal = signal([]);
  const [spectatorState, setStateSpectator] = useState(spectatorSignal.value)
  const [customersState, setStateCustomers] = useState([])
  const [rideProvidersState, setStateRideProviders] = useState([])
  effect(() => {
    // Run this when any signal changes
    //console.log("Signals updated titleDate:", titleDate.value)
    //console.log("Signals updated spectator:", spectator.value)
    //console.log("Signals updated customers:", customers.value)
    //console.log("Signals updated rideProviders:", rideProviders.value)
  })
  useEffect(() => {
    // Run this when any listed state dependency changes
    console.log('Listening to spectator state:', spectatorState);
    spectatorSignal.value = spectatorState;
  }, [spectatorState]);
  useEffect(() => {
    // Run this code client side
    const interval = setInterval(() => {
      //setTime(new Date);
      fetchElement("customers").then((data) => {
        customersSignal.value = data.customers;
        setStateCustomers(data.customers);
      });
      fetchElement("ride_providers").then((data) => {
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
    }
  })
  const switchSpectator = (newSpectator) => {
    setStateSpectator(newSpectator);
  }
  return (
    <Layout>
      <Head>
        <title>Prototype</title>
        <meta name="description" content="Prototype" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
        <Container>
          <DynamicTitle dateStringSignal={dateStringSignal} spectatorSignal={spectatorSignal} spectatorState={spectatorState}/>

          <MapComponent customersSignal={customersSignal} rideProvidersSignal={rideProvidersSignal} customersState={customersState} rideProvidersState={rideProvidersState} startPos={{lat: 48.7784485, long: 9.1800132, zoom: 11}} spectatorSignal={spectatorSignal} spectatorState={spectatorState} setStateSpectator={setStateSpectator}/>
{
/*
          <p className={styles.description}>
            <code className={styles.code}>npx create-next-app -e https://github.com/colbyfayock/next-leaflet-starter</code>
          </p>

          <p className={styles.view}>
            <Button href="https://github.com/colbyfayock/next-leaflet-starter">Vew on GitHub</Button>
          </p>
*/
}
          <p className={styles.view}>
            <Button onClick={() => {buttonSimulation("state").catch(err => console.error(err))}}>State</Button>
            <Button onClick={() => {buttonSimulation("pause").catch(err => console.error(err))}}>Pause</Button>
            <Button onClick={() => {buttonSimulation("run").catch(err => console.error(err))}}>Run</Button>
          </p>
          <p className={styles.view}>
            <Button onClick={() => {switchSpectator("everything")}}>Everything</Button>
            <Button onClick={() => {switchSpectator("public")}}>Public</Button>
            <Button onClick={() => {switchSpectator("auth")}}>AuthService</Button>
            <Button onClick={() => {switchSpectator("match")}}>MatchService</Button>
            <Button onClick={() => {console.error("Not yet implemented")}}>TODO: Specific Actor</Button>
          </p>
        </Container>
      </Section>
    </Layout>
  )
}
