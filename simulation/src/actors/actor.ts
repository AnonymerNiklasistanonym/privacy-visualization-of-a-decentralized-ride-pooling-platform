import type { Simulation } from '../simulation';

export default abstract class Actor<JsonType> {
  protected id: string;

  protected running: boolean;

  constructor(id: string) {
    this.id = id;
    this.running = false;
  }

  abstract run(timeStep: number, simulation: Simulation): Promise<void>;
  abstract get json(): JsonType;
}
