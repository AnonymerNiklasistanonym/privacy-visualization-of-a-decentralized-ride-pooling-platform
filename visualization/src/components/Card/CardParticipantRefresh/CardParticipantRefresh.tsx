// Package imports
import {memo, useEffect, useState} from 'react';
// Local imports
// > Components
import CardParticipant from '../CardParticipant/CardParticipant';
// > Globals
import {simulationEndpoints} from '@globals/defaults/endpoints';
// Type imports
import type {
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
} from '@globals/types/simulation';
import type {ChangeViewButtonProps} from '@components/Button/ChangeViewButton';
import type {GetACarParticipantTypes} from '@globals/types/participant';
import type {SettingsConnectedElementsProps} from '@misc/props/settings';

export interface CardParticipantRefreshProps
  extends ChangeViewButtonProps,
    SettingsConnectedElementsProps {
  participantType: GetACarParticipantTypes;
  participantId: string;
  label: string;
  onUnpin?: () => void;
}

export default memo(CardParticipantRefresh);

export function CardParticipantRefresh(props: CardParticipantRefreshProps) {
  const {
    fetchJsonSimulation,
    label,
    participantId,
    participantType,
    showError,
    stateSettingsCardUpdateRateInMs,
    onUnpin,
  } = props;

  const [stateCustomerInformation, setStateCustomerInformation] =
    useState<SimulationEndpointParticipantInformationCustomer | null>(null);
  const [stateRideProviderInformation, setStateRideProviderInformation] =
    useState<SimulationEndpointParticipantInformationRideProvider | null>(null);

  const fetchParticipantInformation = async () => {
    if (participantType === 'customer') {
      const customerInformation =
        await fetchJsonSimulation<SimulationEndpointParticipantInformationCustomer>(
          simulationEndpoints.apiV1.participantInformationCustomer(
            participantId
          )
        );
      setStateCustomerInformation(customerInformation);
    }
    if (participantType === 'ride_provider') {
      const rideProviderInformation =
        await fetchJsonSimulation<SimulationEndpointParticipantInformationRideProvider>(
          simulationEndpoints.apiV1.participantInformationRideProvider(
            participantId
          )
        );
      setStateRideProviderInformation(rideProviderInformation);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      fetchParticipantInformation().catch(err =>
        showError('Simulation fetch participant information', err)
      );
    }, stateSettingsCardUpdateRateInMs);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <CardParticipant
      {...props}
      participantType={participantType}
      stateCustomerInformation={stateCustomerInformation}
      stateRideProviderInformation={stateRideProviderInformation}
      stateParticipantId={participantId}
      label={label}
      unpinAction={onUnpin}
    />
  );
}
