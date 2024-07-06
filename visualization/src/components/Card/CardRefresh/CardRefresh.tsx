// Package imports
import {memo, useCallback, useEffect, useRef, useState} from 'react';
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
import type {CardGenericProps} from '../CardGeneric';
import type {ChangeViewButtonProps} from '@components/Button/ChangeSpectatorButton';
import type {GetACarParticipantTypes} from '@globals/types/participant';
import type {GlobalPropsIntlValues} from '@misc/props/global';
import type {SettingsConnectedElementsProps} from '@misc/props/settings';

export interface CardRefreshProps
  extends ChangeViewButtonProps,
    SettingsConnectedElementsProps,
    CardGenericProps,
    GlobalPropsIntlValues {
  /** The type of data that should be fetched/displayed (e.g. participant)  */
  cardType: GetACarParticipantTypes | 'ride_request';
  /** The ID of the element that should be fetched/displayed */
  id: string;
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

  /** Keep track of if there is a fetch happening to not double fetch at the same time */
  const currentlyFetching = useRef(false);

  /** Fetches the card specific information in set intervals */
  const fetchCardInformation = useCallback(async () => {
    if (currentlyFetching.current) {
      console.warn(
        `Stopped card refresh (${cardType}, ${id}) fetch since a request is already happening`
      );
      return;
    }
    if (pauseRefresh !== undefined && pauseRefresh()) {
      return;
    }
    currentlyFetching.current = true;
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
    currentlyFetching.current = false;
    // Update external ride request ID list
    if (
      currentRideRequest !== undefined &&
      stateRideRequestList !== undefined &&
      setStateRideRequestList !== undefined &&
      !stateRideRequestList.includes(currentRideRequest)
    ) {
      setStateRideRequestList(prev => [...prev, currentRideRequest]);
    }
  }, [
    cardType,
    fetchJsonSimulation,
    id,
    pauseRefresh,
    setStateRideRequestList,
    stateRideRequestList,
  ]);

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
