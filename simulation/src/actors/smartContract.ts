/* eslint-disable max-classes-per-file */
import {wait} from '../misc/wait';
import type {SmartContract as SmartContractType} from './types/blockchain';
import {SmartContractState} from './types/blockchain';
import {Actor} from './actor';

export class SmartContract extends Actor<SmartContractType> {
  private state: SmartContractState;

  private running: boolean = false;

  readonly customerPseudonym: string;

  readonly rideProviderPseudonym: string;

  constructor(
    id: string,
    customerPseudonym: string,
    rideProviderPseudonym: string
  ) {
    super(id, 'smartContract');
    this.state = SmartContractState.inProgress;
    this.customerPseudonym = customerPseudonym;
    this.rideProviderPseudonym = rideProviderPseudonym;
  }

  async run(): Promise<void> {
    if (this.running) {
      return;
    }
    this.running = true;
    switch (this.state) {
      case SmartContractState.inProgress:
        await wait(10 * 1000);
        this.state = SmartContractState.created;
        break;
      default:
        break;
    }
    this.running = false;
  }

  get json(): SmartContractType {
    return {
      id: this.id,
      customerPseudonym: this.customerPseudonym,
      rideProviderPseudonym: this.rideProviderPseudonym,
      state: this.state,
      type: 'smart_contract',
    };
  }
}
