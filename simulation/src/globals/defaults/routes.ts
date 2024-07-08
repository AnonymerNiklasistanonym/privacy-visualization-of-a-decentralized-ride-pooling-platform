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
    participantPseudonymsFromId: (id: string) =>
      `/participant_pseudonyms_from_id/${id}`,
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
    rideRequest: (id: string) => `/ride_request/${id}`,
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
