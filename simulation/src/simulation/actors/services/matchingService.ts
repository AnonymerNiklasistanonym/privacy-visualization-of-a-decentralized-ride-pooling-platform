// Local imports
import {Service} from '../service';
import {getRandomId} from '../../../misc/helpers';
import {wait} from '../../../lib/wait';
// Type imports
import type {Coordinates} from '../../../globals/types/coordinates';
import type {Simulation} from '../../simulation';

export interface Area extends Coordinates {
  radius: number;
}

export interface SimulationTypeService {
  id: string;
  currentArea: Area;
  type: 'authentication' | 'matching';
}

export interface SimulationTypeMatchingService extends SimulationTypeService {
  auctionsDb: MatchingServiceAuction[];
  type: 'matching';
}

export interface MatchingServiceAuction {
  id: string;
  request: MatchingServiceRequest;
  bids: MatchingServiceBid[];
  auctionStartedTimestamp: Date;
  auctionStatus:
    | 'open'
    | 'determining-winner'
    | 'waiting-for-signature'
    | 'closed';
  auctionWinner: null | string;
  helperRideProviderArrived?: boolean;
  /** Hmmmm */
  rideContractAddress?: string;
}

export interface MatchingServiceRequest {
  userId: string;
  pickupLocation: string;
  dropoffLocation: string;
  rating: number;
  userPublicKey: string;
  maxWaitingTime: number;
  minRating: number;
  minPassengerRating: number;
  maxPassengers: number;

  pickupLocationReal: {address: string} & Coordinates;
  dropoffLocationReal: {address: string} & Coordinates;
}

export interface MatchingServiceBid {
  rideRequestId: string;
  rideProviderPseudonym: string;
  amount: number;
  rating: number;
  model: string;
  estimatedArrivalTime: Date;
  passengerCount: number;
  vehiclePublicKey: string;
}

export class MatchingService extends Service<SimulationTypeMatchingService> {
  private auctions: MatchingServiceAuction[] = [];

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(id: string, latitude: number, longitude: number, radius: number) {
    super(id, 'matching_service', latitude, longitude, radius);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  async run(simulation: Simulation): Promise<void> {
    this.logger.debug('run');
    // Loop:
    while (simulation.state === 'RUNNING') {
      await wait(100);
      const currentTime = new Date().getTime();
      // Determine the winner
      for (const auction of this.auctions) {
        if (auction.auctionStatus !== 'determining-winner') {
          // Ignore auction if it's still running or was closed
          continue;
        }
        if (auction.bids.length === 0) {
          auction.auctionStatus = 'closed';
          this.logger.debug(
            'No bids for the request were found, close auction',
            {
              auction,
            }
          );
          continue;
        }
        // Vickery Auction
        let cheapestBid = auction.bids[0];
        let cheapestBidSecond = auction.bids[0];
        for (const bid of auction.bids.slice(1)) {
          if (bid.amount < cheapestBidSecond.amount) {
            if (bid.amount < cheapestBid.amount) {
              cheapestBid = bid;
              cheapestBidSecond = cheapestBid;
            } else {
              cheapestBidSecond = bid;
            }
          }
        }
        auction.auctionStatus = 'waiting-for-signature';
        auction.auctionWinner = cheapestBidSecond.rideProviderPseudonym;
        this.logger.debug(
          'Ride request auction winner determined, wait for signature',
          {auction}
        );
      }
      // Stop open auctions from receiving bids
      for (const auction of this.auctions) {
        if (auction.auctionStatus !== 'open') {
          continue;
        }
        if (
          currentTime >
          auction.auctionStartedTimestamp.getTime() +
            auction.request.maxWaitingTime
        ) {
          this.logger.debug(
            'Ride request auction reached max waiting time, determine winner',
            {auction}
          );
          auction.auctionStatus = 'determining-winner';
        }
      }
      // Purge auctions that did not result in any contract
      for (let index = 0; index < this.auctions.length; index++) {
        const auction = this.auctions[index];
        if (
          auction.auctionStatus === 'closed' &&
          auction.rideContractAddress === undefined
        ) {
          this.auctions.splice(index, 1);
          index--;
        }
      }
    }
  }

  postRequestRide(
    userId: string,
    pickupLocation: string,
    dropoffLocation: string,
    rating: number,
    userPublicKey: string,
    maxWaitingTime: number,
    minRating: number,
    minPassengerRating: number,
    maxPassengers: number,
    pickupLocationReal: {address: string} & Coordinates,
    dropoffLocationReal: {address: string} & Coordinates
  ): string {
    const requestId = getRandomId();
    this.auctions.push({
      id: requestId,

      auctionStartedTimestamp: new Date(),
      auctionStatus: 'open',
      auctionWinner: null,

      bids: [],
      request: {
        dropoffLocation,
        maxPassengers,
        maxWaitingTime,
        minPassengerRating,
        minRating,
        pickupLocation,
        rating,
        userId,
        userPublicKey,

        // Update later
        dropoffLocationReal,
        pickupLocationReal,
      },
    });
    this.logger.debug('Ride request auction was opened', {
      maxWaitingTime,
      userId,
    });
    return requestId;
  }

  postBid(
    rideRequestId: string,
    rideProviderPseudonym: string,
    amount: number,
    rating: number,
    model: string,
    estimatedArrivalTime: Date,
    passengerCount: number,
    vehiclePublicKey: string
  ) {
    const rideRequestAuction = this.auctions.find(a => a.id === rideRequestId);
    if (rideRequestAuction === undefined) {
      throw new Error('Ride request does not exist.');
    }
    if (rideRequestAuction.auctionStatus !== 'open') {
      throw new Error('Ride auction is not open.');
    }
    rideRequestAuction.bids.push({
      amount,
      estimatedArrivalTime,
      model,
      passengerCount,
      rating,
      rideProviderPseudonym,
      rideRequestId,
      vehiclePublicKey,
    });
    return rideRequestAuction;
  }

  getRideRequest(rideRequestId: string) {
    const rideRequestAuction = this.auctions.find(a => a.id === rideRequestId);
    if (rideRequestAuction) {
      return rideRequestAuction;
    }
    throw new Error('Ride request does not exist.');
  }

  // TODO Should the contract address be added somewhere in there?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSetContractAddress(rideRequestId: string, contractAddress: string) {
    const rideRequestAuction = this.auctions.find(a => a.id === rideRequestId);
    if (rideRequestAuction === undefined) {
      throw new Error('Ride request does not exist.');
    }
    rideRequestAuction.rideContractAddress = contractAddress;
    rideRequestAuction.auctionStatus = 'closed';
    this.logger.debug('Ride request auction was closed', {
      contractAddress,
      rideRequestAuction,
    });
  }

  getRideRequests() {
    return this.auctions.filter(a => a.auctionStatus === 'open');
  }

  helperSetRideProviderArrived(rideRequestId: string) {
    const rideRequestAuction = this.auctions.find(a => a.id === rideRequestId);
    if (rideRequestAuction === undefined) {
      throw new Error('Ride request does not exist.');
    }
    rideRequestAuction.helperRideProviderArrived = true;
    this.logger.debug('Ride provider arrived at customer location', {
      rideRequestAuction,
    });
  }

  // TODO: Update
  getAuctions() {
    return this.auctions;
  }

  get json(): SimulationTypeMatchingService {
    return {
      ...this.endpointService,
      type: 'matching',

      auctionsDb: this.auctions,
    };
  }
}
