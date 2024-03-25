# Simulation

Simulate the following parts of the GETACAR platform:

- Invisible stakeholders: These actors can normally not be queried
  - [ ] Customer[s]
    - [ ] Randomly spawn `$COUNT` around `$CITY`
    - [ ] Imitate actions in a loop:
      - [ ] Sleep (move to random `$LOCATION`s in the meantime)
      - [ ] Randomly select `$DROPOFF_LOCATION` and request a ride
      - [ ] Accept auction result and be part of the ride
      - [ ] Rate passengers and driver
    - [ ] Implement endpoint to query all their data by the visualization platform
  - [ ] Ride-Provider[s] (normal people & company fleets)
    - [ ] Randomly spawn `$COUNT` around `$CITY`
    - [ ] Imitate actions in a loop:
      - [ ] Sleep (move to random `$LOCATION`s in the meantime)
      - [ ] Randomly start being active and bid on open ride requests
      - [ ] Drive to `$DROPOFF_LOCATION` and take passenger for a ride
      - [ ] Rate passengers
    - [ ] Implement endpoint to query all their data by the visualization platform
- Visible stakeholders: These actors can be queried
  - [ ] Authentication Service[s]
    - [ ] Randomly spawn `$COUNT`
    - [ ] Implement endpoints
      - [ ] `get:/rating/:pseudonym`
    - [ ] Implement endpoint to query all their data by the visualization platform
  - [ ] Matching Service[s]
    - [ ] Randomly spawn `$COUNT`
    - [ ] Implement endpoints
      - [ ] `get:/rating/:pseudonym`
    - [ ] Implement endpoint to query all their data by the visualization platform
  - [ ] Blockchain
    - [ ] Implement endpoints
      - [ ] `get:/smart_contract/:id`
      - [ ] `get:/smart_contracts/`

## Configuration

Edit parameters in [`src/index.ts`](./src/index.ts).

```ts
import type { SimulationConfig } from './types/config';

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
  port: 4321,
  // Misc
  cacheDir: path.join(__dirname, '..', 'cache'),
};
```

## Run

**Prerequisites**:

1. Install `node` and `npm` (arch linux + `pacman`: `sudo pacman -S npm`)

**Setup:**

```sh
# Install dependencies
npm install
# Compile TypeScript code to JavaScript in build directory
npm run compile
# Copy additional resource files and compiled files to dist directory
npm run dist
# Run compiled files (default port 4321 => http://localhost:4321)
npm run start
# Optionally you can change the port of the web server from the CL
npm run start -- --port 3000
```

**Endpoints:**

The web server has the following endpoints:

- `/` Frontend that displays the current simulation state
- `/json` JSON API for all simulated stakeholders
  - `/customers`
  - `/ride_providers`
  - `/authentication_services`
  - `/matching_services`
  - `/smart_contracts`
- TODO: Add the actual routes that the visualization will use

**Development:**

```sh
# Check files (style guide, errors)
npm run lint
# Auto fix files (style guide, errors)
npm run fix
# Create documentation in docs directory
npm run docs
npx http-server -o docs -p 8000
```
