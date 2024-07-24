// This file was copied from the global types directory, do not change!

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
  time: string;
}

export type GetACarSmartContractWalletId = string;

export interface GetACarSmartContract {
  walletId: GetACarSmartContractWalletId;
  /** Customer pseudonym. */
  customerId: string;
  /** Ride Provider pseudonym. */
  rideProviderId: string;
  customerRating: number;
  rideProviderRating: number;
  time: string;
  deposit: number;
}
