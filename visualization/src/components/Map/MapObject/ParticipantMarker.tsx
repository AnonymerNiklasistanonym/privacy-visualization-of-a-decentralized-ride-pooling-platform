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
import {fetchJson} from '@globals/lib/fetch';
import {getH3Polygon} from '@globals/lib/h3';
import {showErrorBuilder} from '@misc/modals';
import {simulationEndpoints} from '@globals/defaults/endpoints';
// Type imports
import type {
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantTypes,
  SimulationEndpointRideRequestInformation,
} from '@globals/types/simulation';
import type {ErrorModalPropsErrorBuilder} from '@misc/modals';
import type {FetchJsonOptions} from '@globals/lib/fetch';
import type {GlobalStates} from '@misc/globalStates';
import type {ReactState} from '@misc/react';
import type {SimulationEndpointParticipantCoordinatesParticipant} from '@globals/types/simulation';

interface ParticipantMarkerProps
  extends GlobalStates,
    ErrorModalPropsErrorBuilder {
  /** The participant ID and current coordinates */
  stateParticipantCoordinates: ReactState<SimulationEndpointParticipantCoordinatesParticipant>;
  /** The participant ID and current coordinates */
  participantType: SimulationEndpointParticipantTypes;
  stateOpenPopupOnHover: ReactState<boolean>;
  stateShowTooltip: ReactState<boolean>;
  stateBaseUrlSimulation: ReactState<string>;
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
  stateBaseUrlSimulation,
  stateSelectedParticipant,
  setStateSelectedParticipant,
  setStateErrorModalContent,
  setStateErrorModalOpen,
  stateErrorModalContent,
  setStateSelectedRideRequest,
  stateSelectedRideRequest,
}: ParticipantMarkerProps) {
  // Functions: With global state context
  const showError = showErrorBuilder({
    setStateErrorModalContent,
    setStateErrorModalOpen,
    stateErrorModalContent,
  });
  const fetchJsonSimulation = async <T,>(
    endpoint: string,
    options?: FetchJsonOptions
  ): Promise<T> =>
    fetchJson<T>(`${stateBaseUrlSimulation}${endpoint}`, options);

  // React: States
  // > Fetch additional participant information
  const [stateCustomerInformation, setStateCustomerInformation] =
    useState<null | SimulationEndpointParticipantInformationCustomer>(null);
  const [stateRideProviderInformation, setStateRideProviderInformation] =
    useState<null | SimulationEndpointParticipantInformationRideProvider>(null);
  const [stateRideRequest, setStateRideRequest] =
    useState<null | SimulationEndpointRideRequestInformation>(null);
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
      setStateRideRequest(rideRequest);
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
    }, 5 * 1000);
    return () => {
      clearInterval(interval);
    };
  });

  const showRideRequest =
    stateSelectedRideRequest === stateRideRequest?.id ||
    stateSpectator === stateParticipantCoordinates.id;
  const showParticipant =
    stateSelectedParticipant === stateParticipantCoordinates.id ||
    stateSpectator === stateParticipantCoordinates.id ||
    showRideRequest;

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
        <PopupContentParticipant
          stateParticipantCoordinates={stateParticipantCoordinates}
          participantType={participantType}
          stateCustomerInformation={stateCustomerInformation}
          stateRideProviderInformation={stateRideProviderInformation}
          stateSpectator={stateSpectator}
          setStateSpectator={setStateSpectator}
          setStateSelectedParticipant={setStateSelectedParticipant}
          stateSelectedParticipant={stateSelectedParticipant}
          setStateErrorModalContent={setStateErrorModalContent}
          setStateErrorModalOpen={setStateErrorModalOpen}
          stateBaseUrlSimulation={stateBaseUrlSimulation}
          stateErrorModalContent={stateErrorModalContent}
          setStateSelectedRideRequest={setStateSelectedRideRequest}
          stateSelectedRideRequest={stateSelectedRideRequest}
        />
      </Popup>
    </Marker>
  );

  if (stateRideRequest !== null && showRideRequest) {
    // Show ride request information
    const locations = [
      {
        cloaked: stateRideRequest.pickupLocation,
        color: 'green',
        label: 'Ride request: Pickup location',
        real: stateRideRequest.pickupLocationCoordinates,
      },
      {
        cloaked: stateRideRequest.dropoffLocation,
        color: 'red',
        label: 'Ride request: Dropoff location',
        real: stateRideRequest.dropoffLocationCoordinates,
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
            ></Tooltip>
          </Circle>
          <Polygon
            color={rideRequestColor}
            fillColor={location.color}
            positions={getH3Polygon(location.cloaked)}
          >
            <Tooltip
              content={location.label + ' (cloaked)'}
              permanent={true}
            ></Tooltip>
          </Polygon>
        </>
      ))
    );
  }

  if (showParticipant) {
    // Show current routes
    const routes = [
      {
        color: participantType === 'customer' ? 'brown' : 'yellow',
        coordinateList:
          stateCustomerInformation?.currentRoute ??
          stateRideProviderInformation?.currentRoute,
        label: 'Current Route [' + participantType + ']',
      },
      {
        color: participantType === 'customer' ? 'cyan' : 'pink',
        coordinateList:
          stateCustomerInformation?.currentRouteOsmxn ??
          stateRideProviderInformation?.currentRouteOsmxn,
        label: 'Current Route (OSMXN) [' + participantType + ']',
      },
    ];
    elementsToRender.push(
      ...routes.map(route =>
        route.coordinateList ? (
          <Polyline
            key={`route_${route.label}_${stateParticipantCoordinates.id}`}
            positions={route.coordinateList.map(a => [a.lat, a.long])}
            color={'blue'}
            weight={3}
            smoothFactor={1}
          >
            <Tooltip content={route.label} permanent={true}></Tooltip>
          </Polyline>
        ) : (
          <></>
        )
      )
    );
  }
  return (
    <>
      {/*<Circle
        center={{
          lat: stateParticipantCoordinates.lat,
          lng: stateParticipantCoordinates.long,
        }}
        color={'green'}
        fillColor={'green'}
        radius={participantIconSize / 2}
        key={`participant_position_${stateParticipantCoordinates.id}`}
      />
      <Marker
        position={[
          stateParticipantCoordinates.lat,
          stateParticipantCoordinates.long,
        ]}
      >
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>*/}
      {elementsToRender}
    </>
  );
}
