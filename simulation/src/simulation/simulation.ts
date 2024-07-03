// Package imports
import express from 'express';
// Local imports
import {
  RideProviderCompany,
  RideProviderPerson,
} from './actors/participants/rideProvider';
import {AuthenticationService} from './actors/services/authenticationService';
import {Blockchain} from './actors/blockchain';
import {Customer} from './actors/participants/customer';
import {MatchingService} from './actors/services/matchingService';
// > Globals
import {baseUrlPathfinder} from '../globals/defaults/urls';
import {fetchText} from '../globals/lib/fetch';
import {pathfinderEndpoints} from '../globals/defaults/endpoints';
import {simulationEndpointRoutes} from '../globals/defaults/routes';
// > Libs
import {getVertexEdgeFromGraph2, getVertexEdgeKey} from '../lib/pathfinder';
import {generateRandomNumberPlate} from '../lib/numberPlate';
import {getShortestPathOsmCoordinates} from '../lib/pathfinderOsm';
import {osmnxServerRequest} from '../lib/osmnx';
// > Misc
import {
  getRandomElement,
  getRandomId,
  getRandomIntFromInterval,
} from '../misc/helpers';
// > Services
import {createLoggerSection} from '../services/logging';
// Type imports
import type {
  SimulationEndpointGraphInformation,
  SimulationEndpointParticipantCoordinates,
  SimulationEndpointParticipantIdFromPseudonym,
  SimulationEndpointRideRequestInformation,
  SimulationEndpointRideRequests,
  SimulationEndpointSmartContractInformation,
  SimulationEndpointSmartContracts,
} from '../globals/types/simulation';
import type {Coordinates} from '../globals/types/coordinates';
import type {OsmVertexGraph} from '../lib/pathfinderOsm';
import type {SimulationConfigWithData} from './config/simulationConfigWithData';

const logger = createLoggerSection('simulation');

export interface StartPos extends Coordinates {
  zoom: number;
}

export const createMockedCustomer = (
  index: number,
  config: Readonly<SimulationConfigWithData>
): Customer => {
  const id = getRandomId();
  const randLocation = getRandomElement(config.places);
  const fakePerson = config.peopleData[index];
  const keyPair = config.privatePublicKeyData[index];
  return new Customer(
    id,
    fakePerson.fullName,
    /[0-9]*(?<gender>\S*)/.exec(fakePerson.gender)?.groups?.gender ||
      fakePerson.gender,
    fakePerson.dateOfBirth,
    fakePerson.emailAddress,
    fakePerson.phoneNumber,
    randLocation.name,
    randLocation,
    keyPair.privateKey,
    keyPair.publicKey
  );
};

export const createMockedRideProviderPerson = (
  index: number,
  config: Readonly<SimulationConfigWithData>
): RideProviderPerson => {
  const randLocation = getRandomElement(config.places);
  const fakePerson = config.peopleData[index + config.customer.count];
  const keyPair = config.privatePublicKeyData[index + config.customer.count];
  return new RideProviderPerson(
    getRandomId(),
    randLocation,
    generateRandomNumberPlate(['S']),
    getRandomId(),
    fakePerson.fullName,
    /[0-9]*(?<gender>\S*)/.exec(fakePerson.gender)?.groups?.gender ||
      fakePerson.gender,
    fakePerson.dateOfBirth,
    fakePerson.emailAddress,
    fakePerson.phoneNumber,
    randLocation.name,
    keyPair.privateKey,
    keyPair.publicKey
  );
};

export const createMockedRideProviderCompany = (
  company: string,
  index: number,
  indexCompany: number,
  config: Readonly<SimulationConfigWithData>
): RideProviderCompany => {
  const randLocation = getRandomElement(config.places);
  const keyPair =
    config.privatePublicKeyData[
      index +
        config.customer.count +
        config.rideProvider.countCompanyFleet * indexCompany
    ];
  return new RideProviderCompany(
    getRandomId(),
    randLocation,
    generateRandomNumberPlate(['S']),
    getRandomId(),
    company,
    keyPair.privateKey,
    keyPair.publicKey
  );
};

export const createMockedAuthenticationService = (
  config: Readonly<SimulationConfigWithData>
): AuthenticationService => {
  const randLocation = getRandomElement(config.places);
  return new AuthenticationService(
    getRandomId(),
    randLocation.lat + getRandomIntFromInterval(-100, 100) * 0.001,
    randLocation.long + getRandomIntFromInterval(-100, 100) * 0.001,
    getRandomIntFromInterval(5000, 20000)
  );
};

