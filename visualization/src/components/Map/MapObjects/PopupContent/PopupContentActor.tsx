// Local imports
import ChangeViewButton from './ChangeViewButton';
// Type imports
import type {FC} from 'react';
import type {SimulationEndpointParticipantCoordinatesParticipant} from '@/globals/types/simulation';

export interface PopupContentCustomerProps {
  customer: Record<string, any>;
  spectatorState: string;
}

export const PopupContentCustomer: FC<PopupContentCustomerProps> = ({
  customer,
  spectatorState,
}) => {
  return (
    <>
      {Object.keys(customer)
        .filter(
          key =>
            ![
              'id',
              'type',
              'currentLocation',
              'currentArea',
              'participantDb',
              'auctionsDb',
            ].includes(key)
        )
        .map(key => {
          if (
            spectatorState !== 'everything' &&
            spectatorState !== customer.id
          ) {
            return <p key={`${customer.id}_${key}`}>{key}: *****</p>;
          }
          if (key === 'rideRequestOld') {
            return (
              <>
                <p key={`${customer.id}_${key}`}>{key}:</p>
                <ul className="scrolling" key={`${customer.id}_${key}_ul`}>
                  <li key={`${customer.id}_${key}_state`}>
                    state: {customer[key]['state']}
                  </li>
                  <li key={`${customer.id}_${key}_destination`}>
                    destination: {customer[key]['address']}
                  </li>
                </ul>
              </>
            );
          }
          return (
            <p key={`${customer.id}_${key}`}>
              {key}: {customer[key]}
            </p>
          );
        })}
    </>
  );
};

export interface PopupContentRideProviderProps {
  rideProvider: Record<string, any>;
  spectatorState: string;
}

export const PopupContentRideProvider: FC<PopupContentRideProviderProps> = ({
  rideProvider,
  spectatorState,
}) => {
  const content = [];
  for (const key in rideProvider) {
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
    if (key === 'passengers') {
      value = (
        <>
          <p key={`${rideProvider.id}_${key}`}>{key}:</p>
          <ul className="scrolling" key={`${rideProvider.id}_${key}_ul`}>
            {rideProvider[key].map((a: any, index: number) => (
              <li key={`${rideProvider.id}_${key}_${index}`}>{a}</li>
            ))}
          </ul>
        </>
      );
    } else {
      value = (
        <p key={`${rideProvider.id}_${key}`}>
          {key}: {rideProvider[key]}
        </p>
      );
    }
    content.push(value);
  }

  return <>{content}</>;
};

export interface PopupContentActorProps {
  actor: Record<string, any>;
  spectatorState: string;
  setStateSpectator: (newSpectator: string) => void;
}

export const PopupContentActor: FC<PopupContentActorProps> = ({
  actor,
  spectatorState,
  setStateSpectator,
}) => {
  const content = [];
  for (const key in actor) {
    if (['id', 'type', 'currentLocation', 'currentArea'].includes(key)) {
      continue;
    }
    const title = (
      <p
        style={{
          fontSize: '1em',
          marginTop: '0.2em',
          marginBottom: '0.2em',
        }}
        key={`${actor.id}_title`}
      >
        {key}:
      </p>
    );
    const titleValue = (
      <p
        style={{
          fontSize: '1em',
          marginTop: '0.2em',
          marginBottom: '0.2em',
        }}
        key={`${actor.id}_title_value`}
      >
        {key}: {actor[key]}
      </p>
    );
    if (key === 'passengers') {
      content.push(
        title,
        <ul className="scrolling" key={`${actor.id}_${key}`}>
          {actor[key].map((a: any) => (
            <li key={actor.id + a}>{a}</li>
          ))}
        </ul>
      );
    } else if (key === 'rideRequestOld') {
      content.push(
        title,
        <ul className="scrolling" key={`${actor.id}_${key}`}>
          <li>state: {actor[key]['state']}</li>
          <li>destination: {actor[key]['address']}</li>
        </ul>
      );
    } else if (key === 'participantDb') {
      content.push(
        title,
        <ul className="scrolling" key={`${actor.id}_${key}`}>
          {actor[key].map((a: any) => (
            <>
              <li>{a.contactDetails.id}</li>
              <ul>
                $
                {a.pseudonyms.map((b: any) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </>
          ))}
        </ul>
      );
    } else if (key === 'auctionsDb') {
      content.push(
        title,
        <ul className="scrolling" key={`${actor.id}_${key}`}>
          {actor[key].map((a: any, index: number) => (
            <li key={`${actor.id}_${key}_${index}`}>{JSON.stringify(a)}</li>
          ))}
        </ul>
      );
    } else {
      content.push(titleValue);
    }
  }

  let actorContent = <></>;
  if (actor.type === 'customer') {
    actorContent = (
      <PopupContentCustomer customer={actor} spectatorState={spectatorState} />
    );
  }
  if (actor.type === 'ride_provider') {
    actorContent = (
      <PopupContentRideProvider
        rideProvider={actor}
        spectatorState={spectatorState}
      />
    );
  }

  return (
    <>
      <h2>
        {actor.type} ({actor.id}) [{spectatorState}]
      </h2>
      {actorContent}
      <ChangeViewButton
        actorState={
          actor as SimulationEndpointParticipantCoordinatesParticipant
        }
        setStateSpectator={setStateSpectator}
      />
    </>
  );
};
