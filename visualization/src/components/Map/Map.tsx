'use client';

import 'react-leaflet-fullscreen/styles.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  Circle,
  Polygon,
  LayerGroup,
  Marker,
  MapContainer,
  Popup,
  TileLayer,
} from 'react-leaflet';
//import {FullscreenControl} from 'react-leaflet-fullscreen';
import {latLngToCell, cellsToMultiPolygon} from 'h3-js';
// Local imports
import {PopupContentActor} from '@components/PopupContent/PopupContentActor';
import './Map.module.scss';
import styles from './Map.module.scss';
// Type imports
import {useEffect, useState, type FC} from 'react';
import type {LatLngExpression} from 'leaflet';

import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import ReactDOMServer from 'react-dom/server';
import type {SimulationEndpointParticipantCoordinates} from '@/types/globals/simulation';

const iconCustomerHTML = ReactDOMServer.renderToString(<DirectionsWalkIcon />);
const iconRideProviderHTML = ReactDOMServer.renderToString(
  <DirectionsCarIcon />
);

const position: LatLngExpression = [51.505, -0.09];

const icon = L.icon({iconUrl: '/icon.svg', iconSize: [32, 32]});

export interface StatPos {
  lat: number;
  long: number;
  zoom: number;
}

export interface MapTestProps {
  participantsState: SimulationEndpointParticipantCoordinates;
  customersState: any[];
  rideProvidersState: any[];
  startPos: StatPos;
  spectatorState: string;
  setStateSpectator: (newState: string) => void;
}

const MapTest: FC<MapTestProps> = ({
  customersState,
  participantsState,
  rideProvidersState,
  startPos,
  spectatorState,
  setStateSpectator,
}) => {
  const iconCustomer = L.divIcon({
    html: iconCustomerHTML,
    className: '',
    iconSize: new L.Point(32, 32),
  });
  //const iconCustomer = L.icon({
  //  iconUrl: '/icons/directions_walk_FILL0_wght400_GRAD0_opsz24.svg',
  //  iconSize: new L.Point(32, 32)
  //});

  const iconRideProvider = L.divIcon({
    html: iconRideProviderHTML,
    className: '',
    iconSize: new L.Point(32, 32),
  });
  //const iconRideProvider = L.icon({
  //  iconUrl: '/icons/directions_car_FILL0_wght400_GRAD0_opsz24.svg',
  //  iconSize: new L.Point(32, 32)
  //});

  //const [map, setMap] = useState<L.Map | null>(null);
  //const mapContainerRef = useRef(null);

  //function FlyToButton() {
  //  return (
  //    <button
  //      onClick={() => {
  //        console.log('Button was clicked', map);
  //        if (map === null) {
  //          console.error('Map is null');
  //          return;
  //        }
  //        map.flyTo([48.864716, 2.349014], 7);
  //      }}
  //    >
  //      Add marker on click
  //    </button>
  //  );
  //}

  //useEffect(() => {
  //  console.log('mapContainerRef changed', mapContainerRef);
  //}, [mapContainerRef]);
  //useEffect(() => {
  //  console.log('map changed', map);
  //}, [map]);

  return (
    <>
      <MapContainer
        //ref={mapContainerRef}
        center={position}
        zoom={13}
        // Allow scroll wheel zooming
        scrollWheelZoom={true}
        className={styles.map}
        //whenReady={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{
            zoomend: function (event) {
              console.log('zoomies end', event);
            },
            zoom: function (event) {
              console.log('zoomies', event);
            },
          }}
        />
        {
          //<FullscreenControl forceSeparateButton={true} title={"WTF"} />
        }
        <LayerGroup
          eventHandlers={{
            zoom: function (event) {
              console.log('zoomies', event);
            },
          }}
        >
          <Marker key="test" position={[startPos.lat, startPos.long]}>
            <Popup>{spectatorState}</Popup>
          </Marker>
          {participantsState.customers.map(customer => {
            const marker = (
              <Marker
                key={`customer_${customer.id}`}
                position={[customer.lat, customer.long]}
                icon={iconCustomer}
              ></Marker>
            );
            return marker;
          })}
          {participantsState.rideProviders.map(rideProvider => {
            const marker = (
              <Marker
                key={`customer_${rideProvider.id}`}
                position={[rideProvider.lat, rideProvider.long]}
                icon={iconRideProvider}
              ></Marker>
            );
            return marker;
          })}
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
                    Ride request of {customer.id} (
                    {customer.rideRequest.address}) {spectatorState} ==={' '}
                    {customer.id} ={' '}
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
        </LayerGroup>
      </MapContainer>
      {
        //<FlyToButton />
      }
    </>
  );
};

export default MapTest;
