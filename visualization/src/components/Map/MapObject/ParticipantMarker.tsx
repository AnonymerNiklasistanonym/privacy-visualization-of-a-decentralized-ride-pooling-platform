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
  SimulationEndpointParticipantTypes,
  SimulationEndpointRideRequestInformation,
} from '@globals/types/simulation';
import type {FetchJsonOptions} from '@globals/lib/fetch';
import type {SimulationEndpointParticipantCoordinatesParticipant} from '@globals/types/simulation';

interface ParticipantMarkerProps {
  /** The participant ID and current coordinates */
  stateParticipantCoordinates: ReactState<SimulationEndpointParticipantCoordinatesParticipant>;
  /** The participant ID and current coordinates */
  participantType: SimulationEndpointParticipantTypes;
  setStateSpectator: ReactSetState<string>;
  stateSpectator: ReactState<string>;
  stateOpenPopupOnHover: ReactState<boolean>;
  stateShowTooltip: ReactState<boolean>;
  stateBaseUrlSimulation: ReactState<string>;
  stateSelectedParticipant: ReactState<string | undefined>;
  setStateSelectedParticipant: ReactSetState<string | undefined>;
}

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
}: ParticipantMarkerProps) {
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

  const fetchParticipantInformation = () => {
    console.log('fetch', participantType, stateParticipantCoordinates.id);
    if (participantType === 'customer') {
      fetchJsonSimulation<SimulationEndpointParticipantInformationCustomer>(
        simulationEndpoints.json.participantInformationCustomer(
          stateParticipantCoordinates.id
        )
      )
        .then(newCustomerInformation => {
          setStateCustomerInformation(newCustomerInformation);
          console.log('Fetched customer', newCustomerInformation);
          if (newCustomerInformation.rideRequest !== undefined) {
            fetchJsonSimulation<SimulationEndpointRideRequestInformation>(
              simulationEndpoints.json.rideRequestInformation(
                newCustomerInformation.rideRequest
              )
            )
              .then(newRideRequestInformation => {
                setStateRideRequest(newRideRequestInformation);
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
        simulationEndpoints.json.participantInformationRideProvider(
          stateParticipantCoordinates.id
        )
      )
        .then(newRideProviderInformation => {
          setStateRideProviderInformation(newRideProviderInformation);
          console.log('Fetched ride provider', newRideProviderInformation);
          if (newRideProviderInformation.rideRequest !== undefined) {
            fetchJsonSimulation<SimulationEndpointRideRequestInformation>(
              simulationEndpoints.json.rideRequestInformation(
                newRideProviderInformation.rideRequest
              )
            )
              .then(newRideRequestInformation => {
                setStateRideRequest(newRideRequestInformation);
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
      key={`customer_${stateParticipantCoordinates.id}`}
      position={[
        stateParticipantCoordinates.lat,
        stateParticipantCoordinates.long,
      ]}
      icon={participantType === 'customer' ? iconCustomer : iconRideProvider}
      eventHandlers={{
        click: () => {
          console.log(`${eventId}click`, stateParticipantCoordinates.id);
          setStateSelectedParticipant(stateParticipantCoordinates.id);
          fetchParticipantInformation();
        },
        loading: () => {
          console.log(`${eventId}loading`, stateParticipantCoordinates.id);
        },
        mouseout: e => {
          console.log(`${eventId}mouseout`, stateParticipantCoordinates.id);
          //stop();
          if (stateOpenPopupOnHover) {
            setTimeout(() => {
              e.target.closePopup();
            }, 1000);
          }
        },
        mouseover: e => {
          console.log(`${eventId}mouseover`, stateParticipantCoordinates.id);
          //start(e);
          if (stateOpenPopupOnHover) {
            e.target.openPopup();
            fetchParticipantInformation();
          }
        },
        popupclose: () => setStatePopupOpen(false),
        popupopen: () => setStatePopupOpen(true),
      }}
    >
      {stateShowTooltip ? (
        <Tooltip direction="bottom" offset={[0, 0]} opacity={1} permanent>
          {participantType} {stateParticipantCoordinates.id}{' '}
          {statePopupOpen ? 'open' : 'closed'}
        </Tooltip>
      ) : (
        <></>
      )}
      <Popup
        eventHandlers={{
          click: e => {
            console.log(
              `participant marker popup clicked ${participantType}`,
              stateParticipantCoordinates,
              e
            );
          },
        }}
        interactive
      >
        <PopupContentParticipant
          stateParticipantCoordinates={stateParticipantCoordinates}
          participantType={participantType}
          stateCustomerInformation={stateCustomerInformation}
          stateRideProviderInformation={stateRideProviderInformation}
          stateSpectator={stateSpectator}
          setStateSpectator={setStateSpectator}
        />
      </Popup>
    </Marker>
  );
  const isRelevantParticipant =
    stateSelectedParticipant === stateParticipantCoordinates.id;
  if (stateRideRequest !== null && isRelevantParticipant) {
    const rideRequestHighlight = stateSpectator === stateRideRequest.userId;
    const getPopupReal = (
      title: string,
      id: string,
      locationType: 'pickup' | 'dropoff',
      rideRequest: Readonly<SimulationEndpointRideRequestInformation>
    ) => (
      <Popup>
        {title} ({id})
        <ul className="scrolling">
          <li key={`ride_request_${id}_${locationType}_real_popup_pickup`}>
            Pickup location: {rideRequest.pickupLocationCoordinates.address}
          </li>
          <li
            key={`ride_request_${stateRideRequest.id}_${locationType}_popup_dropoff`}
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
            lat: stateRideRequest.pickupLocationCoordinates.lat,
            lng: stateRideRequest.pickupLocationCoordinates.long,
          }}
          color={rideRequestHighlight ? 'red' : 'blue'}
          fillColor={rideRequestHighlight ? 'red' : 'blue'}
          radius={rideRequestHighlight ? 400 : 50}
          key={`ride_request_${stateRideRequest.id}_pickup`}
          eventHandlers={{
            click: e => {
              console.log(
                'click ride request pickup circle',
                stateRideRequest,
                e
              );
            },
          }}
        >
          {getPopupReal(
            'Ride request pickup location',
            stateRideRequest.id,
            'pickup',
            stateRideRequest
          )}
        </Circle>
        <Circle
          center={{
            lat: stateRideRequest.dropoffLocationCoordinates.lat,
            lng: stateRideRequest.dropoffLocationCoordinates.long,
          }}
          color={rideRequestHighlight ? 'green' : 'blue'}
          fillColor={rideRequestHighlight ? 'green' : 'blue'}
          radius={rideRequestHighlight ? 400 : 50}
          key={`ride_request_${stateRideRequest.id}_dropoff`}
          eventHandlers={{
            click: e => {
              console.log(
                'click ride request dropoff circle',
                stateRideRequest,
                e
              );
            },
          }}
        >
          {getPopupReal(
            'Ride request dropoff location',
            stateRideRequest.id,
            'dropoff',
            stateRideRequest
          )}
        </Circle>
      </>
    );
    const getPopupCloaked = (
      title: string,
      id: string,
      locationType: 'pickup' | 'dropoff',
      rideRequest: Readonly<SimulationEndpointRideRequestInformation>
    ) => (
      <Popup>
        {title} ({id})
        <ul className="scrolling">
          <li key={`ride_request_${id}_${locationType}_cloaked_popup_pickup`}>
            Pickup location: {rideRequest.pickupLocationCoordinates.address}
          </li>
          <li
            key={`ride_request_${stateRideRequest.id}_${locationType}_cloaked_popup_dropoff`}
          >
            Dropoff location: {rideRequest.dropoffLocationCoordinates.address}
          </li>
        </ul>
      </Popup>
    );
    const polygons = (
      <>
        <Polygon
          positions={getH3Polygon(stateRideRequest.pickupLocation)}
          key={`ride_request_${stateRideRequest.id}_pickup_polygon`}
        >
          {getPopupCloaked(
            'Ride request pickup location (cloaked)',
            stateRideRequest.id,
            'pickup',
            stateRideRequest
          )}
        </Polygon>
        <Polygon
          positions={getH3Polygon(stateRideRequest.dropoffLocation)}
          key={`ride_request_${stateRideRequest.id}_dropoff_polygon`}
        >
          {getPopupCloaked(
            'Ride request dropoff location (cloaked)',
            stateRideRequest.id,
            'dropoff',
            stateRideRequest
          )}
        </Polygon>
      </>
    );
    return (
      <>
        <Circle
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
        </Marker>
        {polygons}
        {realLocations}
        {marker}
      </>
    );
  }
  return marker;
}
