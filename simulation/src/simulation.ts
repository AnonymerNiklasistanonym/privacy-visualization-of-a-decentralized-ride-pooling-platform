import express from 'express';
import {Blockchain} from './actors/blockchain';
import {Customer} from './actors/customer';
import {RideProviderCompany, RideProviderPerson} from './actors/rideProvider';
import {AuthenticationService, MatchingService} from './actors/services';
import {
  getRandomElement,
  getRandomId,
  getRandomIntFromInterval,
} from './misc/helpers';
// Type imports
import type {Coordinates} from './misc/coordinates';
import type {SimulationConfigWithData} from './config/simulationConfigWithData';

export interface StartPos extends Coordinates {
  zoom: number;
}

export class Simulation {
  // Properties
  public customerObjects: Customer[];

  public rideProviderObjects: (RideProviderPerson | RideProviderCompany)[];

  public authenticationServiceObjects: AuthenticationService[];

  public matchingServiceObjects: MatchingService[];

  public blockchain: Blockchain;

  public startPos: StartPos;

  public availableLocations;

  public state: 'ACTIVE' | 'PAUSED' | 'INACTIVE' = 'ACTIVE';

  constructor(config: SimulationConfigWithData) {
    // Create participants
    this.customerObjects = [];
    for (let index = 0; index < config.customer.count; index++) {
      const id = `customer_${getRandomId()}`;
      const randCity = getRandomElement(config.citiesData);
      const randLocation = getRandomElement(randCity.places);
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
          {lat: randLocation.lat, long: randLocation.lon}
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
          {lat: randLocation.lat, long: randLocation.lon},
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
    const companyNames = [
      'Car2Go',
      'ShareACar',
      'CarsWithFriends',
      'OnlyCars',
      'CarSharing',
      'PoolCars',
    ];
    for (let index = 0; index < config.rideProvider.countCompany; index++) {
      const company = getRandomElement(companyNames);
      const fleetSize = getRandomIntFromInterval(
        config.rideProvider.countCompanyFleetMin,
        config.rideProvider.countCompanyFleetMax
      );
      for (let index2 = 0; index2 < fleetSize; index2++) {
        const id = `ride_provider_company_${getRandomId()}`;
        const city = getRandomElement(config.citiesData);
        const randLocation = getRandomElement(city.places);
        this.rideProviderObjects.push(
          new RideProviderCompany(
            id,
            {lat: randLocation.lat, long: randLocation.lon},
            `${id}_vehicleNumberPlate`,
            `${id}_vehicleIdentificationNumber`,

            company
          )
        );
      }
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
    // Create blockchain
    this.blockchain = new Blockchain('demo_blockchain');
    // Additional properties
    this.startPos = {
      lat: config.citiesData[0].lat,
      long: config.citiesData[0].lon,
      zoom: 13,
    };
    this.availableLocations = config.citiesData;
  }

  /** Run simulation */
  run(): void {
    this.state = 'ACTIVE';
    Promise.allSettled(this.customerObjects.map(a => a.run(this)))
      .then(() => console.log('Ran all customers'))
      .catch(console.error);
    Promise.allSettled(this.rideProviderObjects.map(a => a.run(this)))
      .then(() => console.log('Ran all ride providers'))
      .catch(console.error);
    Promise.allSettled(this.matchingServiceObjects.map(a => a.run(this)))
      .then(() => console.log('Ran all matching services'))
      .catch(console.error);
  }

  pause(): void {
    this.state = 'PAUSED';
  }

  // Debug methods

  get rideProviders() {
    return this.rideProviderObjects.map(a => a.json);
  }

  get customers() {
    return this.customerObjects.map(a => a.json);
  }

  get authenticationServices() {
    return this.authenticationServiceObjects.map(a => a.json);
  }

  get matchingServices() {
    return this.matchingServiceObjects.map(a => a.json);
  }

  get rideContracts() {
    return this.blockchain.rideContracts;
  }

  // Simulate the actual platform actor routes

  generateRoutes(): express.Router {
    const routerAuthenticationServers = express.Router();
    const routerMatchingServers = express.Router();
    const routerBlockchain = express.Router();

    routerAuthenticationServers.route('/routes').get((req, res) => {
      res.json({routes: this.authenticationServiceObjects.map(a => a.json.id)});
    });
    for (const as of this.authenticationServiceObjects) {
      const asRouter = express.Router();
      asRouter.route('/rating/:pseudonym').get((req, res) => {
        res.json({
          pseudonym: req.params.pseudonym,
          rating: as.getRating(req.params.pseudonym),
        });
      });
      routerAuthenticationServers.use(`/${as.json.id}`, asRouter);
    }
    routerMatchingServers.route('/routes').get((req, res) => {
      res.json({routes: this.matchingServiceObjects.map(a => a.json.id)});
    });
    for (const ms of this.matchingServiceObjects) {
      const msRouter = express.Router();
      msRouter.route('/rideRequest/:rideRequestId').get((req, res) => {
        res.json({
          rideRequestId: req.params.rideRequestId,
          rideRequest: ms.getRideRequest(req.params.rideRequestId),
        });
      });
      msRouter.route('/rideRequests').get((req, res) => {
        res.json({rideRequests: ms.getRideRequests()});
      });
      routerMatchingServers.use(`/${ms.json.id}`, msRouter);
    }
    routerBlockchain.route('/routes').get((req, res) => {
      res.json({routes: [this.blockchain.json.id]});
    });
    for (const blockchain of [this.blockchain]) {
      const blockchainRouter = express.Router();
      blockchainRouter.route('/rideContracts').get((req, res) => {
        res.json({rideContracts: blockchain.rideContracts});
      });
      routerBlockchain.use(`/${blockchain.json.id}`, blockchainRouter);
    }

    const router = express.Router();
    router.use('/authentication_servers', routerAuthenticationServers);
    router.use('/matching_services', routerMatchingServers);
    router.use('/blockchain', routerBlockchain);

    router.route('/pause').get((req, res) => {
      this.pause();
      res.send(this.state);
    });
    router.route('/run').get((req, res) => {
      this.run();
      res.send(this.state);
    });
    router.route('/state').get((req, res) => {
      res.send(this.state);
    });

    return router;
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
      res.json({smartContracts: this.rideContracts});
    });
    return router;
  }
}
