export interface Area {
  latitude: number
  longitude: number
  radius: number
}

export interface Service {
  id: string
  currentArea: Area
  type: 'authentication' | 'matching'
}

export interface AuthenticationServiceParticipantDbEntry {
  id: string
  name: string
  fullName: string
  birthday: string
  address: string
  pseudonyms: string[]
}

export interface AuthenticationService extends Service {
  participantDb: AuthenticationServiceParticipantDbEntry[]
  type: 'authentication'
}

export interface MatchingService extends Service {
  type: 'matching'
}

// TODO
