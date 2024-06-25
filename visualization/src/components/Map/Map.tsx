'use client';

// Package imports
import {memo, useState} from 'react';
import {useIntl} from 'react-intl';
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
import Control from 'react-leaflet-custom-control';
import {FullscreenControl} from 'react-leaflet-fullscreen';
import {Paper} from '@mui/material';
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
  GlobalPropsIntlValues,
  GlobalPropsShowError,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
} from '@misc/props/global';
import type {ReactSetState, ReactState} from '@misc/react';
import type {SettingsMapProps, SettingsUiProps} from '@misc/props/settings';
import type {
  SimulationEndpointGraphInformation,
  SimulationEndpointParticipantCoordinates,
} from '@globals/types/simulation';
import type {Dispatch} from 'react';
import type {PathfinderEndpointGraphInformation} from '@globals/types/pathfinder';

export interface StatPos {
  lat: number;
  long: number;
  zoom: number;
}

export interface MapProps
  extends SettingsMapProps,
    SettingsUiProps,
    GlobalPropsFetch,
    GlobalPropsShowError,
    GlobalPropsIntlValues,
    GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorSelectedElementsSet {}

export interface MapPropsInput extends MapProps {
  stateGraph: ReactState<SimulationEndpointGraphInformation>;
  stateGraphPathfinder: ReactState<PathfinderEndpointGraphInformation>;
  startPos: StatPos;
  stateParticipantCoordinatesList: ReactState<SimulationEndpointParticipantCoordinates>;
  setStatePinnedCustomers: ReactSetState<Array<string>>;
  setStatePinnedRideProviders: ReactSetState<Array<string>>;
  statePinnedCustomers: ReactState<Array<string>>;
  statePinnedRideProviders: ReactState<Array<string>>;
}

export default function Map(props: MapPropsInput) {
  const {
    stateGraph,
    stateGraphPathfinder,
    stateParticipantCoordinatesList,
    startPos,
    stateSettingsGlobalDebug,
    setStatePinnedCustomers,
    setStatePinnedRideProviders,
    statePinnedCustomers,
    statePinnedRideProviders,
  } = props;

  const intl = useIntl();

  const [stateCurrentPosLat, setStateCurrentPosLat] = useState<
    undefined | number
  >(undefined);
  const [stateCurrentPosLong, setStateCurrentPosLong] = useState<
    undefined | number
  >(undefined);

  return (
    <Paper
      sx={{
        height: '100%',
        width: '100%',
      }}
      elevation={2}
    >
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
            name={intl.formatMessage({id: 'getacar.participant.customer.plural'})}
          >
            <LayerGroup>
              {stateParticipantCoordinatesList.customers.map(customer => (
                <ParticipantMarker
                  {...props}
                  key={`customer_marker_${customer.id}`}
                  stateParticipantId={customer.id}
                  stateParticipantLat={customer.lat}
                  stateParticipantLong={customer.long}
                  participantType="customer"
                  isPinned={statePinnedCustomers.includes(customer.id)}
                  onPin={() =>
                    setStatePinnedCustomers([
                      ...statePinnedCustomers.filter(id => id !== customer.id),
                      customer.id,
                    ])
                  }
                  onUnpin={() =>
                    setStatePinnedCustomers(
                      statePinnedCustomers.filter(id => id !== customer.id)
                    )
                  }
                />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay
            checked={true}
            name={intl.formatMessage({id: 'getacar.participant.rideProvider.plural'})}
          >
            <LayerGroup>
              {stateParticipantCoordinatesList.rideProviders.map(
                rideProvider => (
                  <ParticipantMarker
                    {...props}
                    key={`ride_provider_marker_${rideProvider.id}`}
                    stateParticipantId={rideProvider.id}
                    stateParticipantLat={rideProvider.lat}
                    stateParticipantLong={rideProvider.long}
                    participantType="ride_provider"
                    isPinned={statePinnedRideProviders.includes(
                      rideProvider.id
                    )}
                    onPin={() =>
                      setStatePinnedRideProviders([
                        ...statePinnedRideProviders.filter(
                          id => id !== rideProvider.id
                        ),
                        rideProvider.id,
                      ])
                    }
                    onUnpin={() =>
                      setStatePinnedRideProviders(
                        statePinnedRideProviders.filter(
                          id => id !== rideProvider.id
                        )
                      )
                    }
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
    </Paper>
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
