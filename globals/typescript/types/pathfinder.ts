import type {Coordinates} from './coordinates';

export interface PathfinderEndpointGraphInformation {
  edges: Array<Array<Coordinates>>;
  vertices: Array<{id: number} & Coordinates>;
}
