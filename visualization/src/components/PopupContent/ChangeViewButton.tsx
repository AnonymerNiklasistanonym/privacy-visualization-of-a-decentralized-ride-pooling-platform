// Local imports
import Button from '@components/Button';
// Type imports
import type {FC} from 'react';
import type {ReactSetState, ReactState} from '@/globals/types/react';
import type {SimulationEndpointParticipantCoordinatesParticipant} from '@/globals/types/simulation';

export interface ChangeViewButtonProps {
  actorState: ReactState<SimulationEndpointParticipantCoordinatesParticipant>;
  setStateSpectator: ReactSetState<string>;
}

export const ChangeViewButton: FC<ChangeViewButtonProps> = ({
  actorState,
  setStateSpectator,
}) => {
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
};

export default ChangeViewButton;
