// Local imports
import {Actor} from './actor';
// Type imports
import type {Coordinates} from '../../globals/types/coordinates';

export interface Area extends Coordinates {
  radius: number;
}

export interface SimulationTypeService {
  id: string;
  currentArea: Area;
  type: 'authentication' | 'matching';
}

export abstract class Service<JsonType> extends Actor<JsonType> {
  protected currentArea: {
    lat: number;
    long: number;
    radius: number;
  };

  constructor(
    id: string,
    type: string,
    lat: number,
    long: number,
    radius: number
  ) {
    super(id, type);
    this.currentArea = {
      lat,
      long,
      radius,
    };
  }

  get endpointService() {
    return {
      id: this.id,

      currentArea: this.currentArea,
    };
  }
}
