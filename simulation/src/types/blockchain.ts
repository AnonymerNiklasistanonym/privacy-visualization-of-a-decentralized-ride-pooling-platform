export enum SmartContractState {
  inProgress = 'in_progress',
  created = 'created',
}

export interface SmartContract {
  id: string;
  customerPseudonym: string;
  rideProviderPseudonym: string;
  state: SmartContractState;
  type: 'smart_contract';
}
