import express from 'express';
import cors from 'cors';
import {create as createHbs} from 'express-handlebars';
import path from 'path';
import {Simulation} from './simulation';
import {updateSimulationConfigWithData} from './config/simulationConfigWithData';
// Type imports
import type {SimulationConfig} from './config/simulationConfig';
import {getCliOverride} from './misc/cli';

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(__dirname);

// Check for CLI overrides
// > Port
const port = getCliOverride('--port', 4321, a => parseInt(a));

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
      customers: simulation.customers,
      rideProviders: simulation.rideProviders,
      authenticationServices: simulation.authenticationServices,
      matchingServices: simulation.matchingServices,
      port: config.port,
      smartContracts: simulation.rideContracts,
      startPos: simulation.startPos,
    });
  });

  app.use('/json', simulation.generateFrontendRoutes());

  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.info(`Express is listening at http://localhost:${config.port}`);
  });

  simulation.run();
}

main().catch(err => console.error(err));
