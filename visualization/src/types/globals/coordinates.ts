// This file was copied from the global types directory, do not change!

/**
 * Represents a point on the earth sphere.
 * (https://en.wikipedia.org/wiki/Geographic_coordinate_system)
 *
 * ![Point calculation visualization](https://upload.wikimedia.org/wikipedia/commons/8/83/Latitude_and_longitude_graticule_on_a_sphere.svg)
 */
export interface Coordinates {
  /** Latitude */
  lat: number;
  /** Longitude */
  long: number;
}
