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

/** Props necessary to render the 'Change View Button' */
export interface ChangeViewButtonProps
  extends GlobalPropsUserInput,
    GlobalPropsUserInputSetSpectator,
    GlobalPropsShowError,
    GlobalPropsFetch {}

export interface ChangeViewButtonPropsInput extends ChangeViewButtonProps {
  /** The ID of the actor that the view should be changed to on clicking it */
  actorId: string;
  /** A custom label that should be displayed on the button */
  label: string;
  /** In case the supplied ID is a pseudonym some extra logic is required */
  isPseudonym?: boolean;
  /** A custom icon that should be displayed on the button */
  icon?: ReactNode;
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
}: ChangeViewButtonPropsInput) {
  // React: States
  // > Fetching of actual actor ID in case it was a pseudonym
  const [stateResolvedPseudonym, setStateResolvedPseudonym] = useState<
    SimulationEndpointParticipantIdFromPseudonym | undefined
  >(undefined);

  // React: Run on first render
  // > In case the actor ID is a pseudonym fetch the actual actor ID
  useEffect(() => {
    if (isPseudonym) {
      fetchJsonSimulation<SimulationEndpointParticipantIdFromPseudonym>(
        simulationEndpoints.apiV1.participantIdFromPseudonym(actorId)
      )
        .then(data => setStateResolvedPseudonym(data))
        .catch(err =>
          showError('Simulation fetch participant ID from pseudonym', err)
        );
    }
  });

  /** If true it means that the actor is already selected */
  const isAlreadySelected =
    stateSpectator === actorId || stateSpectator === stateResolvedPseudonym?.id;
  /** If true disable the button from being pressed */
  const disabled =
    isAlreadySelected ||
    (isPseudonym &&
      stateSpectator !== 'everything' &&
      stateSpectator !== stateResolvedPseudonym?.authServiceId);
  /** The button label */
  let buttonLabel = `Spectate ${label}`;

  if (isPseudonym) {
    buttonLabel += ` (Pseudonym: ${actorId})`;
  }
  if (isAlreadySelected) {
    buttonLabel += ' (Already selected)';
  }

  return (
    <Button
      variant="contained"
      // Use custom icon if supplied
      startIcon={disabled ? <LockIcon /> : icon}
      disabled={disabled}
      onClick={() => {
        if (disabled) {
          console.warn('Button should not be able to be pressed when disabled');
          return;
        }
        // Update global spectator to the resolved actor ID from the supplied pseudonym
        if (isPseudonym && stateResolvedPseudonym !== undefined) {
          setStateSpectator(stateResolvedPseudonym.id);
        }
        // Update global spectator to the supplied actor ID
        if (isPseudonym !== true) {
          setStateSpectator(actorId);
        }
      }}
    >
      {buttonLabel}
    </Button>
  );
}
