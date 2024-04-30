// Package imports
import {useEffect, useState} from 'react';
// > Components
import {Button} from '@mui/material';
// > Icons
import {Lock as LockIcon} from '@mui/icons-material';
// Local imports
import {fetchJsonEndpoint} from '@misc/fetch';
import {simulationEndpoints} from '@globals/defaults/endpoints';
// Type imports
import type {
  GlobalStatesShowError,
  GlobalStatesStates,
} from '@misc/globalStates';
import type {ReactSetState, ReactState} from '@misc/react';
import type {ReactNode} from 'react';
import type {SimulationEndpointParticipantIdFromPseudonym} from '@globals/types/simulation';

export interface ChangeViewButtonProps
  extends GlobalStatesStates,
    GlobalStatesShowError {
  actorId: string;
  isPseudonym: boolean;
  icon?: ReactNode;
  label: string;
  setStateSpectator: ReactSetState<string>;
  stateBaseUrlSimulation: ReactState<string>;
}

export default function ChangeViewButton({
  actorId,
  isPseudonym,
  icon,
  label,
  stateSpectator,
  setStateSpectator,
  stateBaseUrlSimulation,
  stateShowError,
}: ChangeViewButtonProps) {
  const [stateActorId, setStateActorId] = useState<
    SimulationEndpointParticipantIdFromPseudonym | undefined
  >(undefined);
  useEffect(() => {
    if (isPseudonym) {
      fetchJsonEndpoint<SimulationEndpointParticipantIdFromPseudonym>(
        stateBaseUrlSimulation,
        simulationEndpoints.apiV1.participantIdFromPseudonym(actorId)
      )
        .then(data => setStateActorId(data))
        .catch(err =>
          stateShowError('Simulation fetch participant id from pseudonym', err)
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
