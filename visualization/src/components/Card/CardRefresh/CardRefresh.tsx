// Package imports
import {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
// Local imports
// > Components
import CardParticipant from '../CardParticipant';
import CardRideRequest from '../CardRideRequest';
// > Globals
import {simulationEndpoints} from '@globals/defaults/endpoints';
// > Misc
import {debugRequestBlock, debugVisibilityChange} from '@misc/debug';
// Type imports
import type {ReactSetState, ReactState} from '@misc/react';
import type {
  SimulationEndpointParticipantIdFromPseudonym,
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointRideRequestInformation,
} from '@globals/types/simulation';
import type {CardParticipantProps} from '../CardParticipant';
import type {CardRideRequestProps} from '../CardRideRequest';
import type {GetACarParticipantTypes} from '@globals/types/participant';
import type {SettingsConnectedElementsProps} from '@misc/props/settings';

export interface CardRefreshProps
  extends CardRideRequestProps,
    CardParticipantProps,
    SettingsConnectedElementsProps {}

export interface CardRefreshPropsInput
  extends CardRideRequestProps,
    CardParticipantProps,
    SettingsConnectedElementsProps {
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
  /** Optional declare that the ID is actually a pseudonym and needs to be fetched */
  isPseudonym?: boolean;
}

export default memo(CardRefresh);

/**
 * Auto refreshing card
 */
export function CardRefresh(props: CardRefreshPropsInput) {
  const {
    cardType,
    fetchJsonSimulation,
    fetchJsonSimulationWait,
    id,
    isPseudonym,
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

  // > Fetching of actual actor ID in case it was a pseudonym
  const [stateResolvedPseudonym, setStateResolvedPseudonym] = useState<
    string | undefined
  >(undefined);

  // React: Run on first render
  // > In case the actor ID is a pseudonym fetch the actual actor ID
  useEffect(() => {
    if (
      isPseudonym &&
      (cardType === 'customer' || cardType === 'ride_provider')
    ) {
      fetchJsonSimulation<SimulationEndpointParticipantIdFromPseudonym>(
        simulationEndpoints.apiV1.participantIdFromPseudonym(id)
      )
        .then(data => setStateResolvedPseudonym(data.id))
        .catch(err =>
          showError(
            'Simulation fetch participant ID from pseudonym [CardRefresh]',
            err
          )
        );
    }
  }, [fetchJsonSimulation, isPseudonym, showError, id, cardType]);

  /** Keep track of if there is a fetch happening to not double fetch at the same time */
  const currentlyFetching = useRef(false);

  const participantId = useMemo(
    () => (isPseudonym === true ? stateResolvedPseudonym : id),
    [id, isPseudonym, stateResolvedPseudonym]
  );

  /** Fetches the card specific information in set intervals */
  const fetchCardInformation = useCallback(async () => {
    if (pauseRefresh !== undefined && pauseRefresh()) {
      return;
    }
    // Get the card information
    try {
      if (cardType === 'customer' && participantId !== undefined) {
        const customerInformation =
          await fetchJsonSimulationWait<SimulationEndpointParticipantInformationCustomer>(
            simulationEndpoints.apiV1.participantInformationCustomer(
              participantId
            ),
            currentlyFetching
          );
        if (customerInformation === null) {
          return;
        }
        setStateCustomerInformation(customerInformation);
      } else if (cardType === 'ride_provider' && participantId !== undefined) {
        const rideProviderInformation =
          await fetchJsonSimulationWait<SimulationEndpointParticipantInformationRideProvider>(
            simulationEndpoints.apiV1.participantInformationRideProvider(
              participantId
            ),
            currentlyFetching
          );
        if (rideProviderInformation === null) {
          return;
        }
        setStateRideProviderInformation(rideProviderInformation);
      } else if (cardType === 'ride_request') {
        const rideRequestInformation =
          await fetchJsonSimulationWait<SimulationEndpointRideRequestInformation>(
            simulationEndpoints.apiV1.rideRequestInformation(id),
            currentlyFetching
          );
        if (rideRequestInformation === null) {
          return;
        }
        setStateRideRequestInformation(rideRequestInformation);
      }
    } catch (err) {
      showError(
        `Simulation fetch card information '${cardType}' (${id})`,
        err as Error
      );
    }
  }, [
    cardType,
    fetchJsonSimulationWait,
    id,
    participantId,
    pauseRefresh,
    showError,
  ]);

  // React: Effects
  // > Update current ride request list
  useEffect(() => {
    let currentRideRequest: undefined | string = undefined;
    // Get the card information
    if (cardType === 'customer' && stateCustomerInformation !== null) {
      currentRideRequest = stateCustomerInformation.rideRequest;
    } else if (
      cardType === 'ride_provider' &&
      stateRideProviderInformation !== null
    ) {
      currentRideRequest = stateRideProviderInformation.rideRequest;
    }
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
    setStateRideRequestList,
    stateCustomerInformation,
    stateRideProviderInformation,
    stateRideRequestList,
  ]);

  const [stateWindowIsHidden, setStateWindowIsHidden] = useState(false);

  // > Fetch data in interval
  useEffect(() => {
    // Initial fetch
    fetchCardInformation();

    // Detect when window is hidden
    const visibilityChangeListener = () => {
      setStateWindowIsHidden(document.hidden);
      debugVisibilityChange(
        document.hidden,
        `CardRefresh '${cardType}' (${id})`
      );
    };
    document.addEventListener('visibilitychange', visibilityChangeListener);

    // Fetch continuously
    const interval = setInterval(() => {
      if (stateWindowIsHidden) {
        debugRequestBlock(
          'Card information',
          'window not visible',
          `CardRefresh '${cardType}' (${id})`
        );
        return;
      }
      fetchCardInformation();
    }, stateSettingsCardUpdateRateInMs);

    return () => {
      // On close stop interval and remove window visibility change listener
      clearInterval(interval);
      document.removeEventListener(
        'visibilitychange',
        visibilityChangeListener
      );
    };
  });

  return cardType === 'customer' || cardType === 'ride_provider' ? (
    <CardParticipant
      {...props}
      participantType={cardType}
      stateCustomerInformation={stateCustomerInformation}
      stateRideProviderInformation={stateRideProviderInformation}
      stateParticipantId={participantId ?? id}
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
