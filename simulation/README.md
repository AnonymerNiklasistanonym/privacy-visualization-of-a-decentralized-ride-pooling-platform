# Webserver: Simulation

- [Run](#run)
  - [Configuration](#configuration)
  - [Node.js](#nodejs)
  - [Docker](#docker)
  - [Logs](#logs)
- [Dev](#dev)
  - [Commands](#commands)
- [Profiling](#profiling)
  - [Ticks](#ticks)
  - [Flamegraph](#flamegraph)

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

## Run

Per default running it will create a web server on the port `3020`.
Open [http://localhost:3020](http://localhost:3020) with your browser to view the debug page.

### Configuration

Edit parameters in [`config.json`](./config.json) (use an editor that is aware of JSON schemas: [`config.schema.json`](./config.schema.json)).

### Node.js

1. [Install Node.js (`node` + `npm`)](https://nodejs.org/en/download)
2. Setup:

   ```sh
   # Install dependencies
   npm install
   # Compile TypeScript code to JavaScript in build directory and
   # copy additional resource files and compiled files to dist directory
   npm run build
   # Run compiled files (default port 3020 => http://localhost:3020)
   npm run start
   # Optionally you can change the port of the web server from the CL
   npm run start -- --port 3020
   ```

3. Development:

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

1. [Install Docker (`docker` + `docker-compose`)](https://docs.docker.com/get-docker/) and start the docker daemon
   - Linux:
     1. Install (e.g. via `sudo pacman -S docker docker-compose`)
     2. Use `systemd` to start the service: `systemctl start docker`
     3. If it's not yet working create the docker group (if it does not exist): `sudo groupadd docker`
     4. Add your user to this group: `sudo usermod -aG docker $USER`
     5. Log in to the new docker group since the current shells may not yet "know" about being added to the docker group (alternatively run `newgrp docker`)
   - Windows:
     1. Install (e.g. via `winget install -e --id Docker.DockerDesktop`)
     2. Add the binaries to the PATH: `C:\Program Files\Docker\Docker\resources\bin`
     3. Start `Docker Desktop` to start the docker engine
2. Build container declared in a `Dockerfile` in the current directory: `docker build --tag express-docker .`
   - `docker build [OPTIONS] PATH`
   - `--tag list`: Name and optionally a tag in the "name:tag" format
   - Windows: In case there are line endings errors from copying files into a docker container you can convert all relevant files to the Linux line endings via e.g. `find . -type f -name '*.ts' -not -path '*/node_modules/*' -exec dos2unix {} +`
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

### Logs

The server logs are stored in `logs`.

To copy them out of a `docker` container run: `docker cp $ID:$LOG_DIR ./app_logs` (`$LOG_DIR=/app/logs/`).

## Dev

### Commands

| Command | Description |
| --- | --- |
| `npm run check:circular` | Check for circular dependencies |
| `npm run check:exports` | Check for unused exports |
| `npm run fix` | Fix code style based on [`eslint` rules](.eslintrc.json) |
| `npm run lint` | Check code style based on [`eslint` rules](.eslintrc.json) and on `next` internals |
| `npm run test` | Run tests defined in [`src/tests`](src/tests) |

## Profiling

There are a number of ways to get a quick overview on what functions slow down the server:

> In case anonymous functions are used be careful since the can't be tracked by name (only line and file location)!
>
> ```ts
> // JS: *<anonymous> ./simulation/dist/lib/pathfinderOsm.js:37:101
> const noName = () => {};
> // JS: *haversineDistance ./simulation/node_modules/haversine-distance/index.js:17:28
> export function haversineDistance (a, b) {}
> // > or the JS syntax
> module.exports = haversineDistance
> ```

### Ticks

Based on [an article by `nodejs.org`](https://nodejs.org/en/learn/getting-started/profiling):

```sh
# Create a file that tracks everything going on in the interpreter
# > the output is stored in a file called 'isolate-0xnnnnnnnnnnnn-v8.log'
NODE_ENV=production node --prof .
# Using the tick processor bundled with the Node.js binary we can get a summary
node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
```

```text
Statistical profiling result from isolate-0x55d5d3f55d60-31840-v8.log, (123205 ticks, 49227 unaccounted, 0 excluded).

 [Shared libraries]:
   ticks  total  nonlib   name
    388    0.3%          /usr/lib/libc.so.6
     31    0.0%          [vdso]
      2    0.0%          /usr/lib/libuv.so.1.0.0
      1    0.0%          /usr/lib/libm.so.6

 [JavaScript]:
   ticks  total  nonlib   name
  17540   14.2%   14.3%  JS: *<anonymous> ./simulation/dist/lib/pathfinderOsm.js:37:101
  16388   13.3%   13.3%  JS: *haversineDistance ./simulation/node_modules/haversine-distance/index.js:17:28
  13350   10.8%   10.9%  Builtin: LoadIC
   7451    6.0%    6.1%  JS: *_heapifyDown ./simulation/node_modules/@datastructures-js/heap/src/heap.js:140:15
   6374    5.2%    5.2%  JS: *_compareChildrenOf ./simulation/node_modules/@datastructures-js/heap/src/heap.js:87:21
   1404    1.1%    1.1%  JS: *_heapifyUp ./simulation/node_modules/@datastructures-js/heap/src/heap.js:125:13
   1135    0.9%    0.9%  JS: *insert ./simulation/node_modules/@datastructures-js/heap/src/heap.js:184:9
   1098    0.9%    0.9%  JS: *getShortestPath ./simulation/dist/lib/pathfinder.js:34:25

...

 [Summary]:
   ticks  total  nonlib   name
  68371   55.5%   55.7%  JavaScript
   5185    4.2%    4.2%  C++
   2459    2.0%    2.0%  GC
    422    0.3%          Shared libraries
  49227   40.0%          Unaccounted

...
```

### Flamegraph

Based on [the README of the GitHub project `davidmarkclements/0x`](https://github.com/davidmarkclements/0x?tab=readme-ov-file):

```sh
npx 0x .
```

When finished send a `SIGINT`/`SIGTERM` signal (`CTRL` + `C`) and then open the generated `flamegraph.html` in your browser.

> On some terminals this might not be possible via `CTRL` + `C` but you can always use for example `htop`, use the tree perspective and filter for `0x`, then send a `SIGTERM` to the parent `0x` process.

![Example flamegraph output of `0x`](./res/flamegraph_example.png)
