// Local imports
import {Actor} from './actor';
// > Misc
import {getRandomId} from '../../misc/helpers';

export interface SimulationTypeBlockchain {
  id: string;
  type: 'blockchain';
  rideContracts: SimulationTypeRideContract[];
}

/** Ride Contract details */
export interface SimulationTypeRideContract {
  /** Unique Ride Contract ID (e.g. blockchain wallet ID) */
  walletId: string;
  /** Customer participant verified pseudonym */
  customerPseudonym: string;
  /** Ride Provider participant verified pseudonym */
  rideProviderPseudonym: string;
  /** Deposit amount */
  deposit: number;
  /** Rating given from the Ride Provider to the Customer */
  customerRating?: number;
  /** Rating given from the Customer to the Ride Provider */
  rideProviderRating?: number;
  /** [Private message] Ride provider signaling customer that they arrived */
  rideProviderArrived?: boolean;
}

export class Blockchain extends Actor<SimulationTypeBlockchain> {
  /** All created ride contracts */
  public rideContracts: SimulationTypeRideContract[] = [];

  constructor(id: string) {
    super(id, 'blockchain');
  }

  /**
   * Create a Ride Contract on the Blockchain.
   *
   * @param customerPseudonym The verified pseudonym from the Customer initiating the contract
   * @param rideProviderPseudonym The verified pseudonym from the Ride Provider who won the MS auction
   * @param maximumRideCost The maximum ride cost (deposit)
   * @returns Unique Ride Contract address
   */
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

  getRideContract(rideContractId: string) {
    this.logger.debug('Get ride contract', rideContractId);
    const rideContract = this.rideContracts.find(
      a => a.walletId === rideContractId
    );
    if (rideContract === undefined) {
      throw Error(`Ride contract '${rideContractId}' does not exist!`);
    }
    return rideContract;
  }

  /**
   * Rate a participant of a Ride Contract.
   *
   * @param rideContractId Unique Ride Contract address
   * @param participantPseudonym The verified pseudonym from the participant
   * @param rating The rating of the other party
   */
  rateParticipantRideContract(
    rideContractId: string,
    participantPseudonym: string,
    rating: number
  ) {
    this.logger.debug(
      'Rate ride contract participant',
      participantPseudonym,
      rating
    );
    const rideContract = this.getRideContract(rideContractId);
    if (rideContract.customerPseudonym === participantPseudonym) {
      rideContract.rideProviderRating = rating;
    } else if (rideContract.rideProviderPseudonym === participantPseudonym) {
      rideContract.customerRating = rating;
    } else {
      throw Error(
        `Ride contract '${rideContractId}' does not contain the participant '${participantPseudonym}'!`
      );
    }
  }

  helperSetRideProviderArrived(rideContractId: string) {
    this.logger.debug('[HELPER] Set ride provider arrived', rideContractId);
    const rideContract = this.getRideContract(rideContractId);
    rideContract.rideProviderArrived = true;
  }

  run(): Promise<void> {
    throw new Error('Passive actor, do not run!');
  }

  get json(): SimulationTypeBlockchain {
    return {
      id: this.id,

      rideContracts: this.rideContracts,

      type: 'blockchain',
    };
  }
}