export const createMockedMatchingService = (
  config: Readonly<SimulationConfigWithData>
): MatchingService => {
  const randLocation = getRandomElement(config.places);
  return new MatchingService(
    getRandomId(),
    randLocation.lat + getRandomIntFromInterval(-100, 100) * 0.001,
    randLocation.long + getRandomIntFromInterval(-100, 100) * 0.001,
    getRandomIntFromInterval(5000, 20000)
  );
};

export class Simulation {
  // Properties
  public readonly customers: Customer[];

  public readonly rideProviders: (RideProviderPerson | RideProviderCompany)[];

  public readonly authenticationServices: AuthenticationService[];

  public readonly matchingServices: MatchingService[];

  public readonly blockchain: Blockchain;

  public readonly startPos: StartPos;

  public readonly availableLocations;

  public readonly osmVertexGraph: OsmVertexGraph;

  public readonly config: Readonly<SimulationConfigWithData>;

  public state: 'RUNNING' | 'PAUSING' | 'INACTIVE' = 'INACTIVE';

  constructor(config: Readonly<SimulationConfigWithData>) {
    this.config = config;
    logger.debug('Initialize simulation...');
    // Set variables that need no processing
    this.osmVertexGraph = config.osmVertexGraph;
    this.startPos = {
      ...config.startPos,
      zoom: 13,
    };
    this.availableLocations = config.places;

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

    // Create participants
    this.customers = Array.from(
      {length: this.config.customer.count},
      (val, index) => createMockedCustomer(index, this.config)
    );
    this.rideProviders = Array.from(
      {length: this.config.rideProvider.countPerson},
      (val, index) => createMockedRideProviderPerson(index, this.config)
    );
    for (
      let indexCompany = 0;
      indexCompany < this.config.rideProvider.countCompany;
      indexCompany++
    ) {
      const company = getRandomElement(this.config.companyNames);
      this.rideProviders.push(
        ...Array.from(
          {length: this.config.rideProvider.countCompanyFleet},
          (val, index) =>
            createMockedRideProviderCompany(
              company,
              index,
              indexCompany,
              this.config
            )
        )
      );
    }

    logger.info('Initialized simulation', {
      // Services
      authServiceCount: this.authenticationServices.length,
      matchServiceCount: this.matchingServices.length,

      // Participants
      customerCount: this.customers.length,
      rideProviderCount: this.rideProviders.length,

      // Graph
      graphVertexCount: this.osmVertexGraph.vertices.size,
      locationCount: this.availableLocations.length,

      // Misc
      startPos: this.startPos,
    });
  }

  /** Prepare simulation */
  async prepare(): Promise<void> {
    logger.debug('Prepare simulation...');

    // Make sure that the pathfinder server is running when it's specified
    if (
      this.config.customPathfinderProvider === 'pathfinder-server' ||
      this.config.customPathfinderProvider === 'all'
    ) {
      try {
        logger.info(
          `fetchText ${baseUrlPathfinder}${pathfinderEndpoints.running}`
        );
        const responseRunning = await fetchText(
          `${baseUrlPathfinder}${pathfinderEndpoints.running}`
        );
        if (responseRunning !== 'Success') {
          throw Error(
            `Pathfinder server was found but does not appear to be running! (${responseRunning})`
          );
        }
        const responseUpdateConfig = await fetchText(
          `${baseUrlPathfinder}${pathfinderEndpoints.updateConfig}`,
          {
            fetchOptions: {
              body: JSON.stringify({
                locations: this.config.locations.map(a =>
                  a.type === 'city'
                    ? {
                        location: `${a.name}, ${a.countryCode}`,
                        type: 'location',
                      }
                    : {
                        bbox: [a.minLat, a.minLong, a.maxLat, a.maxLong],
                        type: 'bbox',
                      }
                ),
              }),
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              method: 'POST',
            },
          }
        );
        if (responseUpdateConfig !== 'Success') {
          throw Error(
            `Pathfinder server config could not be updated! (${responseUpdateConfig})`
          );
        }
      } catch (err) {
        const error = Error(
          `Pathfinder server check failed! (${(err as Error).message})`,
          {cause: err as Error}
        );
        if (this.config.customPathfinderProvider === 'pathfinder-server') {
          logger.error(error);
          throw error;
        } else {
          logger.warn(error.message);
        }
      }
    }
  }

