// This file was copied from the global types directory, do not change!

import type {Coordinates} from './coordinates';
import type {GetACarParticipantPersonContactDetails} from './participant';

export interface SimulationEndpointParticipantCoordinatesParticipant
  extends Coordinates {
  id: string;
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
