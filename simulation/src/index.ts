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
import {
  simulationEndpointRoutes,
  simulationEndpoints,
} from './globals/defaults/endpoints';
import {ports} from './globals/defaults/ports';
// > Libs
import {getCliFlag, getCliOverride} from './lib/cli';
import {fileExists} from './lib/fileOperations';
import {getExpressRoutes} from './lib/getExpressRoutes';
import {validateJsonDataFile} from './lib/validateJsonData';
//import {workerCaller} from './lib/workerCaller';
//import {workerFilePathExample} from './worker/exampleWorker';
// > Services
import {createLoggerSection} from './services/logging';
// Type imports
//import type {
//  WorkerDataExample,
//  WorkerResultExample,
//} from './worker/exampleWorker';
import type {SimulationConfig} from './simulation';

const logger = createLoggerSection('index');

/** The webserver of the simulation. */
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

    //const output: Array<Promise<WorkerResultExample>> = [];
    //for (let index = 0; index < 100; index++) {
    //  output[index] = workerCaller<WorkerDataExample, WorkerResultExample>(
    //    {message: `Test ${index}`},
    //    workerFilePathExample
    //  );
    //}
    //await Promise.all(output);
    //for (let index = 0; index < output.length; index++) {
    //  // eslint-disable-next-line no-console
    //  console.log(output[index]);
    //}

    // eslint-disable-next-line no-process-exit
    process.exit(0);
  }
  // > Port
  let customPortWasFound = false;
  const customPort = await getCliOverride('--port', ports.simulation, a => {
    customPortWasFound = true;
    return parseInt(a);
  });
  // > Config
  const customConfig = await getCliOverride(
    '--config',
    {},
    async customConfig => {
      if (await fileExists(customConfig)) {
        logger.info(`load custom config file ${customConfig}`);
        return await validateJsonDataFile(
          customConfig,
          path.join(__dirname, 'config.schema.json')
        );
      } else {
        throw Error(`Could not load find config file '${customConfig}'`);
      }
    }
  );
  const config: SimulationConfig = {
    ...defaultConfig,
    ...customConfig,
    port: customPortWasFound ? customPort : defaultConfig.port,
  };

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
      port: defaultConfig.port,
      rideProviders: simulation.rideProvidersJson,
      smartContracts: simulation.rideContractsJson,

      globalBaseUrlSimulation: `http://localhost:${simulationConfig.port}`,
      globalSimulationEndpoints: JSON.stringify(simulationEndpoints),
      globalStartPos: JSON.stringify(simulation.startPos),
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

  simulation.run().catch(err => {
    logger.error(err);
    // eslint-disable-next-line no-console
    console.error(err);
  });
}

main().catch(err => {
  logger.error(err);
  // eslint-disable-next-line no-console
  console.error(err);
});
