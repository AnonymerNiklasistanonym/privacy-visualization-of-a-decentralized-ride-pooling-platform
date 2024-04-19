// Type imports
import type {Coordinates, CoordinatesAddress} from './coordinates';
import type {
  GetACarCustomer,
  GetACarParticipantPersonContactDetails,
  GetACarRideProviderPerson,
  GetACarRideProviderCompany,
  GetACarParticipant,
} from './participant';
import type {GetACarRideRequest} from './services';

export type SimulationEndpointParticipantId = string;

export type SimulationEndpointRideRequestId = string;

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

export interface SimulationEndpointParticipantInformationRideProviderPerson
  extends SimulationEndpointParticipantInformation,
    GetACarRideProviderPerson {
  /** Not undefined if currently passengers/customers are being carried. */
  passengerList?: SimulationEndpointParticipantId[];
}

export interface SimulationEndpointParticipantInformationRideProviderCompany
  extends SimulationEndpointParticipantInformation,
    GetACarRideProviderCompany {
  /** Not undefined if currently passengers/customers are being carried. */
  passengerList?: SimulationEndpointParticipantId[];
}

export interface SimulationEndpointParticipantInformationRideRequest
  extends GetACarRideRequest {
  id: SimulationEndpointRideRequestId;
  pickupLocationCoordinates: CoordinatesAddress;
  dropoffLocationCoordinates: CoordinatesAddress;
}

export interface SimulationEndpointParticipantCoordinates {
  customers: Array<SimulationEndpointParticipantCoordinatesParticipant>;
  rideProviders: Array<SimulationEndpointParticipantCoordinatesParticipant>;
}

export interface SimulationEndpointGraph {
  vertices: Array<Coordinates>;
  edges: Array<[Coordinates, Coordinates]>;
}

export interface SimulationEndpointCustomer
  extends GetACarParticipantPersonContactDetails {
  id: string;
  // TODO: Ride requests / passenger
}
