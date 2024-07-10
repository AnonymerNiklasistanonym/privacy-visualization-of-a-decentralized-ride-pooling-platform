// Type imports
import type {ReactNode} from 'react';

export type ModalDataInformationAccessType =
  | 'none'
  | 'owner'
  | 'local_storage'
  | 'transitive';

export interface ModalDataInformation {
  icon?: ReactNode;
  isPseudonym?: boolean;
  accessType: ModalDataInformationAccessType;
  name: string;
  description?: string;
  spectatorId: string;
  spectatorInformation?: ReactNode;
}
