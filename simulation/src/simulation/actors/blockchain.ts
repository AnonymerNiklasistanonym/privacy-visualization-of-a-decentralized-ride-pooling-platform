/* eslint-disable max-classes-per-file */

// Local imports
import {Actor} from './actor';
import {randomInt} from 'crypto';
// > Misc
import {getRandomId} from '../../misc/helpers';
// Type imports
import type {Simulation} from '../simulation';

export interface SimulationTypeBlockchain {
  id: string;
  type: 'blockchain';
  rideContracts: SimulationTypeRideContract[];
}

export interface SimulationTypeRideContract {
  walletId: string;
  customerPseudonym: string;
  rideProviderPseudonym: string;
  deposit: number;
  customerRating?: number;
  rideProviderRating?: number;
}

export class Blockchain extends Actor<SimulationTypeBlockchain> {
  public rideContracts: SimulationTypeRideContract[] = [];
  constructor(id: string) {
    super(id, 'blockchain');
  }

  createRideContract(
    customerPseudonym: string,
    rideProviderPseudonym: string,
    maximumRideCost: number
  ): string {
    this.logger.debug(
      'Create ride contract between',
      customerPseudonym,
      'and',
      rideProviderPseudonym
    );
    const rideContractId = getRandomId();
    this.rideContracts.push({
      walletId: rideContractId,

      customerPseudonym,
      deposit: maximumRideCost,
      rideProviderPseudonym,
    });
    return rideContractId;
  }

  rateParticipantRideContract(
    rideContractId: string,
    participantPseudonym: string,
    rating: number
  ) {
    this.logger.debug('Rate', participantPseudonym, rating);
    const rideContract = this.rideContracts.find(
      a => a.walletId === rideContractId
    );
    if (rideContract === undefined) {
      throw Error(`Ride contract '${rideContractId}' does not exist!`);
    }
    if (rideContract.customerPseudonym === participantPseudonym) {
      rideContract.rideProviderRating = rating;
    }
    if (rideContract.rideProviderPseudonym === participantPseudonym) {
      rideContract.customerRating = rating;
      rideContract.rideProviderRating = Math.max(
        randomInt(3),
        randomInt(4),
        randomInt(5)
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  run(simulation: Simulation): Promise<void> {
    throw new Error('Method not implemented.');
  }

  get json(): SimulationTypeBlockchain {
    return {
      id: this.id,

      rideContracts: this.rideContracts,

      type: 'blockchain',
    };
  }
}
