import express from 'express';
import {Customer} from './actors/customer';
import {RideProviderCompany, RideProviderPerson} from './actors/rideProvider';
import {AuthenticationService, MatchingService} from './actors/services';
import {SmartContract} from './actors/smartContract';
import {
  getRandomElement,
  getRandomId,
  getRandomIntFromInterval,
} from './misc/helpers';
// Type imports
import type {SmartContract as SmartContractType} from './types/blockchain';
import type {
  SimulationTypeCustomer as CustomerType,
  SimulationTypeRideProvider as RideProviderType,
} from './types/participants';
import type {
  AuthenticationService as AuthenticationServiceType,
  MatchingService as MatchingServiceType,
} from './types/services';
import type {SimulationConfigWithData} from './config/simulationConfigWithData';

export interface StartPos {
  lat: number;
  lon: number;
  zoom: number;
}

export class Simulation {
  // Properties
  public customerObjects: Customer[];

  public rideProviderObjects: (RideProviderPerson | RideProviderCompany)[];

  public authenticationServiceObjects: AuthenticationService[];

  public matchingServiceObjects: MatchingService[];

  public smartContractObjects: SmartContract[];

  public startPos: StartPos;

  public state: 'ACTIVE' | 'PAUSED' | 'INACTIVE' = 'ACTIVE';

  constructor(config: SimulationConfigWithData) {
    // Create participants
    this.customerObjects = [];
    for (let index = 0; index < config.customer.count; index++) {
      const id = `customer_${getRandomId()}`;
      const city = getRandomElement(config.citiesData);
      const randLocation = getRandomElement(city.places);
      const fakePerson = config.peopleData[index];
      this.customerObjects.push(
        new Customer(
          id,
          fakePerson.fullName,
          /[0-9]*(?<gender>\S*)/.exec(fakePerson.gender)?.groups?.gender ||
            fakePerson.gender,
          fakePerson.dateOfBirth,
          fakePerson.emailAddress,
          fakePerson.phoneNumber,
          `${randLocation.postcode} ${randLocation.city} ${randLocation.street} ${randLocation.houseNumber}`,
          {lat: randLocation.lat, lon: randLocation.lon}
        )
      );
    }
    this.rideProviderObjects = [];
    for (let index = 0; index < config.rideProvider.countPerson; index++) {
      const id = `ride_provider_${getRandomId()}`;
      const city = getRandomElement(config.citiesData);
      const randLocation = getRandomElement(city.places);
      const fakePerson = config.peopleData[index + config.customer.count];
      this.rideProviderObjects.push(
        new RideProviderPerson(
          id,
          {lat: randLocation.lat, lon: randLocation.lon},
          `${id}_vehicleNumberPlate`,
          `${id}_vehicleIdentificationNumber`,

          fakePerson.fullName,
          /[0-9]*(?<gender>\S*)/.exec(fakePerson.gender)?.groups?.gender ||
            fakePerson.gender,
          fakePerson.dateOfBirth,
          fakePerson.emailAddress,
          fakePerson.phoneNumber,
          `${randLocation.postcode} ${randLocation.city} ${randLocation.street} ${randLocation.houseNumber}`
        )
      );
    }
    // Create services
    this.authenticationServiceObjects = [];
    for (let index = 0; index < config.authenticationService.count; index++) {
      const id = `as_${getRandomId()}`;
      const city = getRandomElement(config.citiesData);
      this.authenticationServiceObjects.push(
        new AuthenticationService(
          id,
          city.lat + getRandomIntFromInterval(-100, 100) * 0.001,
          city.lon + getRandomIntFromInterval(-100, 100) * 0.001,
          getRandomIntFromInterval(5000, 20000)
        )
      );
    }
    this.matchingServiceObjects = [];
    for (let index = 0; index < config.matchingService.count; index++) {
      const id = `ms_${getRandomId()}`;
      const city = getRandomElement(config.citiesData);
      this.matchingServiceObjects.push(
        new MatchingService(
          id,
          city.lat + getRandomIntFromInterval(-100, 100) * 0.001,
          city.lon + getRandomIntFromInterval(-100, 100) * 0.001,
          getRandomIntFromInterval(5000, 20000)
        )
      );
    }
    this.smartContractObjects = [];
    this.startPos = {
      lat: config.citiesData[0].lat,
      lon: config.citiesData[0].lon,
      zoom: 13,
    };
  }

  /** Run simulation */
  run(): void {
    this.state = 'ACTIVE';
    // eslint-disable-next-line no-restricted-syntax
    for (const customerObject of this.customerObjects) {
      customerObject.run(this);
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const rideProviderObject of this.rideProviderObjects) {
      rideProviderObject.run(this);
    }
  }

  pause(): void {
    this.state = 'PAUSED';
  }

  resume(): void {
    this.state = 'ACTIVE';
  }

  // Debug methods

  get rideProviders(): RideProviderType[] {
    return this.rideProviderObjects.map(a => a.json);
  }

  get customers(): CustomerType[] {
    return this.customerObjects.map(a => a.json);
  }

  get authenticationServices(): AuthenticationServiceType[] {
    return this.authenticationServiceObjects.map(a => a.json);
  }

  get matchingServices(): MatchingServiceType[] {
    return this.matchingServiceObjects.map(a => a.json);
  }

  get smartContracts(): SmartContractType[] {
    return this.smartContractObjects.map(a => a.json);
  }

  // Frontend routes

  generateFrontendRoutes(): express.Router {
    const router = express.Router();
    router.route('/customers').get((req, res) => {
      res.json({customers: this.customers});
    });
    router.route('/ride_providers').get((req, res) => {
      res.json({rideProviders: this.rideProviders});
    });
    router.route('/authentication_services').get((req, res) => {
      res.json({authenticationServices: this.authenticationServices});
    });
    router.route('/matching_services').get((req, res) => {
      res.json({matchingServices: this.matchingServices});
    });
    router.route('/smart_contracts').get((req, res) => {
      res.json({smartContracts: this.smartContracts});
    });
    return router;
  }
}
