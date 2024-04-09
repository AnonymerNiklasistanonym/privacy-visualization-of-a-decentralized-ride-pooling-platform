// Type imports
import type {Simulation} from '../simulation';

/**
 * Abstract Class that represents an actor of the simulation.
 */
export abstract class Actor<JsonType> {
  /** Unique simulation ID. */
  public readonly id: string;

  /** Actor type ID. */
  protected readonly type: string;

  protected readonly verbose: boolean;

  /** Create instance of actor. */
  constructor(id: string, type: string, verbose = false) {
    this.id = id;
    this.type = type;
    this.verbose = verbose;
    this.printLog('Create actor');
  }

  printLog(...message: unknown[]) {
    if (!this.verbose) {
      return;
    }
    console.debug(
      new Date().toISOString(),
      this.type,
      this.logInfo(),
      ...message
    );
  }

  logInfo(): unknown {
    return {id: this.id};
  }

  /**
   * Automate action that the actor should do within the simulation.
   *
   * @param simulation Access other actors in the simulation.
   */
  abstract run(simulation: Simulation): Promise<void>;
  /** Get a JSON representation of the current state of the actor. */
  abstract get json(): JsonType;
}
