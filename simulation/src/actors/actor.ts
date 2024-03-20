import type { Simulation } from '../simulation';

/**
 * Abstract Class that represents an actor of the simulation.
 */
export default abstract class Actor<JsonType> {
  /** Unique simulation ID. */
  protected readonly id: string;
  /** Actor type ID. */
  protected readonly type: string;

  /** Create instance of actor. */
  constructor(id: string, type: string) {
    this.id = id;
    this.type = type;
    console.debug(`Create actor ${type}#${id}`);
  }

  /**
   * Automate action that the actor should do within the simulation.
   *
   * @param simulation Access other actors in the simulation
   */
  abstract run(simulation: Simulation): Promise<void>;
  /** Get a JSON representation of the current state of the actor. */
  abstract get json(): JsonType;
}
