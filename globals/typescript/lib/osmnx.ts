// Type imports
import type {Coordinates} from '../types/coordinates';

export type OsmnxServerResponse =
  | OsmnxServerResponseSuccessful
  | OsmnxServerResponseError;

export interface OsmnxServerResponseGeneric {
  shortest_route_travel_time?: Coordinates[];
  shortest_route_length?: Coordinates[];
  error: string | null;
}
export interface OsmnxServerResponseSuccessful
  extends OsmnxServerResponseGeneric {
  shortest_route_travel_time: Coordinates[];
  shortest_route_length: Coordinates[];
  error: null;
}
export interface OsmnxServerResponseError extends OsmnxServerResponseGeneric {
  shortest_route_travel_time: undefined;
  shortest_route_length: undefined;
  error: string;
}
