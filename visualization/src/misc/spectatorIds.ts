/** The known spectator IDs */
export enum SpectatorId {
  /** Shows all data */
  EVERYTHING = 'everything',
  /** Shows all data the matching service can see */
  MATCHING_SERVICE = 'match',
  /** Shows all data the authentication service can see */
  AUTHENTICATION_SERVICE = 'auth',
  /** Shows all data the general public */
  PUBLIC = 'public',
}
