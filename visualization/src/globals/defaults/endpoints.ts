// This file was copied from the global types directory, do not change!

export const simulationEndpointRoutes = Object.freeze({
  apiV1: Object.freeze({
    route: '/apiv1',

    // Routes
    graphInformation: '/graph',
    participantCoordinates: '/participant_coordinates',
    participantIdFromPseudonym: (pseudonym: string) =>
      `/participant_id_from_pseudonym/${pseudonym}`,
    participantInformationCustomer: (id: string) =>
      `/participant_customer/${id}`,
    participantInformationRideProvider: (id: string) =>
      `/participant_ride_provider/${id}`,
    rideRequestInformation: (id: string) => `/ride_request/${id}`,
    rideRequests: '/ride_requests',
    shortestPath: '/shortest_path',
    smartContract: (id: string) => `/smart_contract/${id}`,
    smartContracts: '/smart_contracts',
  }),

  // Routes only used internally
  internal: Object.freeze({
    route: '/internal',

    // Routes
    authenticationServices: '/authentication_services',
    customers: '/customers',
    matchingServices: '/matching_services',
    rideProviders: '/ride_providers',
    rideRequests: '/ride_requests',
    smartContracts: '/smart_contracts',
  }),

  simulation: Object.freeze({
    route: '/simulation',

    // Routes
    pause: '/pause',
    run: '/run',
    state: '/state',
  }),
});

export const simulationEndpoints = Object.freeze({
  apiV1: Object.freeze({
    graphInformation: `${simulationEndpointRoutes.apiV1.route}${simulationEndpointRoutes.apiV1.graphInformation}`,
    participantCoordinates: `${simulationEndpointRoutes.apiV1.route}${simulationEndpointRoutes.apiV1.participantCoordinates}`,
    participantIdFromPseudonym: (pseudonym: string) =>
      `${
        simulationEndpointRoutes.apiV1.route
      }${simulationEndpointRoutes.apiV1.participantIdFromPseudonym(pseudonym)}`,
    participantInformationCustomer: (id: string) =>
      `${
        simulationEndpointRoutes.apiV1.route
      }${simulationEndpointRoutes.apiV1.participantInformationCustomer(id)}`,
    participantInformationRideProvider: (id: string) =>
      `${
        simulationEndpointRoutes.apiV1.route
      }${simulationEndpointRoutes.apiV1.participantInformationRideProvider(
        id
      )}`,
    rideRequestInformation: (id: string) =>
      `${
        simulationEndpointRoutes.apiV1.route
      }${simulationEndpointRoutes.apiV1.rideRequestInformation(id)}`,
    rideRequests: `${simulationEndpointRoutes.apiV1.route}${simulationEndpointRoutes.apiV1.rideRequests}`,
    shortestPath: `${simulationEndpointRoutes.apiV1.route}${simulationEndpointRoutes.apiV1.shortestPath}`,
    smartContract: (id: string) =>
      `${
        simulationEndpointRoutes.apiV1.route
      }${simulationEndpointRoutes.apiV1.smartContract(id)}`,
    smartContracts: `${simulationEndpointRoutes.apiV1.route}${simulationEndpointRoutes.apiV1.smartContracts}`,
  }),
  internal: Object.freeze({
    authenticationServices: `${simulationEndpointRoutes.internal.route}${simulationEndpointRoutes.internal.authenticationServices}`,
    customers: `${simulationEndpointRoutes.internal.route}${simulationEndpointRoutes.internal.customers}`,
    matchingServices: `${simulationEndpointRoutes.internal.route}${simulationEndpointRoutes.internal.matchingServices}`,
    rideProviders: `${simulationEndpointRoutes.internal.route}${simulationEndpointRoutes.internal.rideProviders}`,
    rideRequests: `${simulationEndpointRoutes.internal.route}${simulationEndpointRoutes.internal.rideRequests}`,
    smartContracts: `${simulationEndpointRoutes.internal.route}${simulationEndpointRoutes.internal.smartContracts}`,
  }),
  simulation: Object.freeze({
    pause: `${simulationEndpointRoutes.simulation.route}${simulationEndpointRoutes.simulation.pause}`,
    run: `${simulationEndpointRoutes.simulation.route}${simulationEndpointRoutes.simulation.run}`,
    state: `${simulationEndpointRoutes.simulation.route}${simulationEndpointRoutes.simulation.state}`,
  }),
});

export const pathfinderEndpoints = Object.freeze({
  graphInformation: '/graph',
  shortestPath: '/shortest_path',
  shortestPathCoordinates: '/shortest_path_coordinates',
});
