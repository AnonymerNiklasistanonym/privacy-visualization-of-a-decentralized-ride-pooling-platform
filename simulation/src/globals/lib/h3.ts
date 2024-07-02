// This file was copied from the global types directory, do not change!

// Package imports
import {cellToLatLng, cellsToMultiPolygon, latLngToCell} from 'h3-js';
// Local imports
import {h3Resolution} from '../defaults/h3';
// Type imports
import type {Coordinates} from '../types/coordinates';

export const getH3Location = (location: Readonly<Coordinates>): string =>
  latLngToCell(location.lat, location.long, h3Resolution);
export const getH3CellCenter = (h3Index: string): Coordinates => {
  const temp = cellToLatLng(h3Index);
  return {lat: temp[0], long: temp[1]};
};
export const getH3Polygon = (h3Index: string): [number, number][] =>
  cellsToMultiPolygon([h3Index])[0][0];
