/* eslint-disable max-classes-per-file */
import wait from '../misc/wait';
import type { SmartContract as SmartContractType } from '../types/blockchain';
import { SmartContractState } from '../types/blockchain';
import Actor from './actor';

export default class SmartContract extends Actor<SmartContractType> {
  private state: SmartContractState;

  readonly customerPseudonym: string;

  readonly rideProviderPseudonym: string;

  constructor(id: string, customerPseudonym: string, rideProviderPseudonym: string) {
    super(id);
    this.state = SmartContractState.inProgress;
    this.customerPseudonym = customerPseudonym;
    this.rideProviderPseudonym = rideProviderPseudonym;
  }

  async run(timeStep: number): Promise<void> {
    if (this.running) {
      return;
    }
    this.running = true;
    switch (this.state) {
      case SmartContractState.inProgress:
        await wait(timeStep * 10 * 1000);
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
