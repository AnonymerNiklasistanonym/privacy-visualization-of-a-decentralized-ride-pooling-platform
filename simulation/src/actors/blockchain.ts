/* eslint-disable max-classes-per-file */
import {getRandomId} from '../misc/helpers';
import {Actor} from './actor';
// Type imports
import type {Simulation} from '../simulation';

export interface SimulationTypeBlockchain {
  id: string;
  type: 'blockchain';
  rideContracts: SimulationTypeRideContract[];
}

export interface SimulationTypeRideContract {
  id: string;
  customerPseudonym: string;
  rideProviderPseudonym: string;
  deposit: number;
}

export class Blockchain extends Actor<SimulationTypeBlockchain> {
  public rideContracts: SimulationTypeRideContract[] = [];
  constructor(id: string) {
    super(id, 'blockchain');
    // eslint-disable-next-line no-console
    console.debug(`Create blockchain ${id}`);
  }

  createRideContract(
    customerPseudonym: string,
    rideProviderPseudonym: string,
    maximumRideCost: number
  ): string {
    console.log(
      'Create ride contract between',
      customerPseudonym,
      'and',
      rideProviderPseudonym
    );
    const rideContractId = getRandomId();
    this.rideContracts.push({
      id: rideContractId,

      customerPseudonym,
      rideProviderPseudonym,
      deposit: maximumRideCost,
    });
    return rideContractId;
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
