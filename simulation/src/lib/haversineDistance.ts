// optimized version of the package 'haversineDistance'
import type {Coordinates} from '../globals/types/coordinates';

const asin = Math.asin;
const cos = Math.cos;
const sin = Math.sin;
const sqrt = Math.sqrt;
const PI = Math.PI;

/** equatorial mean radius of Earth (in meters) */
const R = 6378137;

const squared = (x: number) => x * x;
const toRad = (x: number) => (x * PI) / 180.0;
const hav = (x: number) => squared(sin(x / 2));

/**
 * hav(theta) = hav(bLat - aLat) + cos(aLat) * cos(bLat) * hav(bLon - aLon)
 *
 * @returns Distance between 2 coordinates in m
 */
export function haversineDistance(
  a: Readonly<Coordinates>,
  b: Readonly<Coordinates>
): number {
  const aLat = toRad(a.lat);
  const bLat = toRad(b.lat);
  const aLng = toRad(a.long);
  const bLng = toRad(b.long);

  const ht = hav(bLat - aLat) + cos(aLat) * cos(bLat) * hav(bLng - aLng);
  return 2 * R * asin(sqrt(ht));
}
