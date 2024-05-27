// Package imports
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
  SimulationEndpointParticipantCoordinatesParticipant,
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantTypes,
} from '@globals/types/simulation';
import type {ChangeViewButtonProps} from '@components/Button/ChangeViewButton';
import type {ReactState} from '@misc/react';

export interface CardParticipantProps extends ChangeViewButtonProps {
  stateParticipantCoordinates: ReactState<SimulationEndpointParticipantCoordinatesParticipant>;
  stateCustomerInformation: ReactState<null | SimulationEndpointParticipantInformationCustomer>;
  stateRideProviderInformation: ReactState<null | SimulationEndpointParticipantInformationRideProvider>;
  participantType: SimulationEndpointParticipantTypes;
}

export default function CardParticipant(props: CardParticipantProps) {
  const {
    stateParticipantCoordinates,
    stateCustomerInformation,
    stateRideProviderInformation,
    participantType,
  } = props;
  return (
    <CardGeneric
      icon={
        participantType === 'customer' ? (
          <ParticipantCustomerIcon />
        ) : (
          <ParticipantRideProviderIcon />
        )
      }
      name={participantType === 'customer' ? 'Customer' : 'Ride Provider'}
      id={stateParticipantCoordinates.id}
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
              actorId={stateParticipantCoordinates.id}
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
