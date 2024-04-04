export interface Coordinates {
  latitude: number
  longitude: number
}

export interface SimulationTypeParticipant {
  id: string
  currentLocation: Coordinates
  type: "customer" | "ride_provider"
}

export interface SimulationTypeCustomer extends SimulationTypeParticipant {
  fullName: string
  gender: string
  dateOfBirth: string
  emailAddress: string
  phoneNumber: string
  homeAddress: string
  type: "customer"
}

export type SimulationTypeRideProvider = SimulationTypeRideProviderPerson | SimulationTypeRideProviderCompany;

interface RideProviderGeneric extends SimulationTypeParticipant {
  vehicleNumberPlate: string
  vehicleIdentificationNumber: string
  type: "ride_provider"
}

export interface SimulationTypeRideProviderPerson extends RideProviderGeneric, Omit<SimulationTypeCustomer, "type"> { }

export interface SimulationTypeRideProviderCompany extends RideProviderGeneric, Omit<SimulationTypeParticipant, "type"> {
  company: string
}
