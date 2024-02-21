export interface Coordinates {
  latitude: number
  longitude: number
}

export interface Participant {
  id: string
  name: string
  fullName: string
  birthday: string
  address: string
  currentPos: Coordinates
  type: 'customer' | 'ride_provider'
}

export interface Customer extends Participant {
  type: 'customer'
}

export interface RideProvider extends Participant {
  type: 'ride_provider'
}

// TODO
