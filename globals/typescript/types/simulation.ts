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
import type {GetACarRideRequest, GetACarRideRequestId} from './services';

export type SimulationEndpointParticipantId = GetACarParticipantId;

export type SimulationEndpointRideRequestId = GetACarRideRequestId;

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
