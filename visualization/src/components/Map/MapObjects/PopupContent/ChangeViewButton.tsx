// Local imports
// > Components
import Button from '@components/Button';
// Type imports
import type {ReactSetState, ReactState} from '@misc/react';
import type {SimulationEndpointParticipantCoordinatesParticipant} from '@globals/types/simulation';

export interface ChangeViewButtonProps {
  actorState: ReactState<SimulationEndpointParticipantCoordinatesParticipant>;
  setStateSpectator: ReactSetState<string>;
}

export default function ChangeViewButton({
  actorState,
  setStateSpectator,
}: ChangeViewButtonProps) {
  return (
    <Button
      onClick={() => {
        console.log(`Change view to this spectator: ${actorState.id}`);
        setStateSpectator(actorState.id);
      }}
    >
      Change view to this actor
    </Button>
  );
}
