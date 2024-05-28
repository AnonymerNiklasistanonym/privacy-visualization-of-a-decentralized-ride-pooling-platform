'use client';

// Package imports
import {ReactNode, useEffect, useState} from 'react';
// > Components
import {Circle, Marker, Polygon, Polyline, Popup, Tooltip} from 'react-leaflet';
// Local imports
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
  GlobalPropsParticipantSelectedElements,
  GlobalPropsParticipantSelectedElementsSet,
  GlobalPropsShowError,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
} from '@misc/props/global';
import type {ReactSetState, ReactState} from '@misc/react';
import type {
  SimulationEndpointParticipantIdFromPseudonym,
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantTypes,
  SimulationEndpointRideRequestInformation,
} from '@globals/types/simulation';
import type {SettingsMapProps} from '@misc/props/settings';
import type {SimulationEndpointParticipantCoordinatesParticipant} from '@globals/types/simulation';

interface ParticipantMarkerProps
  extends GlobalPropsSpectatorSelectedElementsSet,
    GlobalPropsSpectatorSelectedElements,
    GlobalPropsParticipantSelectedElements,
    GlobalPropsParticipantSelectedElementsSet,
    GlobalPropsFetch,
    GlobalPropsShowError,
    SettingsMapProps {
  /** The participant ID and current coordinates */
  stateParticipantCoordinates: ReactState<SimulationEndpointParticipantCoordinatesParticipant>;
  /** The participant ID and current coordinates */
  participantType: SimulationEndpointParticipantTypes;
}

// TODO
//const colorActiveCustomer = 'green';
//const colorActiveRideProvider = 'blue';
const rideRequestColor = 'blue';

/**
 * Marker that represents a participant on the map.
 * On click it opens a popup element which allows further interaction and prints detailed information.
 * The displayed content changes depending on who the current spectator is.
 */
export default function ParticipantMarker(props: ParticipantMarkerProps) {
  const {
    stateParticipantCoordinates,
    stateSpectator,
    participantType,
    stateSelectedParticipant,
    showError,
    fetchJsonSimulation,
    stateSelectedRideRequest,
    stateSelectedParticipantCustomerInformationGlobal,
    stateSelectedParticipantRideProviderInformationGlobal,
    setStateSelectedParticipantCustomerInformationGlobal,
    setStateSelectedParticipantRideProviderInformationGlobal,
    setStateSelectedParticipantRideRequestInformationGlobal,
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
            stateParticipantCoordinates.id
          )
        );
      setStateCustomerInformation(customerInformation);
      setStateSelectedParticipantCustomerInformationGlobal(customerInformation);
      setStateSelectedParticipantRideRequestInformationGlobal(undefined);
      rideRequestId = customerInformation.rideRequest;
    }
    if (participantType === 'ride_provider') {
      const rideProviderInformation =
        await fetchJsonSimulation<SimulationEndpointParticipantInformationRideProvider>(
          simulationEndpoints.apiV1.participantInformationRideProvider(
            stateParticipantCoordinates.id
          )
        );
      setStateRideProviderInformation(rideProviderInformation);
      setStateSelectedParticipantRideProviderInformationGlobal(
        rideProviderInformation
      );
      setStateSelectedParticipantRideRequestInformationGlobal(undefined);
      rideRequestId = rideProviderInformation.rideRequest;
    }
    if (rideRequestId !== undefined) {
      const rideRequest =
        await fetchJsonSimulation<SimulationEndpointRideRequestInformation>(
          simulationEndpoints.apiV1.rideRequestInformation(rideRequestId)
        );
      setStateRideRequestInformation(rideRequest);
      setStateSelectedParticipantRideRequestInformationGlobal(rideRequest);
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
      if (
        statePopupOpen ||
        stateSelectedParticipantCustomerInformationGlobal?.id ===
          stateParticipantCoordinates.id ||
        stateSelectedParticipantRideProviderInformationGlobal?.id ===
          stateParticipantCoordinates.id
      ) {
        fetchParticipantInformation().catch(err =>
          showError('Simulation fetch participant information', err)
        );
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  const showRideRequest =
    stateSelectedRideRequest === stateRideRequestInformation?.id ||
    stateSpectator === stateParticipantCoordinates.id;
  const showParticipant =
    stateSelectedParticipant === stateParticipantCoordinates.id ||
    stateSpectator === stateParticipantCoordinates.id ||
    showRideRequest ||
    (showRideRequest &&
      stateRideRequestAuctionRideProviderId ===
        stateParticipantCoordinates.id) ||
    (showRideRequest &&
      stateRideRequestAuctionCustomerId === stateParticipantCoordinates.id);

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
    stateParticipantCoordinates,
    participantType,
    stateSettingsMapShowTooltips,
    setStateSelectedParticipant,
    showError,
    showParticipant,
    showRideRequest,
    setStatePopupOpen,
    fetchParticipantInformation,
    stateCustomerInformation,
    stateRideProviderInformation,
    stateRideRequestInformation,
    setStateSelectedParticipantTypeGlobal,
  } = props;

  const elementsToRender: Array<ReactNode> = [];

  // Icon that shows the current position of the participant
  elementsToRender.push(
    <Marker
      key={`customer_${stateParticipantCoordinates.id}`}
      position={[
        stateParticipantCoordinates.lat,
        stateParticipantCoordinates.long,
      ]}
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
          setStateSelectedParticipant(stateParticipantCoordinates.id);
          setStateSelectedParticipantTypeGlobal(participantType);
        },
        popupclose: () => setStatePopupOpen(false),
        popupopen: () => {
          setStatePopupOpen(true);
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
          {participantType} {stateParticipantCoordinates.id}
        </Tooltip>
      ) : (
        <></>
      )}
      <Popup>
        <CardParticipant
          {...props}
          stateParticipantId={stateParticipantCoordinates.id}
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
            key={`route_${name}_${stateParticipantCoordinates.id}`}
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
        ) : (
          <></>
        )
      )
    );
  }
  return <>{elementsToRender}</>;
}
