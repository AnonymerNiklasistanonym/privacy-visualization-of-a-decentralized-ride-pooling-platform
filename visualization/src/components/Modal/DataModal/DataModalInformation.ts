// Type imports
import type {ReactNode} from 'react';

export type DataModalInformationAccessType =
  | 'none'
  | 'owner'
  | 'local_storage'
  | 'transitive';

export interface DataModalInformation {
  icon?: ReactNode;
  isPseudonym?: boolean;
  accessType: DataModalInformationAccessType;
  name: string;
  description?: string;
  spectatorId: string;
  spectatorInformation?: ReactNode;
}
