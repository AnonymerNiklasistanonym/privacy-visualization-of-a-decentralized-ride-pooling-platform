// Package imports
import {useEffect, useState} from 'react';
// > Components
import {Button} from '@mui/material';
// > Icons
import {Lock as LockIcon} from '@mui/icons-material';
// Local imports
import {simulationEndpoints} from '@globals/defaults/endpoints';
// Type imports
import type {
  GlobalPropsFetch,
  GlobalPropsShowError,
  GlobalPropsUserInput,
  GlobalPropsUserInputSetSpectator,
} from '@misc/globalProps';
import type {ReactNode} from 'react';
import type {SimulationEndpointParticipantIdFromPseudonym} from '@globals/types/simulation';

export interface ChangeViewButtonProps
  extends GlobalPropsUserInput,
    GlobalPropsUserInputSetSpectator,
    GlobalPropsShowError,
    GlobalPropsFetch {
  actorId: string;
  isPseudonym: boolean;
  icon?: ReactNode;
  label: string;
}

export default function ChangeViewButton({
  actorId,
  isPseudonym,
  icon,
  label,
  stateSpectator,
  setStateSpectator,
  fetchJsonSimulation,
  showError,
}: ChangeViewButtonProps) {
  const [stateActorId, setStateActorId] = useState<
    SimulationEndpointParticipantIdFromPseudonym | undefined
  >(undefined);
  useEffect(() => {
    if (isPseudonym) {
      fetchJsonSimulation<SimulationEndpointParticipantIdFromPseudonym>(
        simulationEndpoints.apiV1.participantIdFromPseudonym(actorId)
      )
        .then(data => setStateActorId(data))
        .catch(err =>
          showError('Simulation fetch participant id from pseudonym', err)
        );
    }
  });
  // Only make the button available if the current spectator can access it
  const disabled =
    isPseudonym &&
    stateSpectator !== 'everything' &&
    stateSpectator !== stateActorId?.authServiceId;
  return (
    <Button
      variant="contained"
      startIcon={disabled ? <LockIcon /> : icon}
      disabled={disabled}
      onClick={() => {
        if (!disabled && stateActorId !== undefined) {
          console.log(`Update spectator to spectator: ${stateActorId.id}`);
          setStateSpectator(stateActorId.id);
        } else if (!isPseudonym) {
          console.log(`Update spectator to: ${actorId}`);
          setStateSpectator(actorId);
        } else {
          console.log('Can`t update spectator!');
        }
      }}
    >
      Spectate {label}
      {disabled ? ` (Pseudonym: ${actorId})` : ''}
    </Button>
  );
}
