import {
  SimulationTypeCustomer,
  SimulationTypeRideProviderCompany,
  SimulationTypeRideProviderPerson,
} from './participants';

export interface Area {
  lat: number;
  lon: number;
  radius: number;
}

export interface Service {
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
      Omit<SimulationTypeRideProviderPerson, 'currentLocation' | 'type'>
    >
  | AuthenticationServiceParticipantDbEntry<
      Omit<SimulationTypeRideProviderCompany, 'currentLocation' | 'type'>
    >
)[];

export interface AuthenticationService extends Service {
  participantDb: AuthenticationServiceParticipantDb;
  type: 'authentication';
}

export interface MatchingService extends Service {
  auctionsDb: MatchingServiceAuction[];
  type: 'matching';
}

export interface MatchingServiceAuction {
  id: string;
  request: MatchingServiceRequest;
  startTime: Date;
  bids: MatchingServiceBid[];
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
}

export interface MatchingServiceBid {}

// TODO
