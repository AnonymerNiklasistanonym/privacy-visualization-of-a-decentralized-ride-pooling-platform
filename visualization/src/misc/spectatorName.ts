// Type imports
import type {GlobalPropsSpectatorInfo} from './props/global';

export const spectatorName = (
  spectatorId: string,
  altStringBuilder: (spectatorId: string) => string,
  spectatorInfo?: GlobalPropsSpectatorInfo
) =>
  spectatorInfo !== undefined
    ? `${spectatorInfo.name} (${spectatorId})`
    : altStringBuilder(spectatorId);
