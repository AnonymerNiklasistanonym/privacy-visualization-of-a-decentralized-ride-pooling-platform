// Type imports
import {
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointRideRequestInformation,
  SimulationEndpointSmartContractInformation,
} from 'lib_globals';

export interface DebugData {
  customers: SimulationEndpointParticipantInformationCustomer[];
  rideProviders: SimulationEndpointParticipantInformationRideProvider[];
  rideRequests: SimulationEndpointRideRequestInformation[];
  smartContracts: SimulationEndpointSmartContractInformation[];
}
