'use client';

// Package imports
// > Components
import {
  Circle,
  LayerGroup,
  LayersControl,
  MapContainer,
  Polyline,
  TileLayer,
} from 'react-leaflet';
// > Styles
import 'leaflet/dist/leaflet.css';
// Local imports
import styles from './Map.module.scss';
// > Components
import ParticipantMarker from './MapObjects/ParticipantMarker';
// > Styles
import './Map.module.scss';
// Type imports
import type {
  SimulationEndpointGraph,
  SimulationEndpointParticipantCoordinates,
} from '@globals/types/simulation';
import type {SettingsPropsStates} from '@misc/settings';
import {Box} from '@mui/material';

export interface StatPos {
  lat: number;
  long: number;
  zoom: number;
}

export interface MapProps extends SettingsPropsStates {
  graphState: SimulationEndpointGraph;
  participantsState: SimulationEndpointParticipantCoordinates;
  startPos: StatPos;
  spectatorState: string;
  setStateSpectator: (newState: string) => void;
}

export default function Map({
  graphState,
  participantsState,
  startPos,
  spectatorState,
  setStateSpectator,
  stateSettingsMapShowTooltips,
  stateSettingsMapOpenPopupOnHover,
}: MapProps) {
  return (
    <Box sx={{width: 1}}>
      <MapContainer
        center={[startPos.lat, startPos.long]}
        zoom={12}
        // Allow scroll wheel zooming
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
                  stateShowTooltip={stateSettingsMapShowTooltips}
                  stateOpenPopupOnHover={stateSettingsMapOpenPopupOnHover}
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
                  stateShowTooltip={stateSettingsMapShowTooltips}
                  stateOpenPopupOnHover={stateSettingsMapOpenPopupOnHover}
                />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked={false} name="Debug: Dijkstra Graph">
            <LayerGroup>
              {graphState.edges.map(edgeCoordinates => (
                <Polyline
                  key={`graph_edge_${edgeCoordinates[0].lat}_${
                    edgeCoordinates[0].long
                  }_${edgeCoordinates[edgeCoordinates.length - 1].lat}_${
                    edgeCoordinates[edgeCoordinates.length - 1].long
                  }`}
                  positions={edgeCoordinates.map(a => [a.lat, a.long])}
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
    </Box>
  );
}
