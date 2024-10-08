// Local imports
import {simulationEndpoint as ser} from './routes';

export const simulation = Object.freeze({
  apiV1: Object.freeze({
    graphInformation: `${ser.apiV1.route}${ser.apiV1.graphInformation}`,
    participantCoordinates: `${ser.apiV1.route}${ser.apiV1.participantCoordinates}`,
    participantIdFromPseudonym: (pseudonym: string) =>
      `${ser.apiV1.route}${ser.apiV1.participantIdFromPseudonym(pseudonym)}`,
    participantInformationCustomer: (id: string) =>
      `${ser.apiV1.route}${ser.apiV1.participantInformationCustomer(id)}`,
    participantInformationRideProvider: (id: string) =>
      `${ser.apiV1.route}${ser.apiV1.participantInformationRideProvider(id)}`,
    participantPseudonymsFromId: (id: string) =>
      `${ser.apiV1.route}${ser.apiV1.participantPseudonymsFromId(id)}`,
    rideRequestInformation: (id: string) =>
      `${ser.apiV1.route}${ser.apiV1.rideRequestInformation(id)}`,
    rideRequests: `${ser.apiV1.route}${ser.apiV1.rideRequests}`,
    rideRequestsFromSmartContract: (id: string) =>
      `${ser.apiV1.route}${ser.apiV1.rideRequestsFromSmartContract(id)}`,
    shortestPath: `${ser.apiV1.route}${ser.apiV1.shortestPath}`,
    smartContract: (id: string) =>
      `${ser.apiV1.route}${ser.apiV1.smartContract(id)}`,
    smartContracts: (offset = 0, limit = -1) =>
      `${ser.apiV1.route}${ser.apiV1.smartContracts}?offset=${offset}&limit=${limit}`,
    smartContractsFromParticipant: (id: string) =>
      `${ser.apiV1.route}${ser.apiV1.smartContractsFromParticipant(id)}`,
  }),
  internal: Object.freeze({
    authenticationServices: `${ser.internal.route}${ser.internal.authenticationServices}`,
    customers: `${ser.internal.route}${ser.internal.customers}`,
    matchingServices: `${ser.internal.route}${ser.internal.matchingServices}`,
    rideProviders: `${ser.internal.route}${ser.internal.rideProviders}`,
    rideRequest: (id: string) =>
      `${ser.apiV1.route}${ser.internal.rideRequest(id)}`,
    rideRequests: `${ser.internal.route}${ser.internal.rideRequests}`,
    smartContracts: `${ser.internal.route}${ser.internal.smartContracts}`,
  }),
  simulation: Object.freeze({
    pause: `${ser.simulation.route}${ser.simulation.pause}`,
    run: `${ser.simulation.route}${ser.simulation.run}`,
    state: `${ser.simulation.route}${ser.simulation.state}`,
  }),
});

export const pathfinder = Object.freeze({
  graphInformation: '/graph',
  running: '/running',
  shortestPath: '/shortest_path',
  shortestPathCoordinates: '/shortest_path_coordinates',
  updateConfig: '/update_config',
});
