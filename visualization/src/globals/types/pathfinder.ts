// This file was copied from the global types directory, do not change!

import type {Coordinates} from './coordinates';

export interface PathfinderEndpointGraphInformation {
  edges: Array<Array<Coordinates>>;
  vertices: Array<{id: number} & Coordinates>;
}
