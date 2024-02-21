# Simulation

Simulate all Stakeholders around a given **list of coordinates** (longitude, latitude), **radius** (longitude, latitude) and **speed** ($1.0=1\text{min}$):

- [ ] Customer[s]
  - [x] Random spawn around coordinates/radius (spawn_count)
  - [x] Sign-Up/Authenticate to Authentication Service
  - [ ] Automate sleep, look for rides, rate after ride
- [ ] Ride-Provider[s]
  - [x] Random spawn around coordinates/radius (spawn_count)
  - [x] Sign-Up/Authenticate to Authentication Service
  - [ ] Automate sleep, bid for customers, rate after ride
- [x] Authentication Service[s]
  - [x] Random spawn around coordinates/radius (spawn_count)
- [ ] Matching Service[s]
  - [x] Random spawn around coordinates/radius (spawn_count)
  - [ ] Automate Vickery Auction from Ride-Provider[s] on Customers
- [ ] Blockchain Smart Contract[s]
  - [ ] Participants of the smart contract can rate each other

## TODO

### Required

- [ ] Implement checklist

### Optional

- [ ] Add script to open browser on port
- [ ] Fix `copyfiles` script on Windows: https://github.com/shelljs/shelljs
- [ ] Read in configuration from external JSON file so no recompile is necessary
- [ ] Instead of hard coding the locations of all stakeholders on the map fetch them instead in regular intervals so no page refresh is necessary: JSON API already exists, handbrake views need to be compiled in the browser somehow

## Configuration

Edit parameters in [`src/index.ts`](./src/index.ts).

```ts
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
```

## Run

**Prerequisites**:

1. Install `node` and `npm` (arch linux + `pacman`: `sudo pacman -S npm`)

**Setup:**

```sh
# Install dependencies
npm install
# Compile TypeScript code to JavaScript in dist directory
npm run tsc
# Copy additional resource files to the dist directory
npm run copyfiles
# Run compiled files
npm run start
```

Then open your browser on the listed URL: `http://localhost:3000` (default)
