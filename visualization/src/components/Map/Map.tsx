'use client';

// Package imports
// > Components
import {
  Circle,
  CircleMarker,
  LayerGroup,
  LayersControl,
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet';
import {memo, useState} from 'react';
import {Box} from '@mui/material';
import Control from 'react-leaflet-custom-control';
import {FullscreenControl} from 'react-leaflet-fullscreen';
import {useIntl} from 'react-intl';
// > Styles
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-fullscreen/styles.css';
// Local imports
import '@styles/leaflet.module.css';
import styles from '@styles/Map.module.scss';
// > Components
import {FindLocationIcon} from '@components/Icons';
import ParticipantMarker from '@components/Map/MapObject/ParticipantMarker';
// > Misc
import {debugComponentUpdate} from '@misc/debug';
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
import type {Dispatch} from 'react';
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

  const intl = useIntl();

  const [stateCurrentPosLat, setStateCurrentPosLat] = useState<
    undefined | number
  >(undefined);
  const [stateCurrentPosLong, setStateCurrentPosLong] = useState<
    undefined | number
  >(undefined);

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
        <FullscreenControl position="bottomright" />
        <ControlFindLocationMemo
          setStateCurrentPosLat={setStateCurrentPosLat}
          setStateCurrentPosLong={setStateCurrentPosLong}
        />
        <LayersControl position="bottomleft">
          <LayersControl.BaseLayer checked name="Map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay
            checked={true}
            name={intl.formatMessage({
              id: 'page.home.tab.map.layer.currentPosition',
            })}
          >
            <LayerGroup>
              {stateCurrentPosLat !== undefined &&
              stateCurrentPosLong !== undefined ? (
                <CircleMarker
                  center={[stateCurrentPosLat, stateCurrentPosLong]}
                  radius={10}
                  color="blue"
                />
              ) : undefined}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay
            checked={true}
            name={intl.formatMessage({id: 'getacar.participant.customers'})}
          >
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
          <LayersControl.Overlay
            checked={true}
            name={intl.formatMessage({id: 'getacar.participant.rideProviders'})}
          >
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
            <LayersControl.Overlay
              checked={false}
              name={intl.formatMessage({
                id: 'page.home.tab.map.layer.debugGraphDijkstra',
              })}
            >
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
              name={intl.formatMessage({
                id: 'page.home.tab.map.layer.debugGraphDijkstraGeometry',
              })}
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
              name={intl.formatMessage({
                id: 'page.home.tab.map.layer.debugGraphDijkstraPathfinder',
              })}
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

export const ControlFindLocationMemo = memo(ControlFindLocation);

export interface ControlFindLocationProps {
  setStateCurrentPosLat: Dispatch<undefined | number>;
  setStateCurrentPosLong: Dispatch<undefined | number>;
}

export function ControlFindLocation({
  setStateCurrentPosLat,
  setStateCurrentPosLong,
}: ControlFindLocationProps) {
  debugComponentUpdate('ControlFindLocation');

  const map = useMap();

  return (
    <Control prepend position="bottomright">
      <div className="leaflet-bar ">
        <a
          onClick={() => {
            map
              .locate({setView: true})
              .on('locationerror', () => {
                alert('Location access has been denied.');
              })
              .on('locationfound', a => {
                setStateCurrentPosLat(a.latlng.lat);
                setStateCurrentPosLong(a.latlng.lng);
              });
          }}
        >
          <FindLocationIcon style={{marginTop: '3px'}} />
        </a>
      </div>
    </Control>
  );
}
