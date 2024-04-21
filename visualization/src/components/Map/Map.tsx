'use client';

// Style imports
import './Map.module.scss';
import 'leaflet/dist/leaflet.css';
// Package imports
import {
  Circle,
  LayerGroup,
  LayersControl,
  MapContainer,
  Polyline,
  TileLayer,
} from 'react-leaflet';
import ParticipantMarker from './MapObjects/ParticipantMarker';
// Local imports
import styles from './Map.module.scss';
// Type imports
import type {FC} from 'react';
import type {
  SimulationEndpointGraph,
  SimulationEndpointParticipantCoordinates,
} from '@/globals/types/simulation';

export interface StatPos {
  lat: number;
  long: number;
  zoom: number;
}

export interface MapProps {
  graphState: SimulationEndpointGraph;
  participantsState: SimulationEndpointParticipantCoordinates;
  startPos: StatPos;
  spectatorState: string;
  setStateSpectator: (newState: string) => void;
}

const Map: FC<MapProps> = ({
  graphState,
  participantsState,
  startPos,
  spectatorState,
  setStateSpectator,
}) => {
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
          <LayersControl.Overlay checked={false} name="Debug: Dijkstra Graph">
            <LayerGroup>
              {graphState.edges.map(edgeCoordinates => (
                <Polyline
                  key={`graph_edge_${edgeCoordinates[0].lat}_${edgeCoordinates[0].long}_${edgeCoordinates[1].lat}_${edgeCoordinates[1].long}`}
                  positions={[
                    [edgeCoordinates[0].lat, edgeCoordinates[0].long],
                    [edgeCoordinates[1].lat, edgeCoordinates[1].long],
                  ]}
                  color={'cyan'}
                  weight={3}
                  smoothFactor={1}
                />
              ))}
              {graphState.vertices.map(coordinates => (
                <Circle
                  key={`graph_circle_${coordinates.lat}_${coordinates.long}`}
                  radius={5}
                  color={'red'}
                  fillColor={'red'}
                  center={[coordinates.lat, coordinates.long]}
                />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </>
  );
};

export default Map;
