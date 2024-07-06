'use client';

// Package imports
import {memo, useCallback, useEffect, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {
  Circle,
  Marker,
  Polygon,
  Polyline,
  Popup,
  Tooltip,
  useMap,
} from 'react-leaflet';
// Local imports
import styles from '@styles/Map.module.scss';
// > Components
import {
  iconCustomer,
  iconCustomerGray,
  iconRideProvider,
  iconRideProviderGray,
} from './LIcons/ParticipantIcons';
import CardRefresh from '@components/Card/CardRefresh';
// > Globals
import {getH3Polygon} from '@globals/lib/h3';
import {simulationEndpoints} from '@globals/defaults/endpoints';
// Type imports
import type {
  GlobalPropsFetch,
  GlobalPropsIntlValues,
  GlobalPropsShowError,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
} from '@misc/props/global';
import type {ReactSetState, ReactState} from '@misc/react';
import type {
  SettingsConnectedElementsProps,
  SettingsMapProps,
  SettingsUiProps,
} from '@misc/props/settings';
import type {
  SimulationEndpointParticipantIdFromPseudonym,
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantTypes,
  SimulationEndpointRideRequestInformation,
} from '@globals/types/simulation';
import type {Marker as LMarker} from 'leaflet';
import type {ReactNode} from 'react';

const LOCATION_REAL_RADIUS = 50;

export interface ParticipantMarkerProps
  extends GlobalPropsSpectatorSelectedElementsSet,
    GlobalPropsSpectatorSelectedElements,
    GlobalPropsFetch,
    GlobalPropsShowError,
    SettingsMapProps,
    GlobalPropsIntlValues,
    SettingsConnectedElementsProps,
    SettingsUiProps {}

export interface ParticipantMarkerPropsInput extends ParticipantMarkerProps {
  /** The participant ID and current coordinates */
  stateParticipantId: string;
  stateParticipantLong: number;
  stateParticipantLat: number;
  /** The participant ID and current coordinates */
  participantType: SimulationEndpointParticipantTypes;
  onPin: () => void;
  onUnpin: () => void;
  isPinned: boolean;
}

// TODO
//const colorActiveCustomer = 'green';
//const colorActiveRideProvider = 'blue';
const rideRequestColor = 'blue';

export default memo(ParticipantMarker);

/**
 * Marker that represents a participant on the map.
 * On click it opens a popup element which allows further interaction and prints detailed information.
 * The displayed content changes depending on who the current spectator is.
 */
export function ParticipantMarker(props: ParticipantMarkerPropsInput) {
  const {
    stateParticipantId,
    stateSpectator,
    stateSelectedSpectator,
    participantType,
    showError,
    fetchJsonSimulation,
  } = props;

  // React: States
  // > Fetch additional participant information
  const [stateCustomerInformation, setStateCustomerInformation] =
    useState<null | SimulationEndpointParticipantInformationCustomer>(null);
  const [stateRideProviderInformation, setStateRideProviderInformation] =
    useState<null | SimulationEndpointParticipantInformationRideProvider>(null);
  const [stateRideRequestInformation, setStateRideRequestInformation] =
    useState<null | SimulationEndpointRideRequestInformation>(null);
  const [
    stateRideRequestAuctionRideProviderId,
    setStateRideRequestAuctionRideProviderId,
  ] = useState<string>('NONE');
  const [
    stateRideRequestAuctionCustomerId,
    setStateRideRequestAuctionCustomerId,
  ] = useState<string>('NONE');
  // > Keep track if popup is open
  const [statePopupOpen, setStatePopupOpen] = useState<boolean>(false);

  // Functions: With local state context
  const fetchParticipantInformation = async () => {
    let rideRequestId: string | undefined = undefined;
    if (participantType === 'customer') {
      const customerInformation =
        await fetchJsonSimulation<SimulationEndpointParticipantInformationCustomer>(
          simulationEndpoints.apiV1.participantInformationCustomer(
            stateParticipantId
          )
        );
      setStateCustomerInformation(customerInformation);
      rideRequestId = customerInformation.rideRequest;
    }
    if (participantType === 'ride_provider') {
      const rideProviderInformation =
        await fetchJsonSimulation<SimulationEndpointParticipantInformationRideProvider>(
          simulationEndpoints.apiV1.participantInformationRideProvider(
            stateParticipantId
          )
        );
      setStateRideProviderInformation(rideProviderInformation);
      rideRequestId = rideProviderInformation.rideRequest;
    }
    if (rideRequestId !== undefined) {
      const rideRequest =
        await fetchJsonSimulation<SimulationEndpointRideRequestInformation>(
          simulationEndpoints.apiV1.rideRequestInformation(rideRequestId)
        );
      setStateRideRequestInformation(rideRequest);
      if (rideRequest.auctionWinner !== null) {
        const rideRequestAuctionWinnerId =
          await fetchJsonSimulation<SimulationEndpointParticipantIdFromPseudonym>(
            simulationEndpoints.apiV1.participantIdFromPseudonym(
              rideRequest.auctionWinner
            )
          );
        setStateRideRequestAuctionRideProviderId(rideRequestAuctionWinnerId.id);
      }
      const rideRequestUserId =
        await fetchJsonSimulation<SimulationEndpointParticipantIdFromPseudonym>(
          simulationEndpoints.apiV1.participantIdFromPseudonym(
            rideRequest.userId
          )
        );
      setStateRideRequestAuctionCustomerId(rideRequestUserId.id);
    }
  };

  // React: Effects
  // > When popup is opened fetch information every few seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (statePopupOpen) {
        fetchParticipantInformation().catch(err =>
          showError('Simulation fetch participant information', err)
        );
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  /** Show ride requests for the currently selected spectator */
  const showRideRequest = stateSelectedSpectator === stateParticipantId;
  /** Highlight participants that are in any way connected to the current/selected spectator */
  const highlightParticipant =
    stateSpectator === stateParticipantId ||
    stateSelectedSpectator === stateParticipantId ||
    showRideRequest ||
    (showRideRequest &&
      stateRideRequestAuctionRideProviderId === stateParticipantId) ||
    (showRideRequest &&
      stateRideRequestAuctionCustomerId === stateParticipantId);

  return (
    <ParticipantMarkerElement
      {...props}
      fetchParticipantInformation={fetchParticipantInformation}
      setStatePopupOpen={setStatePopupOpen}
      statePopupOpen={statePopupOpen}
      highlightParticipant={highlightParticipant}
      showRideRequest={showRideRequest}
      stateCustomerInformation={stateCustomerInformation}
      stateRideProviderInformation={stateRideProviderInformation}
      stateRideRequestInformation={stateRideRequestInformation}
    />
  );
}
interface ParticipantMarkerElementProps extends ParticipantMarkerPropsInput {
  highlightParticipant: boolean;
  showRideRequest: boolean;
  setStatePopupOpen: ReactSetState<boolean>;
  statePopupOpen: ReactState<boolean>;
  fetchParticipantInformation: () => Promise<void>;
  stateCustomerInformation: ReactState<SimulationEndpointParticipantInformationCustomer | null>;
  stateRideProviderInformation: ReactState<SimulationEndpointParticipantInformationRideProvider | null>;
  stateRideRequestInformation: ReactState<SimulationEndpointRideRequestInformation | null>;
}

export function ParticipantMarkerElement(props: ParticipantMarkerElementProps) {
  const {
    fetchParticipantInformation,
    highlightParticipant,
    isPinned,
    onPin,
    onUnpin,
    participantType,
    statePopupOpen,
    setStatePopupOpen,
    setStateSelectedSpectator,
    setStateShowSpectator,
    showError,
    showRideRequest,
    stateCustomerInformation,
    stateParticipantId,
    stateParticipantLat,
    stateParticipantLong,
    stateRideProviderInformation,
    stateRideRequestInformation,
    stateSettingsMapShowTooltips,
    stateShowSpectator,
    stateSpectator,
    stateSelectedSpectator,
  } = props;
  const elementsToRender: Array<ReactNode> = [];

  const intl = useIntl();
  const map = useMap();
  const markerRef = useRef<LMarker>(null);

  // > Keep track if popup for ride request is open
  const [statePopupOpenRideRequest, setStatePopupOpenRideRequest] =
    useState<boolean>(false);

  /** Stop unnecessary refresh jobs of the participant popup card */
  const pauseRefresh = useCallback(() => !statePopupOpen, [statePopupOpen]);

  /** Stop unnecessary refresh jobs of the ride request popup card */
  const pauseRefreshRideRequest = useCallback(
    () => statePopupOpenRideRequest,
    [statePopupOpenRideRequest]
  );

  useEffect(() => {
    // In case the spectator of this marker is freshly selected open the popup
    if (stateShowSpectator === stateParticipantId) {
      // Fly to marker
      map.panTo([stateParticipantLat, stateParticipantLong], {
        duration: 2,
      });
      // Open marker popup (or close it if already open)
      const marker = markerRef.current;
      if (marker) {
        if (marker.isPopupOpen()) {
          marker.closePopup();
        } else {
          marker.openPopup();
        }
      }
      // Reset selected spectator
      setStateShowSpectator(undefined);
    }
  }, [
    stateShowSpectator,
    setStateShowSpectator,
    stateParticipantLat,
    stateParticipantLong,
    map,
    stateParticipantId,
  ]);

  // Icon that shows the current position of the participant
  elementsToRender.push(
    <Marker
      key={`marker-participant-${stateParticipantId}`}
      ref={markerRef}
      position={[stateParticipantLat, stateParticipantLong]}
      icon={
        // If participant is not relevant use gray icon
        participantType === 'customer'
          ? highlightParticipant
            ? iconCustomer
            : iconCustomerGray
          : highlightParticipant
            ? iconRideProvider
            : iconRideProviderGray
      }
      eventHandlers={{
        click: () => {
          // Select this participant
          setStateSelectedSpectator(stateParticipantId);
        },
        popupclose: () => setStatePopupOpen(false),
        popupopen: () => {
          // Store that popup is open
          setStatePopupOpen(true);
          // Select this participant
          setStateSelectedSpectator(stateParticipantId);
          // Fetch participant information when popup is opened
          fetchParticipantInformation().catch(err =>
            showError('Simulation fetch participant information', err)
          );
        },
      }}
    >
      {stateSettingsMapShowTooltips ||
      stateSpectator === stateParticipantId ||
      stateSelectedSpectator === stateParticipantId ? (
        // Show tooltip message for specific cases
        <Tooltip direction="bottom" offset={[0, 15]} opacity={0.8} permanent>
          {[
            stateSpectator === stateParticipantId
              ? intl.formatMessage({id: 'getacar.spectator.current'})
              : undefined,
            stateSelectedSpectator === stateParticipantId
              ? intl.formatMessage({id: 'getacar.spectator.selected'})
              : undefined,
            stateSettingsMapShowTooltips
              ? `${participantType} ${stateParticipantId}`
              : undefined,
          ]
            .filter(a => a !== undefined)
            .join('/')}
        </Tooltip>
      ) : undefined}
      <Popup className={styles['leaflet-popup-content-wrapper']}>
        <CardRefresh
          {...props}
          id={stateParticipantId}
          cardType={participantType}
          pinAction={onPin}
          unpinAction={onUnpin}
          isPinned={isPinned}
          pauseRefresh={pauseRefresh}
        />
      </Popup>
    </Marker>
  );

  if (stateRideRequestInformation !== null && showRideRequest) {
    // Show ride request information
    const locations = [
      {
        cloaked: stateRideRequestInformation.pickupLocation,
        color: 'green',
        label: intl.formatMessage({id: 'getacar.rideRequest.location.pickup'}),
        real: stateRideRequestInformation.pickupLocationCoordinates,
      },
      {
        cloaked: stateRideRequestInformation.dropoffLocation,
        color: 'red',
        label: intl.formatMessage({id: 'getacar.rideRequest.location.dropoff'}),
        real: stateRideRequestInformation.dropoffLocationCoordinates,
      },
    ];
    elementsToRender.push(
      ...locations.map(location => (
        <Polygon
          key={`${location.label}-cloaked-${stateParticipantId}`}
          color={rideRequestColor}
          fillColor={location.color}
          positions={getH3Polygon(location.cloaked)}
        >
          <Tooltip
            content={
              location.label +
              ` (${intl.formatMessage({id: 'location.cloaked'})})`
            }
            sticky
          ></Tooltip>
          <Popup
            eventHandlers={{
              popupclose: () => setStatePopupOpenRideRequest(false),
              popupopen: () => setStatePopupOpenRideRequest(true),
            }}
          >
            <CardRefresh
              {...props}
              id={stateRideRequestInformation.id}
              cardType={'ride_request'}
              pauseRefresh={pauseRefreshRideRequest}
            />
          </Popup>
        </Polygon>
      ))
    );
    elementsToRender.push(
      ...locations.map(location => (
        <Circle
          key={`${location.label}-real-${stateParticipantId}`}
          center={{
            lat: location.real.lat,
            lng: location.real.long,
          }}
          color={rideRequestColor}
          fillColor={location.color}
          radius={LOCATION_REAL_RADIUS}
        >
          <Tooltip
            direction={'left'}
            content={
              location.label + ` (${intl.formatMessage({id: 'location.real'})})`
            }
            offset={[-LOCATION_REAL_RADIUS / 2, 0]}
          ></Tooltip>
        </Circle>
      ))
    );
  }

  if (highlightParticipant) {
    // Show current routes
    elementsToRender.push(
      ...[
        ...(stateCustomerInformation?.currentRoutes !== undefined
          ? Object.entries(stateCustomerInformation.currentRoutes)
          : []),
        ...(stateRideProviderInformation?.currentRoutes !== undefined
          ? Object.entries(stateRideProviderInformation.currentRoutes)
          : []),
      ].map(([name, coordinates]) =>
        coordinates !== null ? (
          <Polyline
            key={`route-${name}-${stateParticipantId}`}
            positions={coordinates.map(a => [a.lat, a.long])}
            color={name === 'current' ? 'blue' : 'gray'}
            weight={3}
            smoothFactor={1}
          >
            <Tooltip content={name} sticky></Tooltip>
          </Polyline>
        ) : undefined
      )
    );
  }
  return <>{elementsToRender}</>;
}
