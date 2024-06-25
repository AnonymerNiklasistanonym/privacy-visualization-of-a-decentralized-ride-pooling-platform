'use client';

// Package imports
import {memo, useEffect, useRef, useState} from 'react';
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
import CardParticipant from '@components/Card/CardParticipant';
import CardRideRequest from '@components/Card/CardRideRequest';
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
import type {SettingsMapProps, SettingsUiProps} from '@misc/props/settings';
import type {
  SimulationEndpointParticipantIdFromPseudonym,
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantTypes,
  SimulationEndpointRideRequestInformation,
} from '@globals/types/simulation';
import type {Marker as LMarker} from 'leaflet';
import type {ReactNode} from 'react';

interface ParticipantMarkerProps
  extends GlobalPropsSpectatorSelectedElementsSet,
    GlobalPropsSpectatorSelectedElements,
    GlobalPropsFetch,
    GlobalPropsShowError,
    SettingsMapProps,
    GlobalPropsIntlValues,
    SettingsUiProps {
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
export function ParticipantMarker(props: ParticipantMarkerProps) {
  const {
    stateParticipantId,
    stateSpectator,
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
      // TODO Add information
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
      // TODO Add information
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
        // TODO Add information
        if (participantType === 'customer') {
          // Get connected ride provider information for global state:
          const rideProviderInformation =
            await fetchJsonSimulation<SimulationEndpointParticipantInformationRideProvider>(
              simulationEndpoints.apiV1.participantInformationRideProvider(
                rideRequestAuctionWinnerId.id
              )
            );
          // TODO Add information
        }
      }
      const rideRequestUserId =
        await fetchJsonSimulation<SimulationEndpointParticipantIdFromPseudonym>(
          simulationEndpoints.apiV1.participantIdFromPseudonym(
            rideRequest.userId
          )
        );
      setStateRideRequestAuctionCustomerId(rideRequestUserId.id);
      if (participantType === 'ride_provider') {
        // Get connected customer information for global state:
        const customerInformation =
          await fetchJsonSimulation<SimulationEndpointParticipantInformationCustomer>(
            simulationEndpoints.apiV1.participantInformationCustomer(
              rideRequestUserId.id
            )
          );
        // TODO Add information
      }
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

  const showRideRequest = stateSpectator === stateParticipantId;
  const showParticipant =
    stateSpectator === stateParticipantId ||
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
      showParticipant={showParticipant}
      showRideRequest={showRideRequest}
      stateCustomerInformation={stateCustomerInformation}
      stateRideProviderInformation={stateRideProviderInformation}
      stateRideRequestInformation={stateRideRequestInformation}
    />
  );
}
interface ParticipantMarkerElementProps extends ParticipantMarkerProps {
  showParticipant: boolean;
  showRideRequest: boolean;
  setStatePopupOpen: ReactSetState<boolean>;
  fetchParticipantInformation: () => Promise<void>;
  stateCustomerInformation: ReactState<SimulationEndpointParticipantInformationCustomer | null>;
  stateRideProviderInformation: ReactState<SimulationEndpointParticipantInformationRideProvider | null>;
  stateRideRequestInformation: ReactState<SimulationEndpointRideRequestInformation | null>;
}

