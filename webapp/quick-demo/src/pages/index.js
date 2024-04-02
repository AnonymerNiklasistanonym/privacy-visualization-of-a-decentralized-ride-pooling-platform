import Head from 'next/head';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Map from '@components/Map';
import Button from '@components/Button';

import styles from '@styles/Home.module.scss';
import { useEffect, useState } from 'react';

const DEFAULT_CENTER = [48.7784485, 9.1800132]

export default function Home() {
  const [time, setTime] = useState(new Date);
  const [customers, setCustomers] = useState([]);
  const [rideProviders, setRideProviders] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date);
      fetchElement("customers").then((data) => {
        setCustomers(data);
      });
      fetchElement("ride_providers").then((data) => {
        setRideProviders(data);
      });
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
  //const iconCustomer = <Icon></Icon>L.icon({
  //  iconUrl: "/icons/directions_walk_FILL0_wght400_GRAD0_opsz24.svg",
  //});
  //const iconRideProvider = L.icon({
  //    iconUrl: "/icons/directions_car_FILL0_wght400_GRAD0_opsz24.svg",
  //});
  const createPopupContent = (obj) => {
      const header = `<h2>${obj.type} (${obj.id})</h2>`;
      const content = [];
      for (const key in obj) {
          if (["id", "type", "currentLocation", "currentArea"].includes(key)) {
            continue;
          }
          if (obj.hasOwnProperty(key)) {
              let value = obj[key];
              if (key === "passengers") {
                value = `<ul class="scrolling">${obj[key].map(a => `<li>${a}</li>`).join("")}</ul>`
              }
              if (key === "rideRequest") {
                value = `<ul class="scrolling"><li>state: ${obj[key]['state']}</li><li>destination: ${obj[key]['address']}</li></ul>`
              }
              if (key === "participantDb") {
                value = `<ul class="scrolling">${obj[key].map(a => `<li>${a.contactDetails.id}<ul>${a.pseudonyms.map(b => `<li>${b}</li>`).join("")}</ul></li>`).join("")}</ul>`
              }
              if (key === "auctionsDb") {
                value = `<ul class="scrolling">${obj[key].map(a => `<li>${JSON.stringify(a)}</li>`).join("")}</ul>`
              }
              content.push(`<p style="font-size: 1em; margin-top: 0.2em; margin-bottom: 0.2em"><strong>${key}</strong>: ${value}</p>`)
          }
      }
      return header + content.join("")
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
          <h1 className={styles.title}>
            Prototype ({time.toISOString()})
          </h1>

          <Map className={styles.homeMap} width="800" height="400" center={DEFAULT_CENTER} zoom={12}>
            {({ TileLayer, Marker, Popup }) => (
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
                {
                //customers.map((customer) => (
                //  <Marker position={[customer.lat, customer.long]} icon={iconCustomer}>
                //    <Popup>{createPopupContent(customer)}</Popup>
                //  </Marker>
                //))
                }
                {
                //rideProviders.map((rideProvider) => (
                //  <Marker position={[rideProvider.lat, rideProvider.long]} icon={iconRideProvider}>
                //    <Popup>{createPopupContent(rideProvider)}</Popup>
                //  </Marker>
                //))
                }
              </>
            )}
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
        </Container>
      </Section>
    </Layout>
  )
}
