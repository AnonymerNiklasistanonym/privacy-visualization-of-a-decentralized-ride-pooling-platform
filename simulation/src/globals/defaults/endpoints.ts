// This file was copied from the global types directory, do not change!

export const simulationEndpointPrefixes = Object.freeze({
  json: 'json/',
});

export const simulationEndpoints = Object.freeze({
  graphInformation: `${simulationEndpointPrefixes.json}graph`,
  participantCoordinates: `${simulationEndpointPrefixes.json}participants`,
  participantInformationCustomer: (id: string) =>
    `${simulationEndpointPrefixes.json}customer/${id}`,
  participantInformationRideProvider: (id: string) =>
    `${simulationEndpointPrefixes.json}ride_provider/${id}`,
  participantInformationRideRequest: (id: string) =>
    `${simulationEndpointPrefixes.json}ride_request/${id}`,
});

export const pathfinderEndpoints = Object.freeze({
  graphInformation: 'graph',
  shortestPath: 'shortest_path',
  shortestPathCoordinates: 'shortest_path_coordinates',
});
