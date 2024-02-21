import express from 'express';
import { create as createHbs } from 'express-handlebars';
import path from 'path';
import jsonRouter from './routes/json';
import { Simulation } from './simulation';

const app = express();
const hbs = createHbs({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
});
const port = 3000;

const simulation = new Simulation({
  authenticationServiceCount: 5,
  cities: [{
    name: "Stuttgart",
    latitude: 48.783333,
    longitude: 9.183333,
    latitudeRadius: 0.1,
    longitudeRadius: 0.1
  }],
  customerCount: 1000,
  rideProviderCount: 100,
  matchingServiceCount: 2,
  speedInSecPerSec: 60
});

app.use('/styles', express.static(path.join(__dirname, 'public', 'styles')));

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.enable('view cache');

app.get('/', (req, res) => {
  res.render('main', {
    layout: 'index',
    customers: simulation.customers,
    rideProviders: simulation.rideProviders,
    authenticationServices: simulation.authenticationServices,
    matchingServices: simulation.matchingServices,
    smartContracts: simulation.smartContracts,
    startPos: simulation.startPos,
  });
});

app.use('/json', jsonRouter(simulation));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.info(`Express is listening at http://localhost:${port}`);
});
