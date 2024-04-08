'use client';

import 'react-leaflet-fullscreen/styles.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  Circle,
  Polygon,
  Marker,
  MapContainer,
  Popup,
  TileLayer,
} from 'react-leaflet';
import {FullscreenControl} from 'react-leaflet-fullscreen';
import {latLngToCell, cellsToMultiPolygon} from 'h3-js';
// Local imports
import {PopupContentActor} from '@components/PopupContent/PopupContentActor';
import './MapTest.module.scss';
import styles from './MapTest.module.scss';
// Type imports
import type {FC} from 'react';
import type {LatLngExpression} from 'leaflet';

const position: LatLngExpression = [51.505, -0.09];

const icon = L.icon({iconUrl: '/icon.svg', iconSize: [32, 32]});

export interface StatPos {
  lat: number;
  long: number;
  zoom: number;
}

export interface MapTestProps {
  customersState: any[];
  rideProvidersState: any[];
  startPos: StatPos;
  spectatorState: string;
  setStateSpectator: (newState: string) => void;
}

const MapTest: FC<MapTestProps> = ({
  customersState,
  rideProvidersState,
  startPos,
  spectatorState,
  setStateSpectator,
}) => {
  const iconCustomer = L.icon({
    iconUrl: '/icons/directions_walk_FILL0_wght400_GRAD0_opsz24.svg',
    iconSize: new L.Point(32, 32),
  });

  const iconRideProvider = L.icon({
    iconUrl: '/icons/directions_car_FILL0_wght400_GRAD0_opsz24.svg',
    iconSize: new L.Point(32, 32),
  });

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
      <Marker key="test" position={[startPos.lat, startPos.long]}>
        <Popup>{spectatorState}</Popup>
      </Marker>
      {customersState.map(customer => {
        const marker = (
          <Marker
            key={`customer_${customer.id}`}
            position={[
              customer.currentLocation.lat,
              customer.currentLocation.long,
            ]}
            icon={iconCustomer}
          >
            <Popup>
              <PopupContentActor
                actor={customer}
                spectatorState={spectatorState}
                setStateSpectator={setStateSpectator}
              />
            </Popup>
          </Marker>
        );
        if (customer.rideRequest) {
          const circle = (
            <Circle
              center={{
                lat: customer.rideRequest.coordinates.lat,
                lng: customer.rideRequest.coordinates.long,
              }}
              color={spectatorState === customer.id ? 'blue' : 'red'}
              fillColor={spectatorState === customer.id ? 'blue' : 'red'}
              radius={spectatorState === customer.id ? 400 : 50}
            >
              <Popup>
                Ride request of {customer.id} ({customer.rideRequest.address}){' '}
                {spectatorState} === {customer.id} ={' '}
                {spectatorState === customer.id ? 'true' : 'false'}
              </Popup>
            </Circle>
          );
          const h3Index = latLngToCell(
            customer.rideRequest.coordinates.lat,
            customer.rideRequest.coordinates.long,
            7
          );
          const polygonData = cellsToMultiPolygon([h3Index])[0][0];
          //console.debug(JSON.stringify(polygonData.map(a => ({ lat: a[0], long: a[1] }))))
          const polygon = <Polygon positions={polygonData} />;
          return (
            <>
              {polygon}
              {circle}
              {marker}
            </>
          );
        }
        return marker;
      })}
      {rideProvidersState.map(rideProvider => {
        const marker = (
          <Marker
            key={`rideProvider_${rideProvider.id}`}
            position={[
              rideProvider.currentLocation.lat,
              rideProvider.currentLocation.long,
            ]}
            icon={iconRideProvider}
          >
            <Popup>
              <PopupContentActor
                actor={rideProvider}
                spectatorState={spectatorState}
                setStateSpectator={setStateSpectator}
              />
            </Popup>
          </Marker>
        );
        return marker;
      })}
      <FullscreenControl />
    </MapContainer>
  );
};

export default MapTest;
