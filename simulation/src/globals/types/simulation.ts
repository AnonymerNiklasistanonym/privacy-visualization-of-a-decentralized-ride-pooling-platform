// This file was copied from the global types directory, do not change!

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

// TODO Update later
export interface SimulationEndpointParticipantInformationMisc {
  /** Not undefined if there is currently an active ride request. */
  rideRequest?: SimulationEndpointRideRequestId;
  /** Not undefined if currently passenger of a ride provider. */
  passenger?: SimulationEndpointParticipantId;
}

export interface SimulationEndpointParticipantInformation
  extends SimulationEndpointParticipant,
    GetACarParticipant {
  /** Not undefined if there is a current route, null if the route is invalid. */
  currentRoute?: Coordinates[] | null;
  /** Not undefined if there is a current route (from OSMNX), null if the route is invalid. */
  currentRouteOsmxn?: Coordinates[] | null;
}

export interface SimulationEndpointParticipantInformationCustomer
  extends SimulationEndpointParticipant,
    GetACarCustomer,
    SimulationEndpointParticipantInformationMisc {}

export type SimulationEndpointParticipantInformationRideProvider =
  | SimulationEndpointParticipantInformationRideProviderPerson
  | SimulationEndpointParticipantInformationRideProviderCompany;

export interface SimulationEndpointParticipantInformationRideProviderPerson
  extends SimulationEndpointParticipant,
    GetACarRideProviderPerson,
    SimulationEndpointParticipantInformationMisc {}

export interface SimulationEndpointParticipantInformationRideProviderCompany
  extends SimulationEndpointParticipant,
    GetACarRideProviderCompany,
    SimulationEndpointParticipantInformationMisc {}

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

export interface SimulationEndpointCustomer
  extends GetACarParticipantPersonContactDetails {
  id: string;
  // TODO: Ride requests / passenger
}
