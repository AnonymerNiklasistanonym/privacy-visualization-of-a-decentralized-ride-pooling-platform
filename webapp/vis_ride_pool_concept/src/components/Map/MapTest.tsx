'use client';

import 'react-leaflet-fullscreen/styles.css';
import 'leaflet/dist/leaflet.css';

import './MapTest.module.scss';
import styles from './MapTest.module.scss';

import L from 'leaflet';

import {Marker, MapContainer, Popup, TileLayer} from 'react-leaflet';
import type {LatLngExpression} from 'leaflet';
import {FullscreenControl} from 'react-leaflet-fullscreen';

const position: LatLngExpression = [51.505, -0.09];

const icon = L.icon({iconUrl: '/icon.svg', iconSize: [32, 32]});

export default function MapTest() {
  return (
    <MapContainer
      center={position}
      zoom={13}
      // Allow scroll wheel zooming
      scrollWheelZoom={true}
      className={styles.map}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={icon}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <FullscreenControl />
    </MapContainer>
  );
}
