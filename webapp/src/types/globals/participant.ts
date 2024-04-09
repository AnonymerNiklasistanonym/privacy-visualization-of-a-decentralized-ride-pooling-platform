// This file was copied from the global types directory, do not change!

import type {Coordinates} from './coordinates';

export type GetACarParticipantIdCustomer = 'customer';
export type GetACarParticipantIdRideProvider = 'ride_provider';
export type GetACarParticipantIds =
  | GetACarParticipantIdCustomer
  | GetACarParticipantIdRideProvider;

/**
 * Represents a participant of the GETACAR platform.
 */
export interface GetACarParticipant {
  id: string;
  currentLocation: Coordinates;
  type: GetACarParticipantIds;
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
  type: GetACarParticipantIdCustomer;
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
  type: GetACarParticipantIdRideProvider;
}

export interface GetACarRideProviderPerson
  extends GetACarRideProviderGeneric,
    GetACarParticipantPersonContactDetails {}

export interface GetACarRideProviderCompany extends GetACarRideProviderGeneric {
  company: string;
}
