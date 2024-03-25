import express from 'express';
import {create as createHbs} from 'express-handlebars';
import path from 'path';
import routesJson from './routes/json';
import {Simulation} from './simulation';
import {updateSimulationConfigWithData} from './config/simulationConfigWithData';
// Type imports
import type {SimulationConfig} from './config/simulationConfig';
import {getCliOverride} from './misc/cli';

// Check for CLI overrides
// > Port
const port = parseInt(getCliOverride('--port', '4321'));

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
  cacheDir: path.join(__dirname, '..', 'cache'),
};

/** The webserver of the simulation. */
const app = express();
const hbs = createHbs({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
});

// Express setup additional static directories
app.use('/styles', express.static(path.join(__dirname, 'public', 'styles')));

// Express setup handlebars integration
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.enable('view cache');

async function main() {
  /** The simulation. */
  const simulation = new Simulation(
    await updateSimulationConfigWithData(config)
  );
  app.use('/simulation', simulation.generateFrontendRoutes());

  app.get('/', (req, res) => {
    res.render('main', {
      layout: 'index',
      customers: simulation.customers,
      rideProviders: simulation.rideProviders,
      authenticationServices: simulation.authenticationServices,
      matchingServices: simulation.matchingServices,
      port: config.port,
      smartContracts: simulation.smartContracts,
      startPos: simulation.startPos,
    });
  });

  app.use('/json', routesJson(simulation));

  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.info(`Express is listening at http://localhost:${config.port}`);
  });
}

main().catch(err => console.error(err));
