// This file was copied from the global types directory, do not change!

export const simulationEndpointRoutes = Object.freeze({
  json: Object.freeze({
    route: '/json',

    // Routes
    graphInformation: '/graph',
    participantCoordinates: '/participant_coordinates',
    participantInformationCustomer: (id: string) =>
      `/participant_customer/${id}`,
    participantInformationRideProvider: (id: string) =>
      `/participant_ride_provider/${id}`,
    rideRequestInformation: (id: string) => `/ride_request/${id}`,
    rideRequests: '/ride_requests',
    shortestPath: '/shortest_path',
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
  json: Object.freeze({
    graphInformation: `${simulationEndpointRoutes.json.route}${simulationEndpointRoutes.json.graphInformation}`,
    participantCoordinates: `${simulationEndpointRoutes.json.route}${simulationEndpointRoutes.json.participantCoordinates}`,
    participantInformationCustomer: (id: string) =>
      `${
        simulationEndpointRoutes.json.route
      }${simulationEndpointRoutes.json.participantInformationCustomer(id)}`,
    participantInformationRideProvider: (id: string) =>
      `${
        simulationEndpointRoutes.json.route
      }${simulationEndpointRoutes.json.participantInformationRideProvider(id)}`,
    rideRequestInformation: (id: string) =>
      `${
        simulationEndpointRoutes.json.route
      }${simulationEndpointRoutes.json.rideRequestInformation(id)}`,
    rideRequests: `${simulationEndpointRoutes.json.route}${simulationEndpointRoutes.json.rideRequests}`,
    shortestPath: `${simulationEndpointRoutes.json.route}${simulationEndpointRoutes.json.shortestPath}`,
  }),
  simulation: Object.freeze({
    pause: `${simulationEndpointRoutes.simulation.route}${simulationEndpointRoutes.simulation.pause}`,
    run: `${simulationEndpointRoutes.simulation.route}${simulationEndpointRoutes.simulation.run}`,
    state: `${simulationEndpointRoutes.simulation.route}${simulationEndpointRoutes.simulation.state}`,
  }),
});

export const pathfinderEndpoints = Object.freeze({
  graphInformation: 'graph',
  shortestPath: 'shortest_path',
  shortestPathCoordinates: 'shortest_path_coordinates',
});
