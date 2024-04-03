import Head from 'next/head';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Map from '@components/Map';
import Button from '@components/Button';

import DynamicTitle from '../components/DynamicTitle';

import styles from '@styles/Home.module.scss';
import { useEffect, useState } from 'react';

import { signal, effect } from "@preact/signals-react";

//import { FullscreenControl } from "react-leaflet-fullscreen";
import "react-leaflet-fullscreen/styles.css";

//import CustomerIcon from "../assets/icons/directions_walk_FILL0_wght400_GRAD0_opsz24.svg"

const DEFAULT_CENTER = [48.7784485, 9.1800132]

export default function Home() {
  const titleDate = signal(() => new Date().toISOString());
  effect(() => {
    setInterval(() => {
      titleDate.value = new Date().toISOString();
    }, 1000);
  })
  const [view, setView] = useState("everything");
  const [time, setTime] = useState(new Date);
  const [customers, setCustomers] = useState([]);
  const [rideProviders, setRideProviders] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date);
      fetchElement("customers").then((data) => {
        setCustomers(data.customers);
      });
      fetchElement("ride_providers").then((data) => {
        setRideProviders(data.rideProviders);
      });
      titleDate.value = new Date().toISOString()
      console.log(titleDate)
    }, 1000);
    return () => { clearInterval(interval); }
  })
  const port = 2222;
  const baseUrl = `http://localhost:${port}`;
  const fetchElement = async (endpoint) => {
    const result = await fetch(`${baseUrl}/json/${endpoint}`).then(data => data.json());
    console.debug(`requested endpoint '${endpoint}':`, result);
    return result;
  }
  const buttonSimulation = async (endpoint) => {
    const result = await fetch(`${baseUrl}/simulation/${endpoint}`).then(data => data.text());
    console.debug(`requested simulation endpoint '${endpoint}':`, result);
  }
  const switchView = (newView) => {
    if (newView !== view) {
      setView(newView);
      console.debug(`change view to '${view}'`);
    }
  }
  //const iconCustomer = L.icon({
  //  iconUrl: "/icons/directions_walk_FILL0_wght400_GRAD0_opsz24.svg",
  //});
  //const iconRideProvider = L.icon({
  //    iconUrl: "/icons/directions_car_FILL0_wght400_GRAD0_opsz24.svg",
  //});
  const createPopupContent = (obj) => {
      const content = [];
      for (const key in obj) {
          if (["id", "type", "currentLocation", "currentArea"].includes(key)) {
            continue;
          }
          /*
          if (obj.hasOwnProperty(key)) {
              let value = obj[key];
              if (key === "passengers") {
                value = <ul className="scrolling">{obj[key].map(a => <li>{a}</li>)}</ul>
              }
              if (key === "rideRequest") {
                value = <ul className="scrolling"><li>state: {obj[key]['state']}</li><li>destination: {obj[key]['address']}</li></ul>
              }
              if (key === "participantDb") {
                value = <ul className="scrolling">{obj[key].map(a => <><li>{a.contactDetails.id}</li><ul>${a.pseudonyms.map(b => <li>{b}</li>)}</ul></>)}</ul>
              }
              if (key === "auctionsDb") {
                value = <ul className="scrolling">{obj[key].map(a => <li>{JSON.stringify(a)}</li>)}</ul>
              }
              content.push(<p style="font-size: 1em; margin-top: 0.2em; margin-bottom: 0.2em"><strong>{key}</strong>: {value}</p>)
          }*/

          if (["rideRequest", "participantDb", "auctionsDb"].includes(key)) {
            continue;
          }
          if (obj.hasOwnProperty(key)) {
            content.push(<p>{key}: {obj[key]}</p>)
        }
      }
      return (<>
        <h2>{obj.type} ({obj.id})</h2>
        <p>fullName: {obj.fullName}</p>
      </>)
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
          <DynamicTitle titleDate={titleDate}/>

          <Map className={styles.homeMap} width="800" height="400" center={DEFAULT_CENTER} zoom={12}>
            {({ TileLayer, Marker, Popup }) => {
                const L = require('leaflet');

                const iconCustomer = L.icon({
                    iconUrl: "/icons/directions_walk_FILL0_wght400_GRAD0_opsz24.svg",
                    shadowUrl: null,
                    shadowSize: null,
                    shadowAnchor: null,
                    iconSize: new L.Point(32, 32),
                });

                const iconRideProvider = L.icon({
                    iconUrl: "/icons/directions_car_FILL0_wght400_GRAD0_opsz24.svg",
                    shadowUrl: null,
                    shadowSize: null,
                    shadowAnchor: null,
                    iconSize: new L.Point(32, 32),
                });

              return (
              <>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <Marker position={DEFAULT_CENTER}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>
                {customers.map((customer) => {
                  return (
                    <Marker key={`customer_${customer.id}`} position={[customer.currentLocation.lat, customer.currentLocation.long]} icon={iconCustomer}>
                      <Popup>{createPopupContent(customer)}</Popup>
                    </Marker>
                  )
                })}
                {rideProviders.map((rideProvider) => {
                  return (
                    <Marker key={`rideProvider_${rideProvider.id}`} position={[rideProvider.currentLocation.lat, rideProvider.currentLocation.long]} icon={iconRideProvider}>
                      <Popup>{createPopupContent(rideProvider)}</Popup>
                    </Marker>
                  )
                })}
                {
                //<FullscreenControl />
                }
              </>
              )
            }
            }
          </Map>
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
            <Button onClick={() => {switchView("everything")}}>Everything</Button>
            <Button onClick={() => {switchView("public")}}>Public</Button>
            <Button onClick={() => {switchView("auth")}}>AuthService</Button>
            <Button onClick={() => {switchView("match")}}>MatchService</Button>
            <Button onClick={() => {console.error("Not yet implemented")}}>TODO: Specific Actor</Button>
          </p>
        </Container>
      </Section>
    </Layout>
  )
}
