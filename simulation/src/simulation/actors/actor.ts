// Local imports
// > Services
import {createLoggerSection} from '../../services/logging';
// Type imports
import type {LoggerSections} from 'lib_globals_fs';
import type {Simulation} from '../simulation';

/**
 * Abstract Class that represents an actor of the simulation.
 */
export abstract class Actor<JsonType, T extends string = string> {
  /** Unique simulation ID. */
  public readonly id: string;

  /** Actor type ID. */
  protected readonly type: T;

  /** Actor logger. */
  protected readonly logger: LoggerSections;

  /** Actor status (currently used for debugging). */
  protected status: string;

  /** Create instance of actor. */
  constructor(id: string, type: T) {
    this.id = id;
    this.type = type;
    this.status = 'created';
    this.logger = createLoggerSection('actor', `${type}#${id}`);
    this.logger.debug('Create');
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
