import express from 'express';
import cors from 'cors';
import {create as createHbs} from 'express-handlebars';
import path from 'path';
// Local imports
import {getCliFlag, getCliOverride} from './misc/cli';
import {printRouterPaths} from './misc/printExpressRoutes';
import {Simulation} from './simulation';
import {updateSimulationConfigWithData} from './config/simulationConfigWithData';
import {ports} from './globals/defaults/ports';
// Type imports
import type {SimulationConfig} from './config/simulationConfig';

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(__dirname);

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
      name: 'Stuttgart',
      countryCode: 'de',
    },
  ],
  // Port of server
  port,
  // Misc
  cacheDir: path.join(ROOT_DIR, 'cache'),
  verbose: true,
};

/** The webserver of the simulation. */
const app = express();
const hbs = createHbs({
  extname: '.hbs',
  layoutsDir: path.join(SRC_DIR, 'views', 'layouts'),
  partialsDir: path.join(SRC_DIR, 'views', 'partials'),
});

// CORS
app.use(cors());

// Express setup additional static directories
app.use('/styles', express.static(path.join(SRC_DIR, 'public', 'styles')));
app.use('/icons', express.static(path.join(SRC_DIR, 'public', 'icons')));

// Express setup handlebars integration
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(SRC_DIR, 'views'));
app.enable('view cache');

async function main() {
  /** The simulation. */
  const simulation = new Simulation(
    await updateSimulationConfigWithData(config)
  );
  app.use('/simulation', simulation.generateRoutes());

  app.get('/', (req, res) => {
    res.render('main', {
      layout: 'index',
      customers: simulation.customersJson,
      rideProviders: simulation.rideProvidersJson,
      authenticationServices: simulation.authenticationServicesJson,
      matchingServices: simulation.matchingServicesJson,
      port: config.port,
      smartContracts: simulation.rideContractsJson,
      startPos: simulation.startPos,
    });
  });

  app.use('/json', simulation.generateFrontendRoutes());

  app.listen(config.port, () => {
    console.info(`Express is listening at http://localhost:${config.port}`);
    console.info('Routes:');
    printRouterPaths(app._router.stack, `http://localhost:${config.port}`);
  });

  simulation.run().catch(err => console.error(err));
}

main().catch(err => console.error(err));
