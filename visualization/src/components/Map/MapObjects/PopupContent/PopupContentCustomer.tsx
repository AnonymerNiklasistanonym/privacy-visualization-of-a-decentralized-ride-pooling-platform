// Type imports
import type {SimulationEndpointParticipantInformationCustomer} from '@globals/types/simulation';

export interface PopupContentCustomerProps {
  customer: SimulationEndpointParticipantInformationCustomer;
  spectatorState: string;
}

export default function PopupContentCustomer({
  customer,
  spectatorState,
}: PopupContentCustomerProps) {
  return (
    <>
      {Object.entries(customer)
        .filter(
          a =>
            ![
              'id',
              'type',
              'currentLocation',
              'currentArea',
              'participantDb',
              'auctionsDb',
            ].includes(a[0])
        )
        .map(a => {
          const key = a[0];
          const value = a[1];
          if (
            spectatorState !== 'everything' &&
            spectatorState !== customer.id
          ) {
            return <p key={`${customer.id}_${key}`}>{key}: *****</p>;
          }
          //if (key === 'rideRequest') {
          //  return (
          //    <>
          //      <p key={`${customer.id}_${key}`}>{key}:</p>
          //      <ul className="scrolling" key={`${customer.id}_${key}_ul`}>
          //        <li key={`${customer.id}_${key}_state`}>
          //          state: {customer?.rideRequest. ['state']}
          //        </li>
          //        <li key={`${customer.id}_${key}_destination`}>
          //          destination: {customer[key]['address']}
          //        </li>
          //      </ul>
          //    </>
          //  );
          //}
          return (
            <p key={`${customer.id}_${key}`}>
              {key}: {value}
            </p>
          );
        })}
    </>
  );
}
