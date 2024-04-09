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
import type {Coordinates} from './types/globals/coordinates';
import type {SimulationConfigWithData} from './config/simulationConfigWithData';
import type {SimulationEndpointParticipantCoordinates} from './types/globals/simulation';

export interface StartPos extends Coordinates {
  zoom: number;
}

export const createMockedCustomer = (
  index: number,
  config: Readonly<SimulationConfigWithData>
): Customer => {
  const id = `customer_${getRandomId()}`;
  const randCity = getRandomElement(config.citiesData);
  const randLocation = getRandomElement(randCity.places);
  const fakePerson = config.peopleData[index];
  return new Customer(
    id,
    fakePerson.fullName,
    /[0-9]*(?<gender>\S*)/.exec(fakePerson.gender)?.groups?.gender ||
      fakePerson.gender,
    fakePerson.dateOfBirth,
    fakePerson.emailAddress,
    fakePerson.phoneNumber,
    `${randLocation.postcode} ${randLocation.city} ${randLocation.street} ${randLocation.houseNumber}`,
    {lat: randLocation.lat, long: randLocation.lon},
    config.verbose
  );
};

export const createMockedRideProviderPerson = (
  index: number,
  config: Readonly<SimulationConfigWithData>
): RideProviderPerson => {
  const id = `ride_provider_${getRandomId()}`;
  const city = getRandomElement(config.citiesData);
  const randLocation = getRandomElement(city.places);
  const fakePerson = config.peopleData[index + config.customer.count];
  return new RideProviderPerson(
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
    `${randLocation.postcode} ${randLocation.city} ${randLocation.street} ${randLocation.houseNumber}`,
    config.verbose
  );
};

export const createMockedRideProviderCompany = (
  company: string,
  config: Readonly<SimulationConfigWithData>
): RideProviderCompany => {
  const id = `ride_provider_company_${getRandomId()}`;
  const city = getRandomElement(config.citiesData);
  const randLocation = getRandomElement(city.places);
  return new RideProviderCompany(
    id,
    {lat: randLocation.lat, long: randLocation.lon},
    `${id}_vehicleNumberPlate`,
    `${id}_vehicleIdentificationNumber`,
    company,
    config.verbose
  );
};

export const createMockedAuthenticationService = (
  config: Readonly<SimulationConfigWithData>
): AuthenticationService => {
  const id = `as_${getRandomId()}`;
  const city = getRandomElement(config.citiesData);
  return new AuthenticationService(
    id,
    city.lat + getRandomIntFromInterval(-100, 100) * 0.001,
    city.lon + getRandomIntFromInterval(-100, 100) * 0.001,
    getRandomIntFromInterval(5000, 20000),
    config.verbose
  );
};

export const createMockedMatchingService = (
  config: Readonly<SimulationConfigWithData>
): MatchingService => {
  const id = `ms_${getRandomId()}`;
  const city = getRandomElement(config.citiesData);
  return new MatchingService(
    id,
    city.lat + getRandomIntFromInterval(-100, 100) * 0.001,
    city.lon + getRandomIntFromInterval(-100, 100) * 0.001,
    getRandomIntFromInterval(5000, 20000),
    config.verbose
  );
};

export class Simulation {
  // Properties
  public customers: Customer[];

  public readonly rideProviders: (RideProviderPerson | RideProviderCompany)[];

  public readonly authenticationServices: AuthenticationService[];

  public readonly matchingServices: MatchingService[];

  public readonly blockchain: Blockchain;

  public readonly startPos: StartPos;

  public readonly availableLocations;

  public state: 'RUNNING' | 'PAUSING' | 'INACTIVE' = 'INACTIVE';

  constructor(config: Readonly<SimulationConfigWithData>) {
    // Create participants
    this.customers = Array.from({length: config.customer.count}, (val, index) =>
      createMockedCustomer(index, config)
    );
    this.rideProviders = Array.from(
      {length: config.rideProvider.countPerson},
      (val, index) => createMockedRideProviderPerson(index, config)
    );
    for (let index = 0; index < config.rideProvider.countCompany; index++) {
      const fleetSize = getRandomIntFromInterval(
        config.rideProvider.countCompanyFleetMin,
        config.rideProvider.countCompanyFleetMax
      );
      this.rideProviders.push(
        ...Array.from({length: fleetSize}, () =>
          createMockedRideProviderCompany(
            getRandomElement(config.companyNames),
            config
          )
        )
      );
    }
    // Create services
    this.authenticationServices = Array.from(
      {length: config.authenticationService.count},
      () => createMockedAuthenticationService(config)
    );
    this.matchingServices = Array.from(
      {length: config.authenticationService.count},
      () => createMockedMatchingService(config)
    );
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
  async run(): Promise<void> {
    this.state = 'RUNNING';
    await Promise.allSettled(
      [...this.customers, ...this.rideProviders, ...this.matchingServices].map(
        a => a.run(this)
      )
    );
    this.state = 'INACTIVE';
  }

  pause(): void {
    this.state = 'PAUSING';
  }

  // Debug methods

  get rideProvidersJson() {
    return this.rideProviders.map(a => a.json);
  }

  get customersJson() {
    return this.customers.map(a => a.json);
  }

  get authenticationServicesJson() {
    return this.authenticationServices.map(a => a.json);
  }

  get matchingServicesJson() {
    return this.matchingServices.map(a => a.json);
  }

  get rideContractsJson() {
    return this.blockchain.rideContracts;
  }

  // Simulate the actual platform actor routes

  generateRoutes(): express.Router {
    const routerAuthenticationServers = express.Router();
    const routerMatchingServers = express.Router();
    const routerBlockchain = express.Router();

    routerAuthenticationServers.route('/routes').get((req, res) => {
      res.json({routes: this.authenticationServices.map(a => a.json.id)});
    });
    for (const as of this.authenticationServices) {
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
      res.json({routes: this.matchingServices.map(a => a.json.id)});
    });
    for (const ms of this.matchingServices) {
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
    router.route('/participants').get((req, res) => {
      res.json({
        customers: this.customers.map(a => a.endpointCoordinates),
        rideProviders: this.rideProviders.map(a => a.endpointCoordinates),
      } satisfies SimulationEndpointParticipantCoordinates);
    });
    router.route('/customer/:id').get((req, res) => {
      const customer = this.customers.find(a => a.id === req.params.id);
      if (customer) {
        res.json(customer.endpointCustomer);
        return;
      }
      res.status(404);
    });
    router.route('/customers').get((req, res) => {
      res.json({customers: this.customersJson});
    });
    router.route('/ride_providers').get((req, res) => {
      res.json({rideProviders: this.rideProvidersJson});
    });
    router.route('/authentication_services').get((req, res) => {
      res.json({authenticationServices: this.authenticationServicesJson});
    });
    router.route('/matching_services').get((req, res) => {
      res.json({matchingServices: this.matchingServicesJson});
    });
    router.route('/smart_contracts').get((req, res) => {
      res.json({smartContracts: this.rideContractsJson});
    });
    return router;
  }
}
