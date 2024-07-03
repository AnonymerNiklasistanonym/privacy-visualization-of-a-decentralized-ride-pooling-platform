// Package imports
import {memo, useEffect, useRef, useState} from 'react';
// Local imports
// > Components
import CardParticipant from '../CardParticipant/CardParticipant';
import CardRideRequest from '../CardRideRequest';
// > Globals
import {simulationEndpoints} from '@globals/defaults/endpoints';
// Type imports
import type {ReactSetState, ReactState} from '@misc/react';
import type {
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointRideRequestInformation,
} from '@globals/types/simulation';
import type {ChangeViewButtonProps} from '@components/Button/ChangeSpectatorButton';
import type {GetACarParticipantTypes} from '@globals/types/participant';
import type {GlobalPropsIntlValues} from '@misc/props/global';
import type {SettingsConnectedElementsProps} from '@misc/props/settings';

export interface CardRefreshProps
  extends ChangeViewButtonProps,
    SettingsConnectedElementsProps,
    GlobalPropsIntlValues {
  /** The type of data that should be fetched/displayed (e.g. participant)  */
  cardType: GetACarParticipantTypes | 'ride_request';
  /** The ID of the element that should be fetched/displayed */
  id: string;
  /** Additional label of the card (e.g. 'passenger'/'pinned') */
  label?: string;
  /** If found enable unpin action (with icon) */
  onUnpin?: () => void;
  /** If found enable pin action (with icon) */
  onPin?: () => void;
  /** Indicator if pinned */
  isPinned?: boolean;
  /** If found check if the fetching should be paused at the moment */
  pauseRefresh?: () => boolean;
  /** Optional method to update the ride request ID list with the current ride request ID */
  setStateRideRequestList?: ReactSetState<Array<string>>;
  /** Optional state to not unnecessarily update the ride request ID list */
  stateRideRequestList?: ReactState<Array<string>>;
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
    onPin,
    isPinned,
    pauseRefresh,
    setStateRideRequestList,
    showError,
    stateRideRequestList,
    stateSettingsCardUpdateRateInMs,
  } = props;

  // React: States
  // > Card information
  const [stateCustomerInformation, setStateCustomerInformation] =
    useState<SimulationEndpointParticipantInformationCustomer | null>(null);
  const [stateRideProviderInformation, setStateRideProviderInformation] =
    useState<SimulationEndpointParticipantInformationRideProvider | null>(null);
  const [stateRideRequestInformation, setStateRideRequestInformation] =
    useState<SimulationEndpointRideRequestInformation | null>(null);

  const requestBalancer = useRef(false);

  /** Fetches the card specific information in set intervals */
  const fetchCardInformation = async () => {
    if (requestBalancer.current) {
      console.warn(
        `Stopped card refresh (${cardType}, ${id}) fetch since a request is already happening`
      );
      return;
    }
    if (pauseRefresh !== undefined && pauseRefresh()) {
      return;
    }
    requestBalancer.current = true;
    let currentRideRequest: undefined | string = undefined;
    // Get the card information
    if (cardType === 'customer') {
      const customerInformation =
        await fetchJsonSimulation<SimulationEndpointParticipantInformationCustomer>(
          simulationEndpoints.apiV1.participantInformationCustomer(id)
        );
      setStateCustomerInformation(customerInformation);
      currentRideRequest = customerInformation.rideRequest;
    } else if (cardType === 'ride_provider') {
      const rideProviderInformation =
        await fetchJsonSimulation<SimulationEndpointParticipantInformationRideProvider>(
          simulationEndpoints.apiV1.participantInformationRideProvider(id)
        );
      setStateRideProviderInformation(rideProviderInformation);
      currentRideRequest = rideProviderInformation.rideRequest;
    } else if (cardType === 'ride_request') {
      const rideRequestInformation =
        await fetchJsonSimulation<SimulationEndpointRideRequestInformation>(
          simulationEndpoints.apiV1.rideRequestInformation(id)
        );
      setStateRideRequestInformation(rideRequestInformation);
    }
    requestBalancer.current = false;
    // Update external ride request ID list
    if (
      currentRideRequest !== undefined &&
      stateRideRequestList !== undefined &&
      setStateRideRequestList !== undefined &&
      !stateRideRequestList.includes(currentRideRequest)
    ) {
      setStateRideRequestList(prev => [...prev, currentRideRequest]);
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
      pinAction={onPin}
      isPinned={isPinned}
      unpinAction={onUnpin}
      intlValues={intlValues}
    />
  ) : cardType === 'ride_request' ? (
    <CardRideRequest
      {...props}
      stateRideRequestInformation={stateRideRequestInformation}
      stateRideRequestId={id}
    />
  ) : (
    <>Unknown card type: {cardType}</>
  );
}
