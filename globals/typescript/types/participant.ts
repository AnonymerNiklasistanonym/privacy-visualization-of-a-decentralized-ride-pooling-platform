import type {Coordinates} from './coordinates';

export type GetACarParticipantId = string;
export type GetACarParticipantTypeCustomer = 'customer';
export type GetACarParticipantTypeRideProvider = 'ride_provider';
export type GetACarParticipantTypes =
  | GetACarParticipantTypeCustomer
  | GetACarParticipantTypeRideProvider;

/**
 * Represents a participant of the GETACAR platform.
 */
export interface GetACarParticipant {
  id: GetACarParticipantId;
  currentLocation: Coordinates;
  type: GetACarParticipantTypes;
}

/**
 * Represents the contact details of a participant that is a person of the GETACAR platform.
 */
export interface GetACarParticipantPersonContactDetails {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  emailAddress: string;
  phoneNumber: string;
  homeAddress: string;
}

/**
 * Represents a customer of the GETACAR platform.
 */
export interface GetACarCustomer
  extends GetACarParticipant,
    GetACarParticipantPersonContactDetails {
  type: GetACarParticipantTypeCustomer;
}

/**
 * Represents a ride provider of the GETACAR platform.
 */
export type GetACarRideProvider =
  | GetACarRideProviderPerson
  | GetACarRideProviderCompany;

export interface GetACarRideProviderGeneric extends GetACarParticipant {
  vehicleNumberPlate: string;
  vehicleIdentificationNumber: string;
  type: GetACarParticipantTypeRideProvider;
}

export interface GetACarRideProviderPerson
  extends GetACarRideProviderGeneric,
    GetACarParticipantPersonContactDetails {}

export interface GetACarRideProviderCompany extends GetACarRideProviderGeneric {
  company: string;
}

export interface GetACarRideRequest {
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
