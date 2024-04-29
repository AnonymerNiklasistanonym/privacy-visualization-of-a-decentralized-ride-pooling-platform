// Type imports
import {
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointRideRequestInformation,
  SimulationEndpointSmartContractInformation,
} from '@globals/types/simulation';

export interface DebugData {
  customers: SimulationEndpointParticipantInformationCustomer[];
  rideProviders: SimulationEndpointParticipantInformationRideProvider[];
  rideRequests: SimulationEndpointRideRequestInformation[];
  smartContracts: SimulationEndpointSmartContractInformation[];
}
