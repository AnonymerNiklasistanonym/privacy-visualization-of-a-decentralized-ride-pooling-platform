'use client';

// Package imports
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
} from 'react-leaflet';
import {FullscreenControl} from 'react-leaflet-fullscreen';
import {Paper} from '@mui/material';
// > Styles
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-fullscreen/styles.css';
// Local imports
import '@styles/leaflet.module.css';
import styles from '@styles/Map.module.scss';
// > Components
import MapControlShowYourLocation from './MapControlShowYourLocation';
import MapMarkerParticipant from './MapMarkerParticipant';
// > Misc
import {debugRequestBlock, debugVisibilityChange} from '@misc/debug';
// > Styles
import '@styles/Map.module.scss';
// Type imports
import type {
  Coordinates,
  PathfinderEndpointGraphInformation,
  SimulationEndpointGraphInformation,
  SimulationEndpointParticipantCoordinates,
} from 'lib_globals';
import type {
  GlobalPropsFetchParticipantCoordinates,
  GlobalPropsPinnedParticipants,
  GlobalPropsShowError,
  GlobalPropsSpectatorsSet,
} from '@misc/props/global';
import type {ReactSetState, ReactState} from '@misc/react';
import type {LatLngExpression} from 'leaflet';
import type {MapMarkerParticipantProps} from './MapMarkerParticipant';

export interface StatPos {
  lat: number;
  long: number;
  zoom: number;
}

export interface MapProps
  extends GlobalPropsFetchParticipantCoordinates,
    GlobalPropsShowError,
    GlobalPropsSpectatorsSet,
    GlobalPropsPinnedParticipants,
    MapMarkerParticipantProps {}

export interface MapPropsInput extends MapProps {
  stateGraph: ReactState<SimulationEndpointGraphInformation>;
  stateGraphPathfinder: ReactState<PathfinderEndpointGraphInformation>;
  startPos: StatPos;
  setStateLoadingParticipantCoordinates: ReactSetState<boolean>;
}

