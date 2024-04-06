// Local imports
import Button from '@components/Button';
// Type imports
import type {FC} from 'react';

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
              'passengers',
              'participantDb',
              'auctionsDb',
            ].includes(key)
        )
        .map(key => {
          if (
            spectatorState !== 'everything' &&
            spectatorState !== customer.id
          ) {
            return <p key={customer.id + key}>{key}: *****</p>;
          }
          if (key === 'rideRequest') {
            return (
              <>
                <p>{key}:</p>
                <ul className="scrolling">
                  <li>state: {customer[key]['state']}</li>
                  <li>destination: {customer[key]['address']}</li>
                </ul>
              </>
            );
          }
          return (
            <p key={customer.id + key}>
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
        'rideRequest',
        'participantDb',
        'auctionsDb',
      ].includes(key)
    ) {
      continue;
    }
    if (key === 'passengers') {
      value = (
        <>
          <p>{key}:</p>
          <ul className="scrolling">
            {rideProvider[key].map((a: any, index: number) => (
              <li key={`${rideProvider.id}_${key}_${index}`}>{a}</li>
            ))}
          </ul>
        </>
      );
    } else {
      value = (
        <p>
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
      >
        {key}: {actor[key]}
      </p>
    );
    if (key === 'passengers') {
      content.push(
        title,
        <ul className="scrolling">
          {actor[key].map((a: any) => (
            <li key={actor.id + a}>{a}</li>
          ))}
        </ul>
      );
    } else if (key === 'rideRequest') {
      content.push(
        title,
        <ul className="scrolling">
          <li>state: {actor[key]['state']}</li>
          <li>destination: {actor[key]['address']}</li>
        </ul>
      );
    } else if (key === 'participantDb') {
      content.push(
        title,
        <ul className="scrolling">
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
        <ul className="scrolling">
          {actor[key].map((a: any) => (
            <li key={a}>{JSON.stringify(a)}</li>
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
      <Button
        onClick={() => {
          console.log(`Change view to this spectator: ${actor.id}`);
          setStateSpectator(actor.id);
        }}
      >
        Change view to this actor
      </Button>
    </>
  );
};
