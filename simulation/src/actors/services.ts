/* eslint-disable max-classes-per-file */
import {getRandomId, getRandomIntFromInterval} from '../misc/helpers';
import {Actor} from './actor';
import {wait} from '../misc/wait';
// Type imports
import type {Simulation} from '../simulation';
import {
  SimulationTypeCustomer,
  SimulationTypeRideProviderPerson,
  SimulationTypeRideProviderCompany,
} from './participant';
import type {Coordinates} from '../globals/types/coordinates';

export interface Area extends Coordinates {
  radius: number;
}

export interface SimulationTypeService {
  id: string;
  currentArea: Area;
  type: 'authentication' | 'matching';
}

export interface AuthenticationServiceParticipantDbEntry<ContactDetails> {
  contactDetails: ContactDetails;
  pseudonyms: string[];
}

export type AuthenticationServiceParticipantDb = (
  | AuthenticationServiceParticipantDbEntry<
      Omit<SimulationTypeCustomer, 'currentLocation' | 'type'>
    >
  | AuthenticationServiceParticipantDbEntry<
      Omit<
        SimulationTypeRideProviderPerson,
        'currentLocation' | 'type' | 'passengers'
      >
    >
  | AuthenticationServiceParticipantDbEntry<
      Omit<
        SimulationTypeRideProviderCompany,
        'currentLocation' | 'type' | 'passengers'
      >
    >
)[];

export interface SimulationTypeAuthenticationService
  extends SimulationTypeService {
  participantDb: AuthenticationServiceParticipantDb;
  type: 'authentication';
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

abstract class Service<JsonType> extends Actor<JsonType> {
  latitude: number;

  longitude: number;

  radius: number;

  constructor(
    id: string,
    type: string,
    latitude: number,
    longitude: number,
    radius: number,
    verbose = false
  ) {
    super(id, type, verbose);
    this.latitude = latitude;
    this.longitude = longitude;
    this.radius = radius;
  }
}

export class AuthenticationService extends Service<SimulationTypeAuthenticationService> {
  private participantDb: AuthenticationServiceParticipantDb;

  constructor(
    id: string,
    latitude: number,
    longitude: number,
    radius: number,
    verbose = false
  ) {
    super(id, 'auth_service', latitude, longitude, radius, verbose);
    this.participantDb = [];
  }

  /** Register a customer. */
  getRegisterCustomer(
    id: string,
    fullName: string,
    gender: string,
    dateOfBirth: string,
    emailAddress: string,
    phoneNumber: string,
    homeAddress: string
  ): void {
    this.printLog('Register customer', {
      id,
      fullName,
    });
    this.participantDb.push({
      contactDetails: {
        id,

        dateOfBirth,
        emailAddress,
        fullName,
        gender,
        homeAddress,
        phoneNumber,
      } as SimulationTypeCustomer,
      pseudonyms: [],
    });
  }

  /** Register a ride provider. */
  getRegisterRideProvider(
    id: string,
    fullName: string,
    gender: string,
    dateOfBirth: string,
    emailAddress: string,
    phoneNumber: string,
    homeAddress: string,
    vehicleNumberPlate: string,
    vehicleIdentificationNumber: string
  ): void {
    this.printLog('Register ride provider', {
      id,
      fullName,
    });
    this.participantDb.push({
      contactDetails: {
        id,

        dateOfBirth,
        emailAddress,
        fullName,
        gender,
        homeAddress,
        phoneNumber,

        vehicleIdentificationNumber,
        vehicleNumberPlate,
      } satisfies Omit<
        SimulationTypeRideProviderPerson,
        'type' | 'currentLocation' | 'passengers'
      >,
      pseudonyms: [],
    });
  }

  /** Register a ride provider from a company. */
  getRegisterRideProviderCompany(
    id: string,
    vehicleNumberPlate: string,
    vehicleIdentificationNumber: string,
    company: string
  ): void {
    this.printLog('Register ride provider company', {
      id,
      vehicleNumberPlate,
      vehicleIdentificationNumber,
    });
    this.participantDb.push({
      contactDetails: {
        id,

        company,

        vehicleIdentificationNumber,
        vehicleNumberPlate,
      } satisfies Omit<
        SimulationTypeRideProviderCompany,
        'type' | 'currentLocation' | 'passengers'
      >,
      pseudonyms: [],
    });
  }

  getVerify(id: string): string {
    const participant = this.participantDb.find(
      a => a.contactDetails.id === id
    );
    if (participant) {
      const newPseudonym = getRandomId();
      participant.pseudonyms.push(newPseudonym);
      return newPseudonym;
    }
    throw Error(
      `Participant tried to verify but was not in the database (id=${id})`
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  getRating(participantId: string): number {
    // TODO
    return getRandomIntFromInterval(3, 5);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  run(simulation: Simulation): Promise<void> {
    throw new Error('Method not implemented.');
  }

  get json(): SimulationTypeAuthenticationService {
    return {
      id: this.id,

      currentArea: {
        lat: this.latitude,
        long: this.longitude,
        radius: this.radius,
      },
      participantDb: this.participantDb,

      type: 'authentication',
    };
  }
}

export class MatchingService extends Service<SimulationTypeMatchingService> {
  private auctions: MatchingServiceAuction[] = [];

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(
    id: string,
    latitude: number,
    longitude: number,
    radius: number,
    verbose = false
  ) {
    super(id, 'matching_service', latitude, longitude, radius, verbose);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  async run(simulation: Simulation): Promise<void> {
    this.printLog('run');
    // Loop:
    while (simulation.state === 'RUNNING') {
      await wait(1 * 1000);
      const currentTime = new Date().getTime();
      // Determine the winner
      for (const auction of this.auctions) {
        if (auction.auctionStatus !== 'determining-winner') {
          continue;
        }
        if (auction.bids.length === 0) {
          auction.auctionStatus = 'closed';
          this.printLog('No bids for the request were found, close auction', {
            auction,
          });
          continue;
        }
        // TODO Implement Vickery Auction
        let cheapestBid = auction.bids[0];
        let cheapestBidSecond = auction.bids[0];
        for (const bid of auction.bids) {
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
        this.printLog(
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
          this.printLog(
            'Ride request auction reached max waiting time, determine winner',
            {auction}
          );
          auction.auctionStatus = 'determining-winner';
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
        pickupLocationReal,
        dropoffLocationReal,
      },
    });
    this.printLog('Ride request auction was opened', {
      userId,
      maxWaitingTime,
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
      rideRequestId,
      rideProviderPseudonym,
      amount,
      rating,
      model,
      estimatedArrivalTime,
      passengerCount,
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
    rideRequestAuction.auctionStatus = 'closed';
    this.printLog('Ride request auction was closed', {
      rideRequestAuction,
      contractAddress,
    });
  }

  getRideRequests() {
    return this.auctions.filter(a => a.auctionStatus === 'open');
  }

  // TODO: Update
  getAuctions() {
    return this.auctions;
  }

  get json(): SimulationTypeMatchingService {
    return {
      id: this.id,

      auctionsDb: this.auctions,
      currentArea: {
        lat: this.latitude,
        long: this.longitude,
        radius: this.radius,
      },

      type: 'matching',
    };
  }
}
