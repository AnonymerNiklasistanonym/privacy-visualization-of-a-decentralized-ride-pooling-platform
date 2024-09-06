// Package imports
import cors from 'cors';
import {create as createHbs} from 'express-handlebars';
import express from 'express';
import path from 'path';
// Local imports
import {NAME, VERSION} from './info';
import {Simulation} from './simulation';
import {defaultConfig} from './defaults';
import {updateSimulationConfigWithData} from './simulation';
// > Globals
import {constants} from 'lib_globals';
// > Libs
import {getCliFlag, getCliOverride} from './lib/cli';
import {fileExists} from './lib/fileOperations';
import {getExpressRoutes} from './lib/getExpressRoutes';
import {validateJsonDataFile} from './lib/validateJsonData';
// > Services
import {createLoggerSection} from './services/logging';
// Type imports
import type {SimulationConfig, SimulationConfigCustom} from './simulation';

/** The logger of this file */
const logger = createLoggerSection('index');

/** The webserver of the simulation */
const app = express();
const hbs = createHbs({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
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
app.use('/scripts', express.static(path.join(__dirname, 'public', 'scripts')));
app.use('/styles', express.static(path.join(__dirname, 'public', 'styles')));
app.use('/icons', express.static(path.join(__dirname, 'public', 'icons')));

// Express setup handlebars integration
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.enable('view cache');

async function main() {
  // Check for CLI overrides
  // > Version
  if (getCliFlag('--version')) {
    // eslint-disable-next-line no-console
    console.log(`${NAME} v${VERSION}`);
    return;
  }
  // > Config
  const customConfig = await getCliOverride(
    '--config',
    {},
    async customConfig => {
      if (await fileExists(customConfig)) {
        logger.info(`load custom config file ${customConfig}`);
        return await validateJsonDataFile<SimulationConfigCustom>(
          customConfig,
          path.join(__dirname, 'config.schema.json')
        );
      } else {
        throw Error(`Could not find custom config file '${customConfig}'`);
      }
    }
  );
  // Overwrite default config with custom config but also prioritize CLI port argument
  const config: SimulationConfig = {
    ...defaultConfig,
    ...customConfig,
    port: await getCliOverride(
      '--port',
      customConfig.port ?? defaultConfig.port,
      a => parseInt(a)
    ),
  };

  /** Updated configuration with additional preprocessed data */
  const simulationConfig = await updateSimulationConfigWithData(config);

  // Early exit (in case only the caching of the preprocessed data was wanted)
  if (process.env.ONLY_CACHE === '1') {
    return;
  }

  /** The simulation */
  const simulation = new Simulation(simulationConfig);
  await simulation.prepare();
  simulation.run().catch(err => {
    logger.error(err);
    // Hard exit the program if the simulation crashes
    throw err;
  });

  // Health check route to indicate if the server is running
  app.get('/running', (req, res) => {
    res.send('Success').status(200);
  });

  // Generate simulated server routes
  app.use(
    constants.routes.simulationEndpoint.simulation.route,
    simulation.generateRoutes()
  );

  // Generate simulation API routes
  app.use(
    constants.routes.simulationEndpoint.apiV1.route,
    simulation.generateFrontendRoutes()
  );

  // Generate internal API routes
  app.use(
    constants.routes.simulationEndpoint.internal.route,
    simulation.generateInternalRoutes()
  );

  // Debug route which shows most of the internal data
  app.get('/', (req, res) => {
    // Prevent serialized functions from disappearing
    const globalSimulationEndpoints: {
      internal: Record<string, unknown | string>;
    } = {
      ...constants.endpoints.simulation,
    };
    globalSimulationEndpoints.internal = {
      ...globalSimulationEndpoints.internal,
      rideRequest: constants.endpoints.simulation.internal.rideRequest(''),
    };
    res.render('main', {
      layout: 'index',

      scripts: ['/scripts/main.js'],

      authenticationServices: simulation.authenticationServicesJson,
      customers: simulation.customersJson,
      matchingServices: simulation.matchingServicesJson,
      rideProviders: simulation.rideProvidersJson,
      rideRequests: simulation.matchingServicesJson.flatMap(a => a.auctionsDb),
      smartContracts: simulation.rideContractsJson,

      // Objects lose function properties when serialized!
      globalBaseUrlSimulation: `http://localhost:${simulationConfig.port}`,
      globalSimulationEndpoints: JSON.stringify(globalSimulationEndpoints),
      globalStartPos: JSON.stringify(simulation.startPos),

      // URLS
      urlJsonAs: constants.endpoints.simulation.internal.authenticationServices,
      urlJsonCustomers: constants.endpoints.simulation.internal.customers,
      urlJsonMs: constants.endpoints.simulation.internal.matchingServices,
      urlJsonRideProviders:
        constants.endpoints.simulation.internal.rideProviders,
      urlJsonRideRequests: constants.endpoints.simulation.internal.rideRequests,
      urlJsonSmartContracts:
        constants.endpoints.simulation.internal.smartContracts,
    });
  });

  // Callback listener to when the server is running
  app.listen(simulationConfig.port, () => {
    logger.info(
      `Express is listening at http://localhost:${simulationConfig.port}`
    );
    // Print all registered server routes
    const routerPaths = getExpressRoutes(
      app._router.stack,
      `http://localhost:${simulationConfig.port}`
    );
    logger.info('Routes:');
    for (const routerPath of routerPaths) {
      logger.info(routerPath);
    }
  });

  process.on('exit', () => {
    logger.info('Process exit');
  });
}

main().catch(err => {
  logger.error(err);
  // eslint-disable-next-line no-console
  console.error(err);
});
