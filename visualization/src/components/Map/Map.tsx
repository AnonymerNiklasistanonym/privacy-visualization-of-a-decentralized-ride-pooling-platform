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
import {FullscreenControl} from 'react-leaflet-fullscreen';
// > Styles
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-fullscreen/styles.css';
// Local imports
import styles from '@styles/Map.module.scss';
// > Components
import ParticipantMarker from '@components/Map/MapObject/ParticipantMarker';
// > Styles
import '@styles/Map.module.scss';
// Type imports
import type {GlobalStates, GlobalStatesShowError} from '@misc/globalStates';
import type {
  SimulationEndpointGraphInformation,
  SimulationEndpointParticipantCoordinates,
} from '@globals/types/simulation';
import type {PathfinderEndpointGraphInformation} from '@globals/types/pathfinder';
import type {ReactState} from '@misc/react';
import type {SettingsMapPropsStates} from '@misc/settings';

export interface StatPos {
  lat: number;
  long: number;
  zoom: number;
}

export interface MapProps
  extends SettingsMapPropsStates,
    GlobalStates,
    GlobalStatesShowError {
  stateGraph: ReactState<SimulationEndpointGraphInformation>;
  stateGraphPathfinder: ReactState<PathfinderEndpointGraphInformation>;
  stateParticipants: ReactState<SimulationEndpointParticipantCoordinates>;
  startPos: StatPos;
}

export default function Map({
  stateGraph,
  stateGraphPathfinder,
  stateParticipants,
  startPos,
  stateSpectator,
  setStateSpectator,
  stateSettingsMapShowTooltips,
  stateSettingsMapOpenPopupOnHover,
  stateSettingsMapBaseUrlSimulation,
  stateSelectedParticipant,
  setStateSelectedParticipant,
  setStateSelectedRideRequest,
  stateSelectedRideRequest,
  stateShowError,
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
        <FullscreenControl />
        <LayersControl position="topright">
          <LayersControl.Overlay checked={true} name="Customers">
            <LayerGroup>
              {stateParticipants.customers.map(customer => (
                <ParticipantMarker
                  key={`customer_marker_${customer.id}`}
                  stateParticipantCoordinates={customer}
                  stateSpectator={stateSpectator}
                  setStateSpectator={setStateSpectator}
                  participantType="customer"
                  stateShowTooltip={stateSettingsMapShowTooltips}
                  stateOpenPopupOnHover={stateSettingsMapOpenPopupOnHover}
                  stateBaseUrlSimulation={stateSettingsMapBaseUrlSimulation}
                  stateSelectedParticipant={stateSelectedParticipant}
                  setStateSelectedParticipant={setStateSelectedParticipant}
                  setStateSelectedRideRequest={setStateSelectedRideRequest}
                  stateSelectedRideRequest={stateSelectedRideRequest}
                  stateShowError={stateShowError}
                />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked={true} name="Ride Providers">
            <LayerGroup>
              {stateParticipants.rideProviders.map(rideProvider => (
                <ParticipantMarker
                  key={`ride_provider_marker_${rideProvider.id}`}
                  stateParticipantCoordinates={rideProvider}
                  stateSpectator={stateSpectator}
                  setStateSpectator={setStateSpectator}
                  participantType="ride_provider"
                  stateShowTooltip={stateSettingsMapShowTooltips}
                  stateOpenPopupOnHover={stateSettingsMapOpenPopupOnHover}
                  stateBaseUrlSimulation={stateSettingsMapBaseUrlSimulation}
                  stateSelectedParticipant={stateSelectedParticipant}
                  setStateSelectedParticipant={setStateSelectedParticipant}
                  setStateSelectedRideRequest={setStateSelectedRideRequest}
                  stateSelectedRideRequest={stateSelectedRideRequest}
                  stateShowError={stateShowError}
                />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked={false} name="Debug: Dijkstra Graph">
            <LayerGroup>
              {stateGraph.geometry.map(a => (
                <Polyline
                  key={`graph_geometry_${a.id}`}
                  positions={a.geometry.map(a => [a.lat, a.long])}
                  color={'cyan'}
                  weight={3}
                  smoothFactor={1}
                />
              ))}
              {stateGraph.vertices.map(a => (
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
              {stateGraphPathfinder.edges.map((a, index) => (
                <Polyline
                  key={`graph_pathfinder_edge_${index}`}
                  positions={a.map(a => [a.lat, a.long])}
                  color={'cyan'}
                  weight={3}
                  smoothFactor={1}
                />
              ))}
              {stateGraphPathfinder.vertices.map(a => (
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
