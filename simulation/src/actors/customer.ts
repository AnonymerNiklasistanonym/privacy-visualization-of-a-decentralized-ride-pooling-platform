/* eslint-disable max-classes-per-file */
import { getRandomElement } from '../misc/helpers';
import type { Simulation } from '../simulation';
import { LocationGPS } from '../types/location';
import type { Coordinates, SimulationTypeCustomer as CustomerType } from '../types/participants';
import Participant from './participant';
import { latLngToCell } from "h3-js";

export class Customer extends Participant<CustomerType> {
    // Private properties
    protected readonly fullName: string
    protected readonly gender: string
    protected readonly dateOfBirth: string
    protected readonly emailAddress: string
    protected readonly phoneNumber: string
    protected readonly homeAddress: string

    constructor(
        id: string,
        fullName: string,
        gender: string,
        dateOfBirth: string,
        emailAddress: string,
        phoneNumber: string,
        homeAddress: string,
        currentLocation: Coordinates,
        ) {
        super(id, "customer", currentLocation);
        this.fullName = fullName;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.emailAddress = emailAddress;
        this.phoneNumber = phoneNumber;
        this.homeAddress = homeAddress;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    run(simulation: Simulation): Promise<void> {
      // Setup:
      // 1. Register to a random AS
      const randAuthService = getRandomElement(simulation.authenticationServiceObjects);
      randAuthService.registerCustomer(this.id, this.fullName, this.gender, this.dateOfBirth, this.emailAddress, this.phoneNumber, this.homeAddress);
      // Loop:
      while (simulation.state === "RUNNING") {
        // 1. Authenticate to the platform via AS
        const pseudonym = randAuthService.verify(this.id)
        // 2. Request ride to a random location via the random closest MS
        // TODO: Find random location in radius around currentLocation
        const randomLocation: LocationGPS = { latitude: 10, longitude: 20 };
        const randMatchService = getRandomElement(simulation.matchingServiceObjects);
        randMatchService.requestRide(
            pseudonym,
            latLngToCell(this.currentLocation.latitude, this.currentLocation.longitude, 7),
            latLngToCell(0, 0, 7), // TODO
            this.getRating(),
            "TODO",
            60 * 1000, // waiting time in ms
            3, // min rating ride provider
            3, // min rating passengers
            -1, // max passengers
        )
        // TODO:
        // 3. Accept auction result from MS
        // 4. Be part of the ride
        // 5. Stay idle for a random duration and then repeat
      }

      throw new Error('Method not implemented.');
    }

    get json(): CustomerType {
      return {
        id: this.id,
        fullName: this.fullName,
        gender: this.gender,
        dateOfBirth: this.dateOfBirth,
        emailAddress: this.emailAddress,
        phoneNumber: this.phoneNumber,
        homeAddress: this.homeAddress,
        currentLocation: this.currentLocation,
        type: "customer"
      };
    }
  }
