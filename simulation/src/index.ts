// Package imports
import cors from 'cors';
import {create as createHbs} from 'express-handlebars';
import express from 'express';
import path from 'path';
// Local imports
import {getCliFlag, getCliOverride} from './misc/cli';
import {
  simulationEndpointRoutes,
  simulationEndpoints,
} from './globals/defaults/endpoints';
import {Simulation} from './simulation';
import {createLoggerSection} from './services/logging';
import {ports} from './globals/defaults/ports';
import {printRouterPaths} from './misc/printExpressRoutes';
import {updateSimulationConfigWithData} from './config/simulationConfigWithData';
// Type imports
import type {SimulationConfig} from './config/simulationConfig';

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(__dirname);

const logger = createLoggerSection('index');

// Check for CLI overrides
// > Port
const port = getCliOverride('--port', ports.simulation, a => parseInt(a));
const verbose = getCliFlag('--verbose');

/** The simulation configuration. */
const config: Readonly<SimulationConfig> = {
  // Services
  authenticationService: {
    count: 2,
  },
  matchingService: {
    count: 3,
  },

  // Participants
  customer: {
    count: 200,
  },
  rideProvider: {
    countCompany: 3,
    countCompanyFleetMax: 50,
    countCompanyFleetMin: 15,
    countPerson: 15,
  },

  // Location
  cities: [
    {
      countryCode: 'de',
      name: 'Stuttgart',
    },
  ],

  // Port of server
  port,

  // Misc
  cacheDir: path.join(ROOT_DIR, 'cache'),
  verbose,
};

/** The webserver of the simulation. */
const app = express();
const hbs = createHbs({
  extname: '.hbs',
  layoutsDir: path.join(SRC_DIR, 'views', 'layouts'),
  partialsDir: path.join(SRC_DIR, 'views', 'partials'),
});

// Middlewares
// > CORS
app.use(cors());
// > Logging
app.use((req, res, next) => {
  const {method, url, ip} = req;
  logger.debug(`${method} ${url} ${ip}`);
  next();
});

// Express setup additional static directories
app.use('/scripts', express.static(path.join(SRC_DIR, 'public', 'scripts')));
app.use('/styles', express.static(path.join(SRC_DIR, 'public', 'styles')));
app.use('/icons', express.static(path.join(SRC_DIR, 'public', 'icons')));

// Express setup handlebars integration
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(SRC_DIR, 'views'));
app.enable('view cache');

async function main() {
  const simulationConfig = await updateSimulationConfigWithData(config);
  if ('ONLY_CACHE' in process.env && process.env['ONLY_CACHE'] === '1') {
    return;
  }
  /** The simulation. */
  const simulation = new Simulation(simulationConfig);
  app.use(
    simulationEndpointRoutes.simulation.route,
    simulation.generateRoutes()
  );

  app.get('/running', (req, res) => {
    res.send('Success').status(200);
  });

  app.get('/', (req, res) => {
    res.render('main', {
      layout: 'index',

      scripts: ['/scripts/main.js'],

      authenticationServices: simulation.authenticationServicesJson,
      customers: simulation.customersJson,
      matchingServices: simulation.matchingServicesJson,
      port: config.port,
      rideProviders: simulation.rideProvidersJson,
      smartContracts: simulation.rideContractsJson,

      globalBaseUrlSimulation: `http://localhost:${config.port}`,
      globalSimulationEndpoints: simulationEndpoints,
      globalStartPos: simulation.startPos,
    });
  });

  app.use(
    simulationEndpointRoutes.apiV1.route,
    simulation.generateFrontendRoutes()
  );

  app.use(
    simulationEndpointRoutes.internal.route,
    simulation.generateInternalRoutes()
  );

  app.listen(config.port, () => {
    logger.info(`Express is listening at http://localhost:${config.port}`);
    // Print all registered server routes
    console.info('Routes:');
    printRouterPaths(app._router.stack, `http://localhost:${config.port}`);
  });

  simulation.run().catch(err => console.error(err));
}

main().catch(err => console.error(err));
