'use client';

// Package imports
import {useState} from 'react';
// > Components
import {Circle, Marker, Polygon, Popup, Tooltip} from 'react-leaflet';
// Local imports
import {participantIconSize} from './LIcons/ParticipantIcons';
// > Components
import {iconCustomer, iconRideProvider} from './LIcons/ParticipantIcons';
import PopupContentParticipant from './PopupContent/PopupContentParticipant';
// > Globals
import {fetchJson} from '@globals/lib/fetch';
import {getH3Polygon} from '@globals/lib/h3';
import {simulationEndpoints} from '@globals/defaults/endpoints';
// Type imports
import type {ReactSetState, ReactState} from '@misc/react';
import type {
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantInformationRideRequest,
  SimulationEndpointParticipantTypes,
} from '@globals/types/simulation';
import type {FetchJsonOptions} from '@globals/lib/fetch';
import type {SimulationEndpointParticipantCoordinatesParticipant} from '@globals/types/simulation';

interface ParticipantMarkerProps {
  /** The participant ID and current coordinates */
  participantCoordinatesState: ReactState<SimulationEndpointParticipantCoordinatesParticipant>;
  /** The participant ID and current coordinates */
  participantType: SimulationEndpointParticipantTypes;
  setStateSpectator: ReactSetState<string>;
  spectatorState: ReactState<string>;
  stateOpenPopupOnHover: ReactState<boolean>;
  stateShowTooltip: ReactState<boolean>;
  stateBaseUrlSimulation: ReactState<string>;
}

/**
 * Marker that represents a participant on the map.
 * On click it opens a popup element which allows further interaction and prints detailed information.
 * The displayed content changes depending on who the current spectator is.
 */
