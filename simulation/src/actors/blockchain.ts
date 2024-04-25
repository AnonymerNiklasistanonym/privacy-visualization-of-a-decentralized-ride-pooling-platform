/* eslint-disable max-classes-per-file */
import {Actor} from './actor';
import {getRandomId} from '../misc/helpers';
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
  constructor(id: string, verbose = false) {
    super(id, 'blockchain', verbose);
  }

  createRideContract(
    customerPseudonym: string,
    rideProviderPseudonym: string,
    maximumRideCost: number
  ): string {
    this.printLog(
      'Create ride contract between',
      customerPseudonym,
      'and',
      rideProviderPseudonym
    );
    const rideContractId = getRandomId();
    this.rideContracts.push({
      id: rideContractId,

      customerPseudonym,
      deposit: maximumRideCost,
      rideProviderPseudonym,
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
