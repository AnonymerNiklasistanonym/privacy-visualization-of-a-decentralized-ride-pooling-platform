const simulationEndpointsPrefix = 'json/';

export const simulationEndpoints = Object.freeze({
  graphInformation: `${simulationEndpointsPrefix}graph`,
  participantCoordinates: `${simulationEndpointsPrefix}participants`,
  participantInformationCustomer: (id: string) =>
    `${simulationEndpointsPrefix}customer/${id}`,
  participantInformationRideProvider: (id: string) =>
    `${simulationEndpointsPrefix}ride_provider/${id}`,
  participantInformationRideRequest: (id: string) =>
    `${simulationEndpointsPrefix}ride_request/${id}`,
});
