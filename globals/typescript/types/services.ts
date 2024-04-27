export type GetACarRideRequestId = string;

export interface GetACarRideRequest {
  id: GetACarRideRequestId;
  /** Customer pseudonym. */
  userId: string;
  /** Cloaked h3 hexagon of the real pickup location. */
  pickupLocation: string;
  /** Cloaked h3 hexagon of the real dropoff location. */
  dropoffLocation: string;
  /** Customer rating (self reported). */
  rating: number;
  /** Enables encrypted communication with ride provider. */
  userPublicKey: string;
  maxWaitingTime: number;
  minRating: number;
  minPassengerRating: number;
  maxPassengers: number;
}
