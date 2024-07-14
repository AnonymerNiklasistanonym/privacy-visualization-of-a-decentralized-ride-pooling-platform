// Package imports
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {Button} from '@mui/material';
import {Lock as LockIcon} from '@mui/icons-material';
// Local imports
// > Globals
import {simulationEndpoints} from '@globals/defaults/endpoints';
// > Misc
import {SpectatorId} from '@misc/spectatorIds';
import {debugComponentRender} from '@misc/debug';
// Type imports
import type {
  GlobalPropsFetch,
  GlobalPropsShowError,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
} from '@misc/props/global';
import type {ReactNode} from 'react';
import type {SimulationEndpointParticipantIdFromPseudonym} from '@globals/types/simulation';

export interface ButtonChangeSpectatorProps
  extends GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorSelectedElementsSet,
    GlobalPropsShowError,
    GlobalPropsFetch {}

export interface ButtonChangeSpectatorPropsInput
  extends ButtonChangeSpectatorProps {
  /** The ID of the spectator that the should be shown on clicking it */
  spectatorId: string;
  /** A custom label that should be displayed on the button */
  label: string;
  /** In case the supplied ID is a pseudonym some extra logic is required */
  isPseudonym?: boolean;
  /** Ignore that per default this ID cannot be resolved */
  ignoreUnableToResolve?: boolean;
  /** A custom icon that should be displayed on the button */
  icon?: ReactNode;
}

export default memo(ButtonChangeSpectator);

export function ButtonChangeSpectator({
  spectatorId,
  ignoreUnableToResolve,
  isPseudonym,
  icon,
  label,
  stateSpectatorId,
  setStateSpectatorId,
  fetchJsonSimulation,
  showError,
}: ButtonChangeSpectatorPropsInput) {
  debugComponentRender('ButtonChangeSpectator', true);
  const intl = useIntl();

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
        simulationEndpoints.apiV1.participantIdFromPseudonym(spectatorId)
      )
        .then(data => setStateResolvedPseudonym(data))
        .catch(err =>
          showError(
            'Simulation fetch participant ID from pseudonym [ButtonChangeSpectator]',
            err
          )
        );
    }
  }, [spectatorId, fetchJsonSimulation, isPseudonym, showError]);

  /** The resolved pseudonym ID */
  const resolvedPseudonymId = stateResolvedPseudonym?.id;

  /** If true it means that the actor is already selected */
  const isAlreadySelected =
    stateSpectatorId === spectatorId ||
    stateSpectatorId === stateResolvedPseudonym?.id;

  const spectatorCanSeePseudonym =
    ignoreUnableToResolve === true ||
    stateSpectatorId === SpectatorId.EVERYTHING ||
    // !!! This only works when there is only a single auth service!
    stateSpectatorId === SpectatorId.AUTHENTICATION_SERVICE ||
    stateSpectatorId === stateResolvedPseudonym?.id ||
    stateSpectatorId === stateResolvedPseudonym?.authServiceId;

  /** If true disable the button from being pressed */
  const disabled =
    isAlreadySelected || (isPseudonym && !spectatorCanSeePseudonym);

  /** The button label */
  const buttonLabel = useMemo<string>(() => {
    const buttonLabelSpectate = intl.formatMessage(
      {id: 'getacar.spectator.spectate'},
      {
        name: label,
      }
    );
    const buttonLabelInfo = [];
    if (isPseudonym && !spectatorCanSeePseudonym) {
      buttonLabelInfo.push(
        intl.formatMessage({
          id: 'pseudonym',
        }) + ` [${spectatorId}]`
      );
    }
    if (isPseudonym && spectatorCanSeePseudonym) {
      buttonLabelInfo.push(
        intl.formatMessage({
          id: 'pseudonym.resolved',
        }) + ` [${resolvedPseudonymId}]`
      );
    }
    if (isAlreadySelected) {
      buttonLabelInfo.push(
        intl.formatMessage({
          id: 'getacar.spectator.alreadySelected',
        })
      );
    }
    return `${buttonLabelSpectate}${
      buttonLabelInfo.length > 0 ? ` (${buttonLabelInfo.join(', ')})` : ''
    }`;
  }, [
    spectatorId,
    intl,
    isAlreadySelected,
    isPseudonym,
    label,
    resolvedPseudonymId,
    spectatorCanSeePseudonym,
  ]);

  const buttonOnClick = useCallback(() => {
    if (disabled) {
      console.warn('Button should not be able to be pressed when disabled');
      return;
    }
    // Update global spectator to the resolved actor ID from the supplied pseudonym
    if (isPseudonym && resolvedPseudonymId !== undefined) {
      setStateSpectatorId(resolvedPseudonymId);
    }
    // Update global spectator to the supplied actor ID
    if (isPseudonym !== true) {
      setStateSpectatorId(spectatorId);
    }
  }, [
    spectatorId,
    disabled,
    isPseudonym,
    setStateSpectatorId,
    resolvedPseudonymId,
  ]);

  return (
    <Button
      variant="contained"
      // Use custom icon if supplied
      startIcon={disabled ? <LockIcon /> : icon}
      disabled={disabled}
      onClick={buttonOnClick}
    >
      {buttonLabel}
    </Button>
  );
}
