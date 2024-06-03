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
  Tooltip,
} from 'react-leaflet';
import {Box} from '@mui/material';
import {FullscreenControl} from 'react-leaflet-fullscreen';
// > Styles
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-fullscreen/styles.css';
// Local imports
import '@styles/leaflet.module.css';
import styles from '@styles/Map.module.scss';
// > Components
import ParticipantMarker from '@components/Map/MapObject/ParticipantMarker';
// > Styles
import '@styles/Map.module.scss';
// Type imports
import type {
  GlobalPropsFetch,
  GlobalPropsParticipantSelectedElements,
  GlobalPropsParticipantSelectedElementsSet,
  GlobalPropsShowError,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
} from '@misc/props/global';
import type {
  SimulationEndpointGraphInformation,
  SimulationEndpointParticipantCoordinates,
} from '@globals/types/simulation';
import type {PathfinderEndpointGraphInformation} from '@globals/types/pathfinder';
import type {ReactState} from '@misc/react';
import type {SettingsMapProps} from '@misc/props/settings';

export interface StatPos {
  lat: number;
  long: number;
  zoom: number;
}

export interface MapProps
  extends SettingsMapProps,
    GlobalPropsFetch,
    GlobalPropsShowError,
    GlobalPropsParticipantSelectedElements,
    GlobalPropsParticipantSelectedElementsSet,
    GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorSelectedElementsSet {}

export interface MapPropsInput extends MapProps {
  stateGraph: ReactState<SimulationEndpointGraphInformation>;
  stateGraphPathfinder: ReactState<PathfinderEndpointGraphInformation>;
  startPos: StatPos;
  stateParticipantCoordinatesList: ReactState<SimulationEndpointParticipantCoordinates>;
}

export default function Map(props: MapPropsInput) {
  const {
    stateGraph,
    stateGraphPathfinder,
    stateParticipantCoordinatesList,
    startPos,
    stateSettingsGlobalDebug,
  } = props;

  return (
    <Box sx={{height: {sm: '73vh', xs: '67vh'}, width: 1}}>
      <MapContainer
        center={[startPos.lat, startPos.long]}
        zoom={12}
        maxZoom={18}
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
              {stateParticipantCoordinatesList.customers.map(customer => (
                <ParticipantMarker
                  {...props}
                  key={`customer_marker_${customer.id}`}
                  stateParticipantCoordinates={customer}
                  participantType="customer"
                />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked={true} name="Ride Providers">
            <LayerGroup>
              {stateParticipantCoordinatesList.rideProviders.map(
                rideProvider => (
                  <ParticipantMarker
                    {...props}
                    key={`ride_provider_marker_${rideProvider.id}`}
                    stateParticipantCoordinates={rideProvider}
                    participantType="ride_provider"
                  />
                )
              )}
            </LayerGroup>
          </LayersControl.Overlay>
          {stateSettingsGlobalDebug ? (
            <LayersControl.Overlay checked={false} name="Debug: Dijkstra Graph">
              <LayerGroup>
                {stateGraph.edges.map(a => (
                  <Polyline
                    key={`graph_edge_${a.id}`}
                    positions={a.geometry.map(a => [a.lat, a.long])}
                    color={'cyan'}
                    weight={3}
                    smoothFactor={1}
                  >
                    <Tooltip sticky>edge {a.id} [cyan]</Tooltip>
                  </Polyline>
                ))}
                {stateGraph.vertices.map(a => (
                  <Circle
                    key={`graph_circle_${a.id}`}
                    radius={5}
                    color={'red'}
                    fillColor={'red'}
                    center={[a.lat, a.long]}
                  >
                    <Tooltip>vertex {a.id}</Tooltip>
                  </Circle>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          ) : (
            <></>
          )}
          {stateSettingsGlobalDebug ? (
            <LayersControl.Overlay
              checked={false}
              name="Debug: Dijkstra Graph (geometry)"
            >
              <LayerGroup>
                {stateGraph.geometry.map(a => (
                  <>
                    {a.geometry.length > 0 ? (
                      <Circle
                        radius={2}
                        color={'red'}
                        fillColor={'red'}
                        center={[a.geometry[0].lat, a.geometry[0].long]}
                      />
                    ) : (
                      <></>
                    )}
                    <Polyline
                      key={`graph_geometry_${a.id}`}
                      positions={a.geometry.map(a => [a.lat, a.long])}
                      color={'green'}
                      weight={3}
                      smoothFactor={1}
                    >
                      <Tooltip sticky>geometry {a.id} [green]</Tooltip>
                    </Polyline>
                  </>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          ) : (
            <></>
          )}
          {stateSettingsGlobalDebug ? (
            <LayersControl.Overlay
              checked={false}
              name="Debug: Pathfinder Graph"
            >
              <LayerGroup>
                {stateGraphPathfinder.edges.map((a, index) => (
                  <Polyline
                    key={`graph_pathfinder_edge_${index}`}
                    positions={a.map(a => [a.lat, a.long])}
                    color={'cyan'}
                    weight={3}
                    smoothFactor={1}
                  >
                    <Tooltip>{index}</Tooltip>
                  </Polyline>
                ))}
                {stateGraphPathfinder.vertices.map(a => (
                  <Circle
                    key={`graph_pathfinder_vertice_${a.id}`}
                    radius={5}
                    color={'red'}
                    fillColor={'red'}
                    center={[a.lat, a.long]}
                  >
                    <Tooltip>{a.id}</Tooltip>
                  </Circle>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          ) : (
            <></>
          )}
        </LayersControl>
      </MapContainer>
    </Box>
  );
}
