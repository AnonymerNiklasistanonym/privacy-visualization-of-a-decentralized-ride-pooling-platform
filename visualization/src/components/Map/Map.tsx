'use client';

import 'react-leaflet-fullscreen/styles.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  //Circle,
  //Polygon,
  LayerGroup,
  //Marker,
  MapContainer,
  //Popup,
  TileLayer,
  LayersControl,
} from 'react-leaflet';
import {FullscreenControl} from 'react-leaflet-fullscreen';
//import {latLngToCell, cellsToMultiPolygon} from 'h3-js';
// Local imports
//import {PopupContentActor} from '@components/PopupContent/PopupContentActor';
import './Map.module.scss';
import styles from './Map.module.scss';
import {locations} from '../../globals/defaults/locations';
// Type imports
import type {FC} from 'react';
import type {LatLngExpression} from 'leaflet';
import type {SimulationEndpointParticipantCoordinates} from '@/globals/types/simulation';

import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import ReactDOMServer from 'react-dom/server';
import ParticipantMarker from './ParticipantMarker';
//import {h3Resolution} from '@/globals/defaults/h3';

const iconCustomerHTML = ReactDOMServer.renderToString(<DirectionsWalkIcon />);
const iconRideProviderHTML = ReactDOMServer.renderToString(
  <DirectionsCarIcon />
);

//const defaultStartPos: LatLngExpression = [
//  locations.startPos.lat,
//  locations.startPos.long,
//];

export interface StatPos {
  lat: number;
  long: number;
  zoom: number;
}

export interface MapTestProps {
  participantsState: SimulationEndpointParticipantCoordinates;
  startPos: StatPos;
  spectatorState: string;
  setStateSpectator: (newState: string) => void;
}

const MapTest: FC<MapTestProps> = ({
  participantsState,
  startPos,
  spectatorState,
  setStateSpectator,
}) => {
  //const iconCustomer = L.divIcon({
  //  html: iconCustomerHTML,
  //  className: '',
  //  iconSize: new L.Point(32, 32),
  //});
  //const iconCustomer = L.icon({
  //  iconUrl: '/icons/directions_walk_FILL0_wght400_GRAD0_opsz24.svg',
  //  iconSize: new L.Point(32, 32)
  //});

  //const iconRideProvider = L.divIcon({
  //  html: iconRideProviderHTML,
  //  className: '',
  //  iconSize: new L.Point(32, 32),
  //});
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
        center={[startPos.lat, startPos.long]}
        zoom={12}
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
            popupopen: e => {
              console.log('popupopen tile layer', e);
            },
            popupclose: e => {
              console.log('popupclose tile layer', e);
            },
          }}
        />
        {<FullscreenControl forceSeparateButton={true} title={'WTF'} />}
        <LayersControl position="topright">
          <LayersControl.Overlay checked={true} name="Customers">
            <LayerGroup>
              {participantsState.customers.map(customer => (
                <ParticipantMarker
                  key={`customer_marker_${customer.id}`}
                  participantCoordinatesState={customer}
                  spectatorState={spectatorState}
                  setStateSpectator={setStateSpectator}
                  participantType="customer"
                />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked={true} name="Ride Providers">
            <LayerGroup>
              {participantsState.rideProviders.map(rideProvider => (
                <ParticipantMarker
                  key={`ride_provider_marker_${rideProvider.id}`}
                  participantCoordinatesState={rideProvider}
                  spectatorState={spectatorState}
                  setStateSpectator={setStateSpectator}
                  participantType="ride_provider"
                />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked={false} name="Old">
            <LayerGroup
              eventHandlers={{
                zoom: function (event) {
                  console.log('zoom old layer group', event);
                },
                popupopen: e => {
                  console.log('popupopen old layer group', e);
                },
                popupclose: e => {
                  console.log('popupclose old layer group', e);
                },
              }}
            >
              {/*customersState.map(customer => {
                const marker = (
                  <Marker
                    key={`customer_${customer.id}_old`}
                    position={[
                      customer.currentLocation.lat,
                      customer.currentLocation.long,
                    ]}
                    icon={iconCustomer}
                  >
                    <Popup
                      eventHandlers={{
                        popupopen: e => {
                          console.log('popupopen', customer, e);
                        },
                        popupclose: e => {
                          console.log('popupclose', customer, e);
                        },
                      }}
                    >
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
                      fillColor={
                        spectatorState === customer.id ? 'blue' : 'red'
                      }
                      radius={spectatorState === customer.id ? 400 : 50}
                      key={`customer_${customer.id}_old_ride_request`}
                    >
                      <Popup
                        eventHandlers={{
                          popupopen: e => {
                            console.log('popupopen', customer, e);
                          },
                          popupclose: e => {
                            console.log('popupclose', customer, e);
                          },
                        }}
                      >
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
                    h3Resolution
                  );
                  const polygonData = cellsToMultiPolygon([h3Index])[0][0];
                  //console.debug(JSON.stringify(polygonData.map(a => ({ lat: a[0], long: a[1] }))))
                  const polygon = (
                    <Polygon
                      positions={polygonData}
                      key={`customer_${customer.id}_old_polygon`}
                    />
                  );
                  return (
                    <>
                      {polygon}
                      {circle}
                      {marker}
                    </>
                  );
                }
                return marker;
              })*/}
              {/*rideProvidersState.map(rideProvider => {
                const marker = (
                  <Marker
                    key={`rideProvider_${rideProvider.id}_old`}
                    position={[
                      rideProvider.currentLocation.lat,
                      rideProvider.currentLocation.long,
                    ]}
                    icon={iconRideProvider}
                  >
                    <Popup
                      eventHandlers={{
                        popupopen: e => {
                          console.log('popupopen', rideProvider, e);
                        },
                        popupclose: e => {
                          console.log('popupclose', rideProvider, e);
                        },
                      }}
                    >
                      <PopupContentActor
                        actor={rideProvider}
                        spectatorState={spectatorState}
                        setStateSpectator={setStateSpectator}
                      />
                    </Popup>
                  </Marker>
                );
                return marker;
              })*/}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </>
  );
};

export default MapTest;
