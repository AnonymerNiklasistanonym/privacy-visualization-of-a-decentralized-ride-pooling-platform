'use client';

// Package imports
import {ReactNode, useEffect, useState} from 'react';
// > Components
import {Circle, Marker, Polygon, Polyline, Popup, Tooltip} from 'react-leaflet';
// Local imports
//import {participantIconSize} from './LIcons/ParticipantIcons';
// > Components
import {
  iconCustomer,
  iconCustomerGray,
  iconRideProvider,
  iconRideProviderGray,
} from './LIcons/ParticipantIcons';
import PopupContentParticipant from './PopupContent/PopupContentParticipant';
// > Globals
import {getH3Polygon} from '@globals/lib/h3';
import {simulationEndpoints} from '@globals/defaults/endpoints';
// Type imports
import type {
  GlobalPropsFetch,
  GlobalPropsShowError,
  GlobalPropsUserInput,
  GlobalPropsUserInputSet,
} from '@misc/globalProps';
import type {ReactSetState, ReactState} from '@misc/react';
import type {
  SimulationEndpointParticipantIdFromPseudonym,
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantTypes,
  SimulationEndpointRideRequestInformation,
} from '@globals/types/simulation';
import type {SimulationEndpointParticipantCoordinatesParticipant} from '@globals/types/simulation';

interface ParticipantMarkerProps
  extends GlobalPropsUserInputSet,
    GlobalPropsUserInput,
    GlobalPropsFetch,
    GlobalPropsShowError {
  /** The participant ID and current coordinates */
  stateParticipantCoordinates: ReactState<SimulationEndpointParticipantCoordinatesParticipant>;
  /** The participant ID and current coordinates */
  participantType: SimulationEndpointParticipantTypes;
  stateOpenPopupOnHover: ReactState<boolean>;
  stateShowTooltip: ReactState<boolean>;
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
export default function ParticipantMarker({
  stateParticipantCoordinates,
  stateSpectator,
  setStateSpectator,
  participantType,
  stateShowTooltip,
  stateOpenPopupOnHover,
  stateSelectedParticipant,
  setStateSelectedParticipant,
  showError,
  fetchJsonSimulation,
  setStateSelectedRideRequest,
  stateSelectedRideRequest,
}: ParticipantMarkerProps) {
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
      fetchJsonSimulation={fetchJsonSimulation}
      fetchParticipantInformation={fetchParticipantInformation}
      participantType={participantType}
      setStatePopupOpen={setStatePopupOpen}
      setStateSelectedParticipant={setStateSelectedParticipant}
      setStateSelectedRideRequest={setStateSelectedRideRequest}
      setStateSpectator={setStateSpectator}
      showError={showError}
      showParticipant={showParticipant}
      showRideRequest={showRideRequest}
      stateCustomerInformation={stateCustomerInformation}
      stateOpenPopupOnHover={stateOpenPopupOnHover}
      stateParticipantCoordinates={stateParticipantCoordinates}
      stateRideProviderInformation={stateRideProviderInformation}
      stateRideRequestInformation={stateRideRequestInformation}
      stateSelectedParticipant={stateSelectedParticipant}
      stateSelectedRideRequest={stateSelectedRideRequest}
      stateShowTooltip={stateShowTooltip}
      stateSpectator={stateSpectator}
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
    stateShowTooltip,
    stateOpenPopupOnHover,
    setStateSelectedParticipant,
    showError,
    showParticipant,
    showRideRequest,
    setStatePopupOpen,
    fetchParticipantInformation,
    stateCustomerInformation,
    stateRideProviderInformation,
    stateRideRequestInformation,
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
        click: () =>
          setStateSelectedParticipant(stateParticipantCoordinates.id),
        // Open/Close popup on mouse hover if enabled
        mouseout: e => {
          if (stateOpenPopupOnHover) {
            setTimeout(() => {
              e.target.closePopup();
            }, 1000);
          }
        },
        mouseover: e => {
          if (stateOpenPopupOnHover) {
            e.target.openPopup();
          }
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
      {stateShowTooltip ? (
        // Show tooltip if enabled
        <Tooltip direction="bottom" offset={[0, 0]} opacity={1} permanent>
          {participantType} {stateParticipantCoordinates.id}
        </Tooltip>
      ) : (
        <></>
      )}
      <Popup>
        <PopupContentParticipant {...props} />
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