export default function Map(props: MapPropsInput) {
  const {
    setStatePinnedCustomers,
    setStatePinnedRideProviders,
    startPos,
    stateGraph,
    stateGraphPathfinder,
    setStateLoadingParticipantCoordinates,
    statePinnedCustomers,
    statePinnedRideProviders,
    stateSettingsGlobalDebug,
    stateSettingsMapUpdateRateInMs,
    fetchJsonSimulation,
    fetchJsonSimulationWait,
    fetchJsonSimulationWaitParticipantCoordinates,
    showError,
    ...rest
  } = props;

  const propsParticipantMarker: MapMarkerParticipantProps = {
    ...rest,
    fetchJsonSimulation,
    fetchJsonSimulationWait,
    showError,
    stateSettingsGlobalDebug,
    stateSettingsMapUpdateRateInMs,
  };

  const intl = useIntl();

  const [stateCurrentPos, setStateCurrentPos] = useState<
    undefined | Coordinates
  >(undefined);

  // > Participant coordinates
  const [stateParticipantCoordinatesList, setStateParticipantCoordinatesList] =
    useState<SimulationEndpointParticipantCoordinates>({
      customers: [],
      rideProviders: [],
    });

  const requestBalancerFetchParticipantCoordinates = useRef(false);
  const fetchParticipantCoordinates = useCallback(
    () =>
      fetchJsonSimulationWaitParticipantCoordinates(
        requestBalancerFetchParticipantCoordinates
      )
        .then(data => {
          if (data === null) {
            return;
          }
          setStateParticipantCoordinatesList(data);
          setStateLoadingParticipantCoordinates(false);
        })
        .catch(err =>
          showError('Error while fetching participant coordinates', err)
        ),
    [
      fetchJsonSimulationWaitParticipantCoordinates,
      setStateLoadingParticipantCoordinates,
      showError,
    ]
  );

  const [stateWindowIsHidden, setStateWindowIsHidden] = useState(false);

  // > Fetch Participant Coordinates
  useEffect(() => {
    // Initial fetch
    fetchParticipantCoordinates();

    // Detect when window is hidden
    const visibilityChangeListener = () => {
      setStateWindowIsHidden(document.hidden);
      debugVisibilityChange(document.hidden, 'Map');
    };
    document.addEventListener('visibilitychange', visibilityChangeListener);

    // Fetch continuously
    const interval = setInterval(() => {
      if (stateWindowIsHidden) {
        debugRequestBlock(
          'Participant coordinates',
          'window not visible',
          'Map'
        );
        return;
      }
      fetchParticipantCoordinates();
    }, stateSettingsMapUpdateRateInMs);

    return () => {
      // On close stop interval and remove window visibility change listener
      clearInterval(interval);
      document.removeEventListener(
        'visibilitychange',
        visibilityChangeListener
      );
    };
  });

  const onPinParticipant = useCallback(
    (participantId?: string) => {
      if (participantId !== undefined) {
        setStatePinnedCustomers([
          ...statePinnedCustomers.filter(id => id !== participantId),
          participantId,
        ]);
      }
    },
    [setStatePinnedCustomers, statePinnedCustomers]
  );

  const onUnpinParticipant = useCallback(
    (participantId?: string) => {
      if (participantId !== undefined) {
        setStatePinnedCustomers(
          statePinnedCustomers.filter(id => id !== participantId)
        );
      }
    },
    [setStatePinnedCustomers, statePinnedCustomers]
  );

  const onPinRideRequest = useCallback(
    (participantId?: string) => {
      if (participantId !== undefined) {
        setStatePinnedRideProviders([
          ...statePinnedRideProviders.filter(id => id !== participantId),
          participantId,
        ]);
      }
    },
    [setStatePinnedRideProviders, statePinnedRideProviders]
  );

  const onUnpinRideRequest = useCallback(
    (participantId?: string) => {
      if (participantId !== undefined) {
        setStatePinnedRideProviders(
          statePinnedRideProviders.filter(id => id !== participantId)
        );
      }
    },
    [setStatePinnedRideProviders, statePinnedRideProviders]
  );

  const showYourLocation = useMemo<undefined | LatLngExpression>(() => {
    if (
      stateCurrentPos?.lat === undefined ||
      stateCurrentPos?.long === undefined
    ) {
      return undefined;
    }
    return [stateCurrentPos.lat, stateCurrentPos.long];
  }, [stateCurrentPos?.lat, stateCurrentPos?.long]);

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
        <MapControlShowYourLocation setStateCurrentPos={setStateCurrentPos} />
        <LayersControl position="bottomleft">
          <LayersControl.BaseLayer
            checked
            name={intl.formatMessage({
              id: 'page.home.tab.map.title',
            })}
          >
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
              {showYourLocation !== undefined ? (
                <CircleMarker
                  center={showYourLocation}
                  radius={10}
                  color="blue"
                />
              ) : undefined}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay
            checked={true}
            name={intl.formatMessage({
              id: 'getacar.participant.customer.plural',
            })}
          >
            <LayerGroup>
              {stateParticipantCoordinatesList.customers.map(customer => (
                <MapMarkerParticipant
                  {...propsParticipantMarker}
                  key={`customer_marker_${customer.id}`}
                  stateParticipantId={customer.id}
                  stateParticipantLat={customer.lat}
                  stateParticipantLong={customer.long}
                  participantType="customer"
                  isPinned={statePinnedCustomers.includes(customer.id)}
                  onPin={onPinParticipant}
                  onUnpin={onUnpinParticipant}
                />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay
            checked={true}
            name={intl.formatMessage({
              id: 'getacar.participant.rideProvider.plural',
            })}
          >
            <LayerGroup>
              {stateParticipantCoordinatesList.rideProviders.map(
                rideProvider => (
                  <MapMarkerParticipant
                    {...propsParticipantMarker}
                    key={`ride_provider_marker_${rideProvider.id}`}
                    stateParticipantId={rideProvider.id}
                    stateParticipantLat={rideProvider.lat}
                    stateParticipantLong={rideProvider.long}
                    participantType="ride_provider"
                    isPinned={statePinnedRideProviders.includes(
                      rideProvider.id
                    )}
                    onPin={onPinRideRequest}
                    onUnpin={onUnpinRideRequest}
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
                    key={`graph_edge_${a.id}_${JSON.stringify(a.geometry)}`}
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
                    key={`graph_pathfinder_vertex_${a.id}`}
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
