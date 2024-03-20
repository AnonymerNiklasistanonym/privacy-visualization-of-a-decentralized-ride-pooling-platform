/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
import type { SmartContract as SmartContractType } from './types/blockchain';
import type { SimulationTypeRideProvider as RideProviderType, SimulationTypeCustomer as CustomerType } from './types/participants';
import type { AuthenticationService as AuthenticationServiceType, MatchingService as MatchingServiceType } from './types/services';
import { Customer, RideProvider } from './actors/participant';
import { AuthenticationService, MatchingService } from './actors/services';
import SmartContract from './actors/smartContract';
import { getRandomElement, getRandomId, getRandomIntFromInterval } from './misc/helpers';

export interface SimulationConfigCity {
  name: string
  latitude: number
  latitudeRadius: number
  longitude: number
  longitudeRadius: number
}

export interface SimulationConfig {
  customerCount: number
  rideProviderCount: number
  authenticationServiceCount: number
  matchingServiceCount: number
  cities: SimulationConfigCity[]
  /** How many seconds should be simulated per second */
  speedInSecPerSec: number
}

export interface StartPos {
  latitude: number
  longitude: number
  zoom: number
}

export class Simulation {
  customerObjects: Customer[];

  rideProviderObjects: RideProvider[];

  authenticationServiceObjects: AuthenticationService[];

  matchingServiceObjects: MatchingService[];

  smartContractObjects: SmartContract[];

  startPos: StartPos;

  state: "RUNNING" | "PAUSED" | "STOPPED" = "RUNNING"

  constructor(config: SimulationConfig) {
    // TODO Use latitudeRadius, longitudeRadius
    // TODO Integrate simulation speed and clock
    // Create participants
    this.customerObjects = [];
    for (let index = 0; index < config.customerCount; index++) {
      const id = `customer_${getRandomId()}`;
      const city = getRandomElement(config.cities);
      this.customerObjects.push(new Customer(id, `${id}_name`, `${id}_full_name`, `${id}_birthday`, `${id}_address`, city.latitude + (getRandomIntFromInterval(-100, 100) * 0.001), city.longitude + (getRandomIntFromInterval(-100, 100) * 0.001)));
    }
    this.rideProviderObjects = [];
    for (let index = 0; index < config.rideProviderCount; index++) {
      const id = `ride_provider_${getRandomId()}`;
      const city = getRandomElement(config.cities);
      this.rideProviderObjects.push(new RideProvider(id, `${id}_name`, `${id}_full_name`, `${id}_birthday`, `${id}_address`, city.latitude + (getRandomIntFromInterval(-100, 100) * 0.001), city.longitude + (getRandomIntFromInterval(-100, 100) * 0.001)));
    }
    // Create services
    this.authenticationServiceObjects = [];
    for (let index = 0; index < config.authenticationServiceCount; index++) {
      const id = `as_${getRandomId()}`;
      const city = getRandomElement(config.cities);
      this.authenticationServiceObjects.push(new AuthenticationService(id, city.latitude + (getRandomIntFromInterval(-100, 100) * 0.001), city.longitude + (getRandomIntFromInterval(-100, 100) * 0.001), getRandomIntFromInterval(5000, 20000)));
    }
    for (let index = 0; index < this.customerObjects.length; index++) {
      const as = getRandomElement(this.authenticationServiceObjects);
      const currentCustomer = this.customerObjects[index];
      as.register(currentCustomer.publicId, currentCustomer.name, currentCustomer.fullName, currentCustomer.birthday, currentCustomer.address);
    }
    for (let index = 0; index < this.rideProviderObjects.length; index++) {
      const as = getRandomElement(this.authenticationServiceObjects);
      const currentRideProvider = this.rideProviderObjects[index];
      as.register(currentRideProvider.publicId, currentRideProvider.name, currentRideProvider.fullName, currentRideProvider.birthday, currentRideProvider.address);
    }
    this.matchingServiceObjects = [];
    for (let index = 0; index < config.matchingServiceCount; index++) {
      const id = `ms_${getRandomId()}`;
      const city = getRandomElement(config.cities);
      this.matchingServiceObjects.push(new MatchingService(id, city.latitude + (getRandomIntFromInterval(-100, 100) * 0.001), city.longitude + (getRandomIntFromInterval(-100, 100) * 0.001), getRandomIntFromInterval(5000, 20000)));
    }
    this.smartContractObjects = [];
    this.startPos = { ...config.cities[0], zoom: 13 };
  }

  run(timeStep = 1): void {
    // eslint-disable-next-line no-restricted-syntax
    for (const customerObject of this.customerObjects) {
      customerObject.run(timeStep, this);
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const rideProviderObject of this.rideProviderObjects) {
      rideProviderObject.run(timeStep, this);
    }
  }

  get rideProviders(): RideProviderType[] {
    return this.rideProviderObjects.map((a) => a.json);
  }

  get customers(): CustomerType[] {
    return this.customerObjects.map((a) => a.json);
  }

  get authenticationServices(): AuthenticationServiceType[] {
    return this.authenticationServiceObjects.map((a) => a.json);
  }

  get matchingServices(): MatchingServiceType[] {
    return this.matchingServiceObjects.map((a) => a.json);
  }

  get smartContracts(): SmartContractType[] {
    return this.smartContractObjects.map((a) => a.json);
  }
}
