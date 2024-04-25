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
import {Box} from '@mui/material';
// > Styles
import 'leaflet/dist/leaflet.css';
// Local imports
import styles from '@styles/Map.module.scss';
// > Components
import ParticipantMarker from './MapObjects/ParticipantMarker';
// > Styles
import '@styles/Map.module.scss';
// Type imports
import type {
  SimulationEndpointGraphInformation,
  SimulationEndpointParticipantCoordinates,
} from '@globals/types/simulation';
import type {SettingsMapPropsStates} from '@misc/settings';
import type {PathfinderEndpointGraphInformation} from '@globals/types/pathfinder';

export interface StatPos {
  lat: number;
  long: number;
  zoom: number;
}

export interface MapProps extends SettingsMapPropsStates {
  graphState: SimulationEndpointGraphInformation;
  graphPathfinderState: PathfinderEndpointGraphInformation;
  participantsState: SimulationEndpointParticipantCoordinates;
  startPos: StatPos;
  spectatorState: string;
  setSpectatorState: (newState: string) => void;
}

export default function Map({
  graphState,
  graphPathfinderState,
  participantsState,
  startPos,
  spectatorState,
  setSpectatorState: setStateSpectator,
  stateSettingsMapShowTooltips,
  stateSettingsMapOpenPopupOnHover,
  stateSettingsMapBaseUrlSimulation,
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
                  stateBaseUrlSimulation={stateSettingsMapBaseUrlSimulation}
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
                  stateBaseUrlSimulation={stateSettingsMapBaseUrlSimulation}
                />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked={false} name="Debug: Dijkstra Graph">
            <LayerGroup>
              {graphState.geometry.map(a => (
                <Polyline
                  key={`graph_geometry_${a.id}`}
                  positions={a.geometry.map(a => [a.lat, a.long])}
                  color={'cyan'}
                  weight={3}
                  smoothFactor={1}
                />
              ))}
              {graphState.vertices.map(a => (
                <Circle
                  key={`graph_circle_${a.id}`}
                  radius={5}
                  color={'red'}
                  fillColor={'red'}
                  center={[a.lat, a.long]}
                />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked={false} name="Debug: Pathfinder Graph">
            <LayerGroup>
              {graphPathfinderState.edges.map((a, index) => (
                <Polyline
                  key={`graph_pathfinder_edge_${index}`}
                  positions={a.map(a => [a.lat, a.long])}
                  color={'cyan'}
                  weight={3}
                  smoothFactor={1}
                />
              ))}
              {graphPathfinderState.vertices.map(a => (
                <Circle
                  key={`graph_pathfinder_vertice_${a.id}`}
                  radius={5}
                  color={'red'}
                  fillColor={'red'}
                  center={[a.lat, a.long]}
                />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </Box>
  );
}
