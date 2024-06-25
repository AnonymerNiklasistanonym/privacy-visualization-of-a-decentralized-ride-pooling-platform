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
import type {GlobalPropsIntlValues} from '@misc/props/global';
import type {SettingsConnectedElementsProps} from '@misc/props/settings';

export interface CardRefreshProps
  extends ChangeViewButtonProps,
    SettingsConnectedElementsProps,
    GlobalPropsIntlValues {
  /** The type of data that should be fetched/displayed (e.g. participant)  */
  cardType: GetACarParticipantTypes;
  /** The ID of the element that should be fetched/displayed */
  id: string;
  /** Additional label of the card (e.g. 'passenger'/'pinned') */
  label?: string;
  /** If found enable unpin action (with icon) */
  onUnpin?: () => void;
  /** If found check if the fetching should be paused at the moment */
  pauseRefresh?: () => boolean;
}

export default memo(CardRefresh);

/**
 * Auto refreshing card
 */
export function CardRefresh(props: CardRefreshProps) {
  const {
    cardType,
    fetchJsonSimulation,
    id,
    intlValues,
    label,
    onUnpin,
    pauseRefresh,
    showError,
    stateSettingsCardUpdateRateInMs,
  } = props;

  // React: States
  // > Card information
  const [stateCustomerInformation, setStateCustomerInformation] =
    useState<SimulationEndpointParticipantInformationCustomer | null>(null);
  const [stateRideProviderInformation, setStateRideProviderInformation] =
    useState<SimulationEndpointParticipantInformationRideProvider | null>(null);

  /** Fetches the card specific information in set intervals */
  const fetchCardInformation = async () => {
    if (pauseRefresh !== undefined && pauseRefresh()) {
      return;
    }
    if (cardType === 'customer') {
      const customerInformation =
        await fetchJsonSimulation<SimulationEndpointParticipantInformationCustomer>(
          simulationEndpoints.apiV1.participantInformationCustomer(id)
        );
      setStateCustomerInformation(customerInformation);
    }
    if (cardType === 'ride_provider') {
      const rideProviderInformation =
        await fetchJsonSimulation<SimulationEndpointParticipantInformationRideProvider>(
          simulationEndpoints.apiV1.participantInformationRideProvider(id)
        );
      setStateRideProviderInformation(rideProviderInformation);
    }
  };

  // React: Effects
  // > Fetch data in interval
  useEffect(() => {
    const interval = setInterval(async () => {
      fetchCardInformation().catch(err =>
        showError(
          `Simulation fetch card information '${cardType}' (${id})`,
          err
        )
      );
    }, stateSettingsCardUpdateRateInMs);
    return () => {
      clearInterval(interval);
    };
  });

  return cardType === 'customer' || cardType === 'ride_provider' ? (
    <CardParticipant
      {...props}
      participantType={cardType}
      stateCustomerInformation={stateCustomerInformation}
      stateRideProviderInformation={stateRideProviderInformation}
      stateParticipantId={id}
      label={label}
      unpinAction={onUnpin}
      intlValues={intlValues}
    />
  ) : (
    <></>
  );
}
