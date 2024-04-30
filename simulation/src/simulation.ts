// Package imports
import express from 'express';
import fs from 'node:fs/promises';
// Local imports
import {AuthenticationService, MatchingService} from './actors/services';
import {RideProviderCompany, RideProviderPerson} from './actors/rideProvider';
import {
  getRandomElement,
  getRandomId,
  getRandomIntFromInterval,
} from './misc/helpers';
import {Blockchain} from './actors/blockchain';
import {Customer} from './actors/customer';
import {getRandomPlateNumber} from './config/numberPlate';
import {osmnxServerRequest} from './misc/osmnx';
import {simulationEndpointRoutes} from './globals/defaults/endpoints';
import {updateRouteCoordinatesWithTime} from './misc/coordinatesInterpolation';
// Type imports
import type {OsmVertex, OsmVertexGraph} from './pathfinder/osm';
import type {
  SimulationEndpointGraphInformation,
  SimulationEndpointParticipantCoordinates,
  SimulationEndpointParticipantIdFromPseudonym,
  SimulationEndpointRideRequestInformation,
  SimulationEndpointRideRequests,
  SimulationEndpointSmartContractInformation,
  SimulationEndpointSmartContracts,
} from './globals/types/simulation';
import type {Coordinates} from './globals/types/coordinates';
import type {SimulationConfigWithData} from './config/simulationConfigWithData';

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
    getRandomPlateNumber(['S']),
    getRandomId(),
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
    getRandomPlateNumber(['S']),
    getRandomId(),
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

  public readonly osmVertexGraph: OsmVertexGraph;

  public state: 'RUNNING' | 'PAUSING' | 'INACTIVE' = 'INACTIVE';

  constructor(config: Readonly<SimulationConfigWithData>) {
    // Create OSM vertex graph
    this.osmVertexGraph = config.osmVertexGraph;

    try {
      fs.writeFile(
        'test.json',
        JSON.stringify({
          vertices: Array.from(this.osmVertexGraph.vertices.entries()).reduce(
            (o, [key, value]) => {
              o[key] = value;
              return o;
            },
            {} as Record<number, OsmVertex>
          ),
        })
      );
    } catch (err) {
      console.log(err);
    }
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
          rideRequest: ms.getRideRequest(req.params.rideRequestId),
          rideRequestId: req.params.rideRequestId,
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

    router.route(simulationEndpointRoutes.simulation.pause).get((req, res) => {
      this.pause();
      res.send(this.state);
    });
    router.route(simulationEndpointRoutes.simulation.run).get((req, res) => {
      this.run();
      res.send(this.state);
    });
    router.route(simulationEndpointRoutes.simulation.state).get((req, res) => {
      res.send(this.state);
    });

    return router;
  }

  generateFrontendRoutes(): express.Router {
    const router = express.Router();
    // Global registered routes
    router
      .route(simulationEndpointRoutes.apiV1.participantCoordinates)
      .get((req, res) => {
        res.json({
          customers: this.customers.map(a => a.endpointCoordinates),
          rideProviders: this.rideProviders.map(a => a.endpointCoordinates),
        } satisfies SimulationEndpointParticipantCoordinates);
      });
    router
      .route(
        simulationEndpointRoutes.apiV1.participantInformationCustomer(':id')
      )
      .get((req, res) => {
        const customer = this.customers.find(a => a.id === req.params.id);
        if (customer) {
          res.json(customer.endpointCustomer);
          return;
        }
        res.status(404);
      });
    router
      .route(
        simulationEndpointRoutes.apiV1.participantInformationRideProvider(':id')
      )
      .get((req, res) => {
        const rideProvider = this.rideProviders.find(
          a => a.id === req.params.id
        );
        if (rideProvider) {
          res.json(rideProvider.endpointRideProvider);
          return;
        }
        res.status(404);
      });
    router
      .route(simulationEndpointRoutes.apiV1.rideRequests)
      .get((req, res) => {
        res.json({
          rideRequests: this.matchingServices
            .flatMap(a => a.getAuctions())
            .map(a => a.id),
        } satisfies SimulationEndpointRideRequests);
      });
    router
      .route(simulationEndpointRoutes.apiV1.rideRequestInformation(':id'))
      .get((req, res) => {
        const rideRequests = this.matchingServices.flatMap(a =>
          a.getAuctions()
        );
        const rideRequest = rideRequests.find(a => a.id === req.params.id);
        if (rideRequest) {
          res.json({
            ...rideRequest.request,
            dropoffLocationCoordinates: rideRequest.request.dropoffLocationReal,
            id: rideRequest.id,
            pickupLocationCoordinates: rideRequest.request.pickupLocationReal,
            type: 'ride_request',
          } as SimulationEndpointRideRequestInformation);
          return;
        }
        res.status(404);
      });
    router
      .route(simulationEndpointRoutes.apiV1.smartContracts)
      .get((req, res) => {
        res.json({
          smartContracts: this.blockchain.rideContracts.map(a => a.walletId),
        } satisfies SimulationEndpointSmartContracts);
      });
    router
      .route(simulationEndpointRoutes.apiV1.smartContract(':id'))
      .get((req, res) => {
        const smartContracts = this.blockchain.rideContracts;
        const smartContract = smartContracts.find(
          a => a.walletId === req.params.id
        );
        if (smartContract) {
          res.json({
            ...smartContract,
            customerId: smartContract.customerPseudonym,
            rideProviderId: smartContract.rideProviderPseudonym,
            type: 'smart_contract',
          } as SimulationEndpointSmartContractInformation);
          return;
        }
        res.status(404);
      });
    router
      .route(
        simulationEndpointRoutes.apiV1.participantIdFromPseudonym(':pseudonym')
      )
      .get((req, res) => {
        const asParticipant = this.authenticationServices.find(
          a => a.simulationGetParticipantId(req.params.pseudonym) !== undefined
        );
        if (asParticipant) {
          const participantId = asParticipant.simulationGetParticipantId(
            req.params.pseudonym
          );
          if (participantId) {
            res.json({
              id: participantId,
            } as SimulationEndpointParticipantIdFromPseudonym);
            return;
          }
        }
        res.status(404);
      });
    // DEBUG: Created route graph
    router
      .route(simulationEndpointRoutes.apiV1.graphInformation)
      .get((req, res) => {
        const geometry: Array<{id: number; geometry: Coordinates[]}> = [];
        if (this.osmVertexGraph.edges instanceof Function) {
          for (const [, vertex] of this.osmVertexGraph.vertices) {
            for (const vertexNeighborId of vertex.neighbors) {
              const vertexNeighbor =
                this.osmVertexGraph.vertices.get(vertexNeighborId);
              if (vertexNeighbor) {
                geometry.push({
                  geometry: [vertex.coordinates, vertexNeighbor.coordinates],
                  id: -1,
                });
              }
            }
          }
        } else {
          for (const [id, a] of this.osmVertexGraph.edges.vertexEdgeIdMap) {
            geometry.push({geometry: a.geometry, id});
          }
          ////console.log(this.osmVertexGraph.edges.idMap);
          //for (const [idVertexA, a] of this.osmVertexGraph.edges.idMap) {
          //  // eslint-disable-next-line @typescript-eslint/no-unused-vars
          //  for (const [idVertexB, edgeId] of a) {
          //    const vertexA = this.osmVertexGraph.vertices.get(idVertexA);
          //    const vertexB = this.osmVertexGraph.vertices.get(idVertexB);
          //    if (vertexA === undefined || vertexB === undefined) {
          //      //console.warn(
          //      //  `Could not find vertex A ${idVertexA} to vertex B ${idVertexB}`
          //      //);
          //      continue;
          //    }
          //    edges.push([vertexA.coordinates, vertexB.coordinates]);
          //  }
          //}
        }
        res.json({
          geometry,
          vertices: Array.from(this.osmVertexGraph.vertices).map(a => ({
            id: a[0],
            ...a[1].coordinates,
          })),
        } as SimulationEndpointGraphInformation);
      });
    router
      .route(simulationEndpointRoutes.apiV1.shortestPath)
      .get(async (req, res) => {
        const vertices = Array.from(this.osmVertexGraph.vertices);
        console.log(vertices);
        const coordinatesPath = [
          vertices[0][1],
          vertices[vertices.length - 1][1],
        ];
        const shortestPath = await osmnxServerRequest(
          coordinatesPath[0].coordinates,
          coordinatesPath[1].coordinates
        );
        res.json({
          coordinatesPath,
          shortestPath,
          shortestPathTime:
            shortestPath.error === null
              ? updateRouteCoordinatesWithTime(
                  shortestPath.shortest_route_length
                )
              : null,
        });
      });
    return router;
  }

  generateInternalRoutes(): express.Router {
    const router = express.Router();
    router
      .route(simulationEndpointRoutes.internal.customers)
      .get((req, res) => {
        res.json({customers: this.customersJson});
      });
    router
      .route(simulationEndpointRoutes.internal.rideProviders)
      .get((req, res) => {
        res.json({rideProviders: this.rideProvidersJson});
      });
    router
      .route(simulationEndpointRoutes.internal.authenticationServices)
      .get((req, res) => {
        res.json({authenticationServices: this.authenticationServicesJson});
      });
    router
      .route(simulationEndpointRoutes.internal.matchingServices)
      .get((req, res) => {
        res.json({matchingServices: this.matchingServicesJson});
      });
    // REMOVE
    router
      .route(simulationEndpointRoutes.internal.rideRequests)
      .get((req, res) => {
        res.json({
          delete: 'delete this',
          rideRequests: this.matchingServices.flatMap(a => a.getAuctions()),
        });
      });
    router
      .route(simulationEndpointRoutes.internal.smartContracts)
      .get((req, res) => {
        res.json({smartContracts: this.rideContractsJson});
      });
    return router;
  }
}