  /** Run simulation */
  async run(): Promise<void> {
    logger.debug('Run simulation...');
    this.state = 'RUNNING';
    const runningActors = [
      ...this.customers,
      ...this.rideProviders,
      ...this.matchingServices,
    ].map(a => a.run(this));
    if (this.config.ignoreActorErrors) {
      await Promise.allSettled(runningActors);
    } else {
      await Promise.all(runningActors);
    }
    this.state = 'INACTIVE';
    logger.debug('Simulation inactive');
  }

  pause(): void {
    logger.debug('Pause simulation...');
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
          rating: as.getRating(req.params.pseudonym, this),
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
            auctionStatus: rideRequest.auctionStatus,
            auctionWinner: rideRequest.auctionWinner,
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
        logger.info('Request graph information');
        const edges: Array<{id: string; geometry: Coordinates[]}> = [];
        const geometry: Array<{id: string; geometry: Coordinates[]}> = [];
        if (this.osmVertexGraph.edges instanceof Function) {
          for (const [vertexId, vertex] of this.osmVertexGraph.vertices) {
            for (const vertexNeighborId of vertex.neighborIds) {
              const vertexNeighbor =
                this.osmVertexGraph.vertices.get(vertexNeighborId);
              if (vertexNeighbor) {
                edges.push({
                  geometry: [
                    {lat: vertex.lat, long: vertex.long},
                    {lat: vertexNeighbor.lat, long: vertexNeighbor.long},
                  ],
                  id: getVertexEdgeKey(vertexId, vertexNeighborId),
                });
              }
            }
          }
        } else {
          for (const [vertexId, vertex] of this.osmVertexGraph.vertices) {
            for (const vertexNeighborId of vertex.neighborIds) {
              const vertexNeighbor =
                this.osmVertexGraph.vertices.get(vertexNeighborId);
              if (vertexNeighbor) {
                const edge = getVertexEdgeFromGraph2(
                  this.osmVertexGraph,
                  vertexId,
                  vertexNeighborId
                );
                if (edge === null) {
                  continue;
                }
                const geometry: Array<Coordinates> = [];
                if (vertexId < vertexNeighborId) {
                  geometry.push(vertex, ...edge[1].geometry, vertexNeighbor);
                } else {
                  geometry.push(vertexNeighbor, ...edge[1].geometry, vertex);
                }
                edges.push({
                  geometry,
                  id: getVertexEdgeKey(vertexId, vertexNeighborId),
                });
              }
            }
          }
          for (const [id, a] of this.osmVertexGraph.edges) {
            geometry.push({geometry: a.geometry, id});
          }
        }
        res.json({
          edges,
          geometry,
          vertices: Array.from(this.osmVertexGraph.vertices).map(
            ([id, vertex]) => ({
              id,
              lat: vertex.lat,
              long: vertex.long,
            })
          ),
        } as SimulationEndpointGraphInformation);
      });
    router
      .route(simulationEndpointRoutes.apiV1.shortestPath)
      .get(async (req, res) => {
        const vertices = Array.from(this.osmVertexGraph.vertices);
        const coordinatesPath = [
          getRandomElement(vertices)[1],
          getRandomElement(vertices)[1],
        ];
        let shortestPathOsmnx = undefined;
        try {
          shortestPathOsmnx = await osmnxServerRequest(
            coordinatesPath[0],
            coordinatesPath[1]
          );
        } catch (err) {
          logger.error(err as Error);
        }
        const shortestPath = getShortestPathOsmCoordinates(
          this.osmVertexGraph,
          coordinatesPath[0],
          coordinatesPath[1]
        );
        res.json({
          coordinatesPath,
          shortestPath,
          shortestPathOsmnx,
        });
      });
    return router;
  }

  generateInternalRoutes(): express.Router {
    const router = express.Router();
    // REMOVE
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
    router
      .route(simulationEndpointRoutes.internal.rideRequest(':id'))
      .get((req, res) => {
        const rideRequests = this.matchingServicesJson.flatMap(a =>
          a.auctionsDb.flatMap(b => b)
        );
        const rideRequest = rideRequests.find(a => a.id === req.params.id);
        res.json({rideRequest});
      });
    router
      .route(simulationEndpointRoutes.internal.rideRequests)
      .get((req, res) => {
        res.json({
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
