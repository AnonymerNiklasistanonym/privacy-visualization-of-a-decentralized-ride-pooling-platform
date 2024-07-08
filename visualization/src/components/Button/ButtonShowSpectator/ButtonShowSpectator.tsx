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
import {debugComponentUpdate} from '@misc/debug';
// Type imports
import type {
  GlobalPropsFetch,
  GlobalPropsShowError,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
} from '@misc/props/global';
import type {ReactNode} from 'react';
import type {SimulationEndpointParticipantIdFromPseudonym} from '@globals/types/simulation';

export interface ButtonShowSpectatorProps
  extends GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorSelectedElementsSet,
    GlobalPropsShowError,
    GlobalPropsFetch {}

export interface ButtonShowSpectatorPropsInput
  extends ButtonShowSpectatorProps {
  /** The ID of the spectator that the should be shown on clicking it */
  spectatorId: string;
  /** A custom label that should be displayed on the button */
  label: string;
  /** In case the supplied ID is a pseudonym some extra logic is required */
  isPseudonym?: boolean;
  /** A custom icon that should be displayed on the button */
  icon?: ReactNode;
}

export default memo(ButtonShowSpectator);

export function ButtonShowSpectator({
  spectatorId,
  isPseudonym,
  icon,
  label,
  stateSpectator,
  stateSelectedSpectator,
  setStateSelectedSpectator,
  setStateShowSpectator,
  fetchJsonSimulation,
  showError,
}: ButtonShowSpectatorPropsInput) {
  debugComponentUpdate('ButtonShowSpectator', true);
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
            'Simulation fetch participant ID from pseudonym [ButtonShowSpectator]',
            err
          )
        );
    }
  }, [spectatorId, fetchJsonSimulation, isPseudonym, showError]);

  /** The resolved pseudonym ID */
  const resolvedPseudonymId = stateResolvedPseudonym?.id;

  /** If true it means that the actor is already selected */
  const isAlreadySelected =
    stateSelectedSpectator === spectatorId ||
    stateSelectedSpectator === stateResolvedPseudonym?.id;

  const spectatorCanSeePseudonym =
    stateSpectator === 'everything' ||
    stateSpectator === stateResolvedPseudonym?.id ||
    stateSpectator === stateResolvedPseudonym?.authServiceId;

  /** If true disable the button from being pressed */
  const disabled =
    isAlreadySelected || (isPseudonym && !spectatorCanSeePseudonym);

  /** The button label */
  const buttonLabel = useMemo<string>(() => {
    const buttonLabelSpectate = intl.formatMessage(
      {id: 'getacar.spectator.show'},
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
      setStateSelectedSpectator(resolvedPseudonymId);
      setStateShowSpectator(resolvedPseudonymId);
    }
    // Update global spectator to the supplied actor ID
    if (isPseudonym !== true) {
      setStateSelectedSpectator(spectatorId);
      setStateShowSpectator(spectatorId);
    }
  }, [
    spectatorId,
    disabled,
    isPseudonym,
    setStateSelectedSpectator,
    setStateShowSpectator,
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