export default function ParticipantMarker({
  participantCoordinatesState,
  spectatorState,
  setStateSpectator,
  participantType,
  stateShowTooltip,
  stateOpenPopupOnHover,
  stateBaseUrlSimulation,
}: ParticipantMarkerProps) {
  const fetchJsonSimulation = async <T,>(
    endpoint: string,
    options?: FetchJsonOptions
  ): Promise<T> =>
    fetchJson<T>(`${stateBaseUrlSimulation}/${endpoint}`, options);
  // React states
  // > Fetch additional participant information
  const [customerInformationState, setCustomerInformationState] =
    useState<null | SimulationEndpointParticipantInformationCustomer>(null);
  const [rideProviderInformationState, setRideProviderInformationState] =
    useState<null | SimulationEndpointParticipantInformationRideProvider>(null);
  const [rideRequestState, setRideRequestState] =
    useState<null | SimulationEndpointParticipantInformationRideRequest>(null);

  const fetchParticipantInformation = () => {
    console.log('fetch', participantType, participantCoordinatesState.id);
    if (participantType === 'customer') {
      fetchJsonSimulation<SimulationEndpointParticipantInformationCustomer>(
        simulationEndpoints.participantInformationCustomer(
          participantCoordinatesState.id
        )
      )
        .then(newCustomerInformation => {
          setCustomerInformationState(newCustomerInformation);
          console.log('Fetched customer', newCustomerInformation);
          if (newCustomerInformation.rideRequest !== undefined) {
            fetchJsonSimulation<SimulationEndpointParticipantInformationRideRequest>(
              simulationEndpoints.participantInformationRideRequest(
                newCustomerInformation.rideRequest
              )
            )
              .then(newRideRequestInformation => {
                setRideRequestState(newRideRequestInformation);
                console.log('Fetched rideRequest', newRideRequestInformation);
              })
              .catch(err => {
                console.error(err);
              });
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
    if (participantType === 'ride_provider') {
      fetchJsonSimulation<SimulationEndpointParticipantInformationRideProvider>(
        simulationEndpoints.participantInformationRideProvider(
          participantCoordinatesState.id
        )
      )
        .then(newRideProviderInformation => {
          setRideProviderInformationState(newRideProviderInformation);
          console.log('Fetched ride provider', newRideProviderInformation);
          if (newRideProviderInformation.rideRequest !== undefined) {
            fetchJsonSimulation<SimulationEndpointParticipantInformationRideRequest>(
              simulationEndpoints.participantInformationRideRequest(
                newRideProviderInformation.rideRequest
              )
            )
              .then(newRideRequestInformation => {
                setRideRequestState(newRideRequestInformation);
              })
              .catch(err => {
                console.error(err);
              });
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  const eventId = 'participant_marker:event:';

  const marker = (
    <Marker
      key={`customer_${participantCoordinatesState.id}`}
      position={[
        participantCoordinatesState.lat,
        participantCoordinatesState.long,
      ]}
      icon={participantType === 'customer' ? iconCustomer : iconRideProvider}
      eventHandlers={{
        click: () => {
          console.log(`${eventId}click`, participantCoordinatesState.id);
          fetchParticipantInformation();
        },
        loading: () => {
          console.log(`${eventId}loading`, participantCoordinatesState.id);
        },
        mouseout: e => {
          console.log(`${eventId}mouseout`, participantCoordinatesState.id);
          //stop();
          if (stateOpenPopupOnHover) {
            setTimeout(() => {
              e.target.closePopup();
            }, 1000);
          }
        },
        mouseover: e => {
          console.log(`${eventId}mouseover`, participantCoordinatesState.id);
          //start(e);
          if (stateOpenPopupOnHover) {
            e.target.openPopup();
            fetchParticipantInformation();
          }
        },
        popupclose: () => {
          console.log(`${eventId}popupclose`, participantCoordinatesState.id);
        },
        popupopen: () => {
          console.log(`${eventId}popupopen`, participantCoordinatesState.id);
        },
      }}
    >
      {stateShowTooltip ? (
        <Tooltip direction="bottom" offset={[0, 0]} opacity={1} permanent>
          {participantType} {participantCoordinatesState.id}
        </Tooltip>
      ) : (
        <></>
      )}
      <Popup
        eventHandlers={{
          click: e => {
            console.log(
              `participant marker popup clicked ${participantType}`,
              participantCoordinatesState,
              e
            );
          },
        }}
        interactive
      >
        <PopupContentParticipant
          participantCoordinatesState={participantCoordinatesState}
          participantType={participantType}
          customerInformationState={customerInformationState}
          rideProviderInformationState={rideProviderInformationState}
          spectatorState={spectatorState}
          setStateSpectator={setStateSpectator}
        />
      </Popup>
    </Marker>
  );
  if (rideRequestState !== null) {
    const rideRequestHighlight = spectatorState === rideRequestState.userId;
    const getPopupReal = (
      title: string,
      id: string,
      locationType: 'pickup' | 'dropoff',
      rideRequest: Readonly<SimulationEndpointParticipantInformationRideRequest>
    ) => (
      <Popup>
        {title} ({id})
        <ul className="scrolling">
          <li key={`ride_request_${id}_${locationType}_real_popup_pickup`}>
            Pickup location: {rideRequest.pickupLocationCoordinates.address}
          </li>
          <li
            key={`ride_request_${rideRequestState.id}_${locationType}_popup_dropoff`}
          >
            Dropoff location: {rideRequest.dropoffLocationCoordinates.address}
          </li>
        </ul>
      </Popup>
    );
    const realLocations = (
      <>
        <Circle
          center={{
            lat: rideRequestState.pickupLocationCoordinates.lat,
            lng: rideRequestState.pickupLocationCoordinates.long,
          }}
          color={rideRequestHighlight ? 'red' : 'blue'}
          fillColor={rideRequestHighlight ? 'red' : 'blue'}
          radius={rideRequestHighlight ? 400 : 50}
          key={`ride_request_${rideRequestState.id}_pickup`}
          eventHandlers={{
            click: e => {
              console.log(
                'click ride request pickup circle',
                rideRequestState,
                e
              );
            },
          }}
        >
          {getPopupReal(
            'Ride request pickup location',
            rideRequestState.id,
            'pickup',
            rideRequestState
          )}
        </Circle>
        <Circle
          center={{
            lat: rideRequestState.dropoffLocationCoordinates.lat,
            lng: rideRequestState.dropoffLocationCoordinates.long,
          }}
          color={rideRequestHighlight ? 'green' : 'blue'}
          fillColor={rideRequestHighlight ? 'green' : 'blue'}
          radius={rideRequestHighlight ? 400 : 50}
          key={`ride_request_${rideRequestState.id}_dropoff`}
          eventHandlers={{
            click: e => {
              console.log(
                'click ride request dropoff circle',
                rideRequestState,
                e
              );
            },
          }}
        >
          {getPopupReal(
            'Ride request dropoff location',
            rideRequestState.id,
            'dropoff',
            rideRequestState
          )}
        </Circle>
      </>
    );
    const getPopupCloaked = (
      title: string,
      id: string,
      locationType: 'pickup' | 'dropoff',
      rideRequest: Readonly<SimulationEndpointParticipantInformationRideRequest>
    ) => (
      <Popup>
        {title} ({id})
        <ul className="scrolling">
          <li key={`ride_request_${id}_${locationType}_cloaked_popup_pickup`}>
            Pickup location: {rideRequest.pickupLocationCoordinates.address}
          </li>
          <li
            key={`ride_request_${rideRequestState.id}_${locationType}_cloaked_popup_dropoff`}
          >
            Dropoff location: {rideRequest.dropoffLocationCoordinates.address}
          </li>
        </ul>
      </Popup>
    );
    const polygons = (
      <>
        <Polygon
          positions={getH3Polygon(rideRequestState.pickupLocation)}
          key={`ride_request_${rideRequestState.id}_pickup_polygon`}
        >
          {getPopupCloaked(
            'Ride request pickup location (cloaked)',
            rideRequestState.id,
            'pickup',
            rideRequestState
          )}
        </Polygon>
        <Polygon
          positions={getH3Polygon(rideRequestState.dropoffLocation)}
          key={`ride_request_${rideRequestState.id}_dropoff_polygon`}
        >
          {getPopupCloaked(
            'Ride request dropoff location (cloaked)',
            rideRequestState.id,
            'dropoff',
            rideRequestState
          )}
        </Polygon>
      </>
    );
    return (
      <>
        <Circle
          center={{
            lat: participantCoordinatesState.lat,
            lng: participantCoordinatesState.long,
          }}
          color={'green'}
          fillColor={'green'}
          radius={participantIconSize / 2}
          key={`participant_position_${participantCoordinatesState.id}`}
        />
        <Marker
          position={[
            participantCoordinatesState.lat,
            participantCoordinatesState.long,
          ]}
        >
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        {polygons}
        {realLocations}
        {marker}
      </>
    );
  }
  return marker;
}
