// Package imports
import {cellsToMultiPolygon, latLngToCell} from 'h3-js';
// Local imports
import {h3Resolution} from '../defaults/h3';
// Type imports
import type {Coordinates} from '../types/coordinates';

export const getH3Location = (location: Readonly<Coordinates>): string =>
  latLngToCell(location.lat, location.long, h3Resolution);
export const getH3Polygon = (h3Index: string): [number, number][] =>
  cellsToMultiPolygon([h3Index])[0][0];
