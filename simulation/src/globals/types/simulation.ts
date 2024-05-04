// This file was copied from the global types directory, do not change!

// Type imports
import type {Coordinates, CoordinatesAddress} from './coordinates';
import type {
  GetACarCustomer,
  GetACarParticipant,
  GetACarParticipantId,
  GetACarParticipantTypes,
  GetACarRideProviderCompany,
  GetACarRideProviderPerson,
} from './participant';
import type {
  GetACarRideRequest,
  GetACarRideRequestId,
  GetACarSmartContract,
  GetACarSmartContractWalletId,
} from './services';

export type SimulationEndpointParticipantId = GetACarParticipantId;

export type SimulationEndpointRideRequestId = GetACarRideRequestId;

export type SimulationEndpointSmartContractId = GetACarSmartContractWalletId;

export type SimulationEndpointParticipantTypes = GetACarParticipantTypes;

export interface SimulationEndpointParticipant {
  id: SimulationEndpointParticipantId;
}

export interface SimulationEndpointParticipantCoordinatesParticipant
  extends SimulationEndpointParticipant,
    Coordinates {}

export interface SimulationEndpointParticipantInformation
  extends SimulationEndpointParticipant,
    Omit<GetACarParticipant, 'type'> {
  /** Not undefined if there is a current route, null if the route is invalid. */
  currentRoute?: Coordinates[] | null;
  /** Not undefined if there is a current route (from OSMNX), null if the route is invalid. */
  currentRouteOsmxn?: Coordinates[] | null;
  /** Not undefined if there is currently an active ride request. */
  rideRequest?: SimulationEndpointRideRequestId;
  /** Simulation status (to debug what the actor is doing) */
  simulationStatus: string;
}

export interface SimulationEndpointParticipantInformationCustomer
  extends SimulationEndpointParticipantInformation,
    GetACarCustomer {
  /** Not undefined if currently a passenger of a ride provider. */
  passenger?: SimulationEndpointParticipantId;
}

export type SimulationEndpointParticipantInformationRideProvider =
  | SimulationEndpointParticipantInformationRideProviderPerson
  | SimulationEndpointParticipantInformationRideProviderCompany;

export interface SimulationEndpointParticipantInformationRideProviderGeneric
  extends SimulationEndpointParticipantInformation {
  /** Not undefined if currently passengers/customers are being carried. */
  passengerList?: SimulationEndpointParticipantId[];
}

export interface SimulationEndpointParticipantInformationRideProviderPerson
  extends SimulationEndpointParticipantInformationRideProviderGeneric,
    GetACarRideProviderPerson {}

export interface SimulationEndpointParticipantInformationRideProviderCompany
  extends SimulationEndpointParticipantInformationRideProviderGeneric,
    GetACarRideProviderCompany {}

export interface SimulationEndpointRideRequestInformation
  extends GetACarRideRequest {
  /** The auction status */
  auctionStatus:
    | 'open'
    | 'determining-winner'
    | 'waiting-for-signature'
    | 'closed';
  /** The auction winner pseudonym */
  auctionWinner: string;
  id: SimulationEndpointRideRequestId;
  pickupLocationCoordinates: CoordinatesAddress;
  dropoffLocationCoordinates: CoordinatesAddress;
  type: 'ride_request';
}

export interface SimulationEndpointParticipantCoordinates {
  customers: Array<SimulationEndpointParticipantCoordinatesParticipant>;
  rideProviders: Array<SimulationEndpointParticipantCoordinatesParticipant>;
}

export interface SimulationEndpointGraphInformation {
  vertices: Array<{id: number} & Coordinates>;
  geometry: Array<{id: number; geometry: Array<Coordinates>}>;
}

export interface SimulationEndpointRideRequests {
  rideRequests: Array<SimulationEndpointRideRequestId>;
}

export interface SimulationEndpointSmartContracts {
  smartContracts: Array<SimulationEndpointSmartContractId>;
}

export interface SimulationEndpointSmartContractInformation
  extends GetACarSmartContract {
  type: 'smart_contract';
}

export interface SimulationEndpointParticipantIdFromPseudonym {
  id: string;
  authServiceId: string;
}
