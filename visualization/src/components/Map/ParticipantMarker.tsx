'use client';

import {useState} from 'react';
import {Circle, Marker, Polygon, Popup} from 'react-leaflet';
import L from 'leaflet';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import ReactDOMServer from 'react-dom/server';
import {fetchJsonSimulation} from '@/globals/lib/fetch';
import PopupContentParticipant from '@components/PopupContent/PopupContentParticipant';
import {getH3Polygon} from '@/globals/lib/h3';

import type {
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantInformationRideRequest,
} from '@/globals/types/simulation';
import type {FC} from 'react';
import type {ReactSetState, ReactState} from '@/globals/types/react';
import type {SimulationEndpointParticipantCoordinatesParticipant} from '@/globals/types/simulation';
import type {CoordinatesAddress} from '@/globals/types/coordinates';

const iconCustomerHTML = ReactDOMServer.renderToString(<DirectionsWalkIcon />);
const iconRideProviderHTML = ReactDOMServer.renderToString(
  <DirectionsCarIcon />
);
const iconCustomerHTMLGray = ReactDOMServer.renderToString(
  <DirectionsWalkIcon fill="gray" />
);
const iconRideProviderHTMLGray = ReactDOMServer.renderToString(
  <DirectionsCarIcon fill="gray" />
);

interface ParticipantMarkerProps {
  participantCoordinatesState: SimulationEndpointParticipantCoordinatesParticipant;
  spectatorState: ReactState<string>;
  setStateSpectator: ReactSetState<string>;
  participantType: 'customer' | 'ride_provider';
}

const ParticipantMarker: FC<ParticipantMarkerProps> = ({
  participantCoordinatesState,
  spectatorState,
  setStateSpectator,
  participantType,
}) => {
  const iconCustomer = L.divIcon({
    html: iconCustomerHTML,
    className: '',
    iconSize: new L.Point(32, 32),
  });
  const iconRideProvider = L.divIcon({
    html: iconRideProviderHTML,
    className: '',
    iconSize: new L.Point(32, 32),
  });
  // Different color icons
  const iconCustomerGray = L.divIcon({
    html: iconCustomerHTMLGray,
    className: '',
    iconSize: new L.Point(32, 32),
  });
  const iconRideProviderGray = L.divIcon({
    html: iconRideProviderHTMLGray,
    className: '',
    iconSize: new L.Point(32, 32),
  });

  const [customerInformationState, setCustomerInformationState] =
    useState<null | SimulationEndpointParticipantInformationCustomer>(null);
  const [rideProviderInformationState, setRideProviderInformationState] =
    useState<null | SimulationEndpointParticipantInformationRideProvider>(null);

  const [rideRequestState, setRideRequestState] =
    useState<null | SimulationEndpointParticipantInformationRideRequest>(null);

  const marker = (
    <Marker
      key={`customer_${participantCoordinatesState.id}`}
      position={[
        participantCoordinatesState.lat,
        participantCoordinatesState.long,
      ]}
      icon={participantType === 'customer' ? iconCustomer : iconRideProvider}
      eventHandlers={{
        click: e => {
          console.log(
            `participant marker clicked ${participantType}`,
            participantCoordinatesState,
            e
          );
          if (participantType === 'customer') {
            fetchJsonSimulation<SimulationEndpointParticipantInformationCustomer>(
              `json/customer/${participantCoordinatesState.id}`
            )
              .then(newCustomerInformation => {
                setCustomerInformationState(newCustomerInformation);
                console.log('Fetched customer', newCustomerInformation);
                if (newCustomerInformation.rideRequest !== undefined) {
                  fetchJsonSimulation<SimulationEndpointParticipantInformationRideRequest>(
                    `json/ride_request/${newCustomerInformation.rideRequest}`
                  )
                    .then(newRideRequestInformation => {
                      setRideRequestState(newRideRequestInformation);
                      console.log(
                        'Fetched rideRequest',
                        newRideRequestInformation
                      );
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
              `json/ride_provider/${participantCoordinatesState.id}`
            )
              .then(newRideProviderInformation => {
                setRideProviderInformationState(newRideProviderInformation);
                console.log(
                  'Fetched ride provider',
                  newRideProviderInformation
                );
                if (newRideProviderInformation.rideRequest !== undefined) {
                  fetchJsonSimulation<SimulationEndpointParticipantInformationRideRequest>(
                    `json/ride_request/${newRideProviderInformation.rideRequest}`
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
        },
      }}
    >
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
        {polygons}
        {realLocations}
        {marker}
      </>
    );
  }
  return marker;
};

export default ParticipantMarker;
