import {Actor} from './actor';
// Type imports
import type {AuthenticationService} from './services';
import type {LocationGPS} from './types/location';

/**
 * Abstract Class that represents a participant of the simulation.
 */
export abstract class Participant<JsonType> extends Actor<JsonType> {
  // Private dynamic information
  protected currentLocation: LocationGPS;

  protected registeredAuthService: AuthenticationService | null = null;

  /** Create instance of participant. */
  constructor(
    id: string,
    type: 'customer' | 'ride_provider',
    currentLocation: LocationGPS
  ) {
    super(id, type);
    this.currentLocation = currentLocation;
  }

  getRating(): number {
    if (this.registeredAuthService === null) {
      throw new Error(
        'Participant is not yet registered to an authentication service.'
      );
    }
    this.registeredAuthService.verify(this.id);
    return this.registeredAuthService.getRating(this.id);
  }
}