export function ParticipantMarkerElement(props: ParticipantMarkerElementProps) {
  const {
    stateParticipantId,
    stateParticipantLong,
    stateParticipantLat,
    participantType,
    stateSettingsMapShowTooltips,
    showError,
    showParticipant,
    showRideRequest,
    setStatePopupOpen,
    fetchParticipantInformation,
    stateCustomerInformation,
    stateRideProviderInformation,
    stateRideRequestInformation,
    stateSettingsUiMapScroll,
    stateShowSpectator,
    setStateShowSpectator,
    setStateSelectedParticipantId,
    setStateSelectedParticipantType,
    onPin,
    onUnpin,
    isPinned,
  } = props;
  const elementsToRender: Array<ReactNode> = [];

  const map = useMap();
  const markerRef = useRef<LMarker>(null);

  useEffect(() => {
    // In case the spectator of this marker is freshly selected open the popup
    if (stateShowSpectator === stateParticipantId) {
      // Fly to marker
      map.panTo([stateParticipantLat, stateParticipantLong], {
        duration: 2,
      });
      // Open marker popup
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
    setStatePopupOpen,
    stateParticipantLat,
    stateParticipantLong,
    map,
    participantType,
    stateParticipantId,
  ]);

  // Icon that shows the current position of the participant
  elementsToRender.push(
    <Marker
      key={`customer_${stateParticipantId}`}
      ref={markerRef}
      position={[stateParticipantLat, stateParticipantLong]}
      icon={
        // If participant is not relevant use gray icon
        participantType === 'customer'
          ? showParticipant
            ? iconCustomer
            : iconCustomerGray
          : showParticipant
            ? iconRideProvider
            : iconRideProviderGray
      }
      eventHandlers={{
        click: () => {
          // Select this participant
          setStateSelectedParticipantId(stateParticipantId);
          setStateSelectedParticipantType(participantType);
        },
        popupclose: () => setStatePopupOpen(false),
        popupopen: () => {
          // Store that popup is open
          setStatePopupOpen(true);
          // Select this participant
          setStateSelectedParticipantId(stateParticipantId);
          setStateSelectedParticipantType(participantType);
          // Fetch participant information when popup is opened
          fetchParticipantInformation().catch(err =>
            showError('Simulation fetch participant information', err)
          );
        },
      }}
    >
      {stateSettingsMapShowTooltips ? (
        // Show tooltip if enabled
        <Tooltip direction="bottom" offset={[0, 0]} opacity={1} permanent>
          {participantType} {stateParticipantId}
        </Tooltip>
      ) : (
        <></>
      )}
      <Popup className={styles['leaflet-popup-content-wrapper']}>
        <CardParticipant
          {...props}
          stateParticipantId={stateParticipantId}
          scrollHeight={stateSettingsUiMapScroll ? '50vh' : undefined}
          maxWidth={'30vw'}
          pinAction={() => onPin()}
          unpinAction={() => onUnpin()}
          isPinned={isPinned}
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
        label: 'Ride request: Pickup location',
        real: stateRideRequestInformation.pickupLocationCoordinates,
      },
      {
        cloaked: stateRideRequestInformation.dropoffLocation,
        color: 'red',
        label: 'Ride request: Dropoff location',
        real: stateRideRequestInformation.dropoffLocationCoordinates,
      },
    ];
    elementsToRender.push(
      ...locations.map(location => (
        <>
          <Circle
            center={{
              lat: location.real.lat,
              lng: location.real.long,
            }}
            color={rideRequestColor}
            fillColor={location.color}
            radius={50}
          >
            <Tooltip
              content={location.label + ' (real)'}
              permanent={true}
              sticky
            ></Tooltip>
          </Circle>
          <Polygon
            color={rideRequestColor}
            fillColor={location.color}
            positions={getH3Polygon(location.cloaked)}
          >
            <Tooltip content={location.label + ' (cloaked)'}></Tooltip>
            <Popup>
              <CardRideRequest
                {...props}
                stateRideRequestInformation={stateRideRequestInformation}
              />
            </Popup>
          </Polygon>
        </>
      ))
    );
  }

  if (showParticipant) {
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
            key={`route_${name}_${stateParticipantId}`}
            positions={coordinates.map(a => [a.lat, a.long])}
            color={name === 'current' ? 'blue' : 'gray'}
            weight={3}
            smoothFactor={1}
          >
            <Tooltip
              content={name}
              permanent={name === 'current' ? true : undefined}
              sticky
            ></Tooltip>
          </Polyline>
        ) : undefined
      )
    );
  }
  return <>{elementsToRender}</>;
}
