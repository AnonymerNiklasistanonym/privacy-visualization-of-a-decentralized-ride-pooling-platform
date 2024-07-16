// Type imports
import type {ReactElement, ReactNode} from 'react';

export type ModalDataInformationAccessType =
  | 'none'
  | 'owner'
  | 'local_storage'
  | 'transitive';

export interface ModalDataInformationAccess {
  /** The icon of the entity that has access (or not) */
  icon?: ReactNode;
  /** Indicator if it's ID is a pseudonym */
  isPseudonym?: boolean;
  /** The type of access this entity has */
  accessType: ModalDataInformationAccessType;
  /** The name of the entity */
  name: string;
  /** Optional description on why this entity has access (or not) */
  description?: string;
  /** The spectator ID of this entity */
  spectatorId: string;
  /** Optional information element of the spectator of this entity */
  spectatorInformation?: ReactNode;
}

export interface ModalDataInformationOrigin {
  /** The data owner icon */
  dataOriginIcon: ReactElement;
  /** The data owner ID */
  dataOriginId: string;
  /** The data owner name */
  dataOriginName: string;
}

export interface ModalDataInformation {
  /** The origin of the data */
  informationAccess: Array<ModalDataInformationAccess>;
  /** The origin of the data */
  informationOrigin: ModalDataInformationOrigin;
  /** The data label */
  dataLabel: string;
  /** The data value element */
  dataValue: ReactNode;
  /** The data value element as rendered by the current spectator */
  dataValueSpectator: ReactNode;
}
