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
npm run start -- --port 3020
```

**Endpoints:**

The web server has the following endpoints:

- Frontend
  - `GET` `http://localhost:2222`
- Frontend JSON
  - `GET` `http://localhost:2222/json/customers`
  - `GET` `http://localhost:2222/json/ride_providers`
  - `GET` `http://localhost:2222/json/authentication_services`
  - `GET` `http://localhost:2222/json/matching_services`
  - `GET` `http://localhost:2222/jshylilyson/smart_contracts`
- Simulation
  - `GET` `http://localhost:2222/simulation/authentication_servers/routes`
  - `GET` `http://localhost:2222/simulation/authentication_servers/as_$ID/rating/:pseudonym`
  - `GET` `http://localhost:2222/simulation/matching_services/routes`
  - `GET` `http://localhost:2222/simulation/matching_services/ms_$ID/rideRequest/:rideRequestId`
  - `GET` `http://localhost:2222/simulation/matching_services/ms_$ID/rideRequests`
  - `GET` `http://localhost:2222/simulation/blockchain/routes`
  - `GET` `http://localhost:2222/simulation/blockchain/blockchain_$ID/rideContracts`
  - `GET` `http://localhost:2222/simulation/pause`
  - `GET` `http://localhost:2222/simulation/run`
  - `GET` `http://localhost:2222/simulation/state`

**Development:**

```sh
# Check files (style guide, errors)
npm run lint
# Auto fix files (style guide, errors)
npm run fix
# Create documentation in docs directory
npm run docs
npx http-server -o docs -p 8000
# Auto update server on change
npm run dev -- --port 2222
```

### Docker

1. [Install Docker](https://docs.docker.com/get-docker/) and start the docker daemon
   - Linux with `systemd`: `systemctl start docker`
     1. If it's not yet working create the docker group (if it does not exist): `sudo groupadd docker`
     2. Add your user to this group: `sudo usermod -aG docker $USER`
     3. Log in to the new docker group since the current shells may not yet "know" about being added to the docker group (alternatively run `newgrp docker`)
2. Build container declared in a `Dockerfile` in the current directory: `docker build --tag express-docker .`
   - `docker build [OPTIONS] PATH`
   - `--tag list`: Name and optionally a tag in the "name:tag" format
3. Run container: `docker run --publish 3020:3020 express-docker`
   - `docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`
   - `--publish list`: Publish a container's port(s) to the host

You can view:

- the created images created with `docker images`
- the currently running containers and their IDs/ports/states with `docker ps`
- stop a running container with `docker stop $ID` (stop all of them via `docker ps -aq | xargs docker stop`)
- to inspect an image use the command `docker run --rm -it --entrypoint=/bin/bash $TAG`
  (in case the image has no `bash` you may have to add it in the `Dockerfile` e.g. `RUN apk add --no-cache bash`)
- to inspect a running container use the command `docker exec -t -i $ID /bin/bash`

If you are finished you can:

- stop the docker service: `systemctl stop docker`
- prune all docker caches: `docker system prune -a`

> Make sure that all files that should not be copied to the docker container are listed in the [`.dockerignore`](.dockerignore) file!

> The `Dockerfile` was inspired by a [geeksforgeeks.org article 'How to Dockerize an ExpressJS App?'](https://www.geeksforgeeks.org/how-to-dockerize-an-expressjs-app/).
