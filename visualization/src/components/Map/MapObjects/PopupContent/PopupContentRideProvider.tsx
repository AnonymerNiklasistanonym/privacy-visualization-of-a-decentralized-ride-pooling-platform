// Type imports
import type {SimulationEndpointParticipantInformationRideProvider} from '@globals/types/simulation';

export interface PopupContentRideProviderProps {
  rideProvider: SimulationEndpointParticipantInformationRideProvider;
  spectatorState: string;
}

export default function PopupContentRideProvider({
  rideProvider,
}: PopupContentRideProviderProps) {
  const content = [];
  for (const [key, val] of Object.entries(rideProvider)) {
    let value = <></>;
    if (
      [
        'id',
        'type',
        'currentLocation',
        'currentArea',
        'participantDb',
        'auctionsDb',
      ].includes(key)
    ) {
      continue;
    }
    if (key === 'passengerList') {
      if (rideProvider.passengerList !== undefined) {
        value = (
          <>
            <p key={`${rideProvider.id}_${key}`}>{key}:</p>
            <ul className="scrolling" key={`${rideProvider.id}_${key}_ul`}>
              {rideProvider.passengerList.map((a, index) => (
                <li key={`${rideProvider.id}_${key}_${index}`}>{a}</li>
              ))}
            </ul>
          </>
        );
      }
    } else {
      value = (
        <p key={`${rideProvider.id}_${key}`}>
          {key}: {val}
        </p>
      );
    }
    content.push(value);
  }

  return <>{content}</>;
}
