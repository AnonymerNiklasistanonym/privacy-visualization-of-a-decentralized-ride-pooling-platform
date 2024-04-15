'use client';

import {useState} from 'react';
import {Marker, Popup} from 'react-leaflet';
import L from 'leaflet';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import ReactDOMServer from 'react-dom/server';
import {fetchJsonSimulation} from '@/globals/lib/fetch';
import PopupContentParticipant from '@components/PopupContent/PopupContentParticipant';

import type {
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
} from '@/globals/types/simulation';
import type {FC} from 'react';
import type {ReactSetState, ReactState} from '@/globals/types/react';
import type {SimulationEndpointParticipantCoordinatesParticipant} from '@/globals/types/simulation';

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

  return (
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
            ).then(data => {
              setCustomerInformationState(data);
            });
          }
          if (participantType === 'ride_provider') {
            fetchJsonSimulation<SimulationEndpointParticipantInformationRideProvider>(
              `json/ride_provider/${participantCoordinatesState.id}`
            ).then(data => {
              setRideProviderInformationState(data);
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
};

export default ParticipantMarker;
