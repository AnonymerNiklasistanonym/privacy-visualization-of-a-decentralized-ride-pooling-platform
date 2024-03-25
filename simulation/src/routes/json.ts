// General routes to the current elements fo the simulation

import express from 'express';
// Type imports
import type {Simulation} from '../simulation';

export default (simulation: Simulation): express.Router => {
  const router = express.Router();
  router.route('/customers').get((req, res) => {
    res.json({customers: simulation.customers});
  });
  router.route('/ride_providers').get((req, res) => {
    res.json({rideProviders: simulation.rideProviders});
  });
  router.route('/authentication_services').get((req, res) => {
    res.json({authenticationServices: simulation.authenticationServices});
  });
  router.route('/matching_services').get((req, res) => {
    res.json({matchingServices: simulation.matchingServices});
  });
  router.route('/smart_contracts').get((req, res) => {
    res.json({smartContracts: simulation.smartContracts});
  });
  return router;
};
