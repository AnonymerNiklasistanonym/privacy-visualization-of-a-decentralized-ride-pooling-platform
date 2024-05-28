// Local imports
import cardParticipantContentCustomer from './cardParticipantContentCustomer';
import cardParticipantContentRideProvider from './cardParticipantContentRideProvider';
// > Components
import {
  ParticipantCustomerIcon,
  ParticipantRideProviderIcon,
} from '@components/Icons';
import CardGeneric from '@components/Card/CardGeneric';
import ChangeViewButton from '@components/Button/ChangeViewButton';
// Type imports
import type {
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantTypes,
} from '@globals/types/simulation';
import type {CardGenericProps} from '@components/Card/CardGeneric';
import type {ChangeViewButtonProps} from '@components/Button/ChangeViewButton';
import type {ReactState} from '@misc/react';

export interface CardParticipantProps
  extends ChangeViewButtonProps,
    CardGenericProps {
  stateParticipantId: ReactState<string>;
  stateCustomerInformation: ReactState<null | SimulationEndpointParticipantInformationCustomer>;
  stateRideProviderInformation: ReactState<null | SimulationEndpointParticipantInformationRideProvider>;
  participantType: SimulationEndpointParticipantTypes;
}

export default function CardParticipant(props: CardParticipantProps) {
  const {
    stateParticipantId,
    stateCustomerInformation,
    stateRideProviderInformation,
    participantType,
  } = props;
  return (
    <CardGeneric
      {...props}
      icon={
        participantType === 'customer' ? (
          <ParticipantCustomerIcon />
        ) : (
          <ParticipantRideProviderIcon />
        )
      }
      name={participantType === 'customer' ? 'Customer' : 'Ride Provider'}
      id={stateParticipantId}
      status={
        participantType === 'customer'
          ? stateCustomerInformation?.simulationStatus
          : stateRideProviderInformation?.simulationStatus
      }
      content={[
        ...(participantType === 'customer'
          ? cardParticipantContentCustomer(
              props,
              stateCustomerInformation ?? undefined
            )
          : []),
        ...(participantType === 'ride_provider'
          ? cardParticipantContentRideProvider(
              props,
              stateRideProviderInformation ?? undefined
            )
          : []),
        {
          content: (
            <ChangeViewButton
              {...props}
              actorId={stateParticipantId}
              icon={
                participantType === 'customer' ? (
                  <ParticipantCustomerIcon />
                ) : (
                  <ParticipantRideProviderIcon />
                )
              }
              isPseudonym={false}
              label={
                participantType === 'customer'
                  ? 'this customer'
                  : 'this ride provider'
              }
            />
          ),
        },
      ]}
    />
  );
}
