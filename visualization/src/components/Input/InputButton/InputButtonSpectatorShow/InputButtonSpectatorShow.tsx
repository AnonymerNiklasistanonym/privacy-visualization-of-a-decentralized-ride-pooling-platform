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
  GlobalPropsTabIndexSet,
} from '@misc/props/global';
import type {ReactNode} from 'react';
import type {SimulationEndpointParticipantIdFromPseudonym} from '@globals/types/simulation';

export interface ButtonShowSpectatorProps
  extends GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorSelectedElementsSet,
    GlobalPropsShowError,
    GlobalPropsTabIndexSet,
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
  stateSpectatorId,
  stateSelectedParticipantId,
  setStateSelectedParticipantId,
  setStateShowParticipantId,
  setStateTabIndex,
  fetchJsonSimulation,
  showError,
}: ButtonShowSpectatorPropsInput) {
  debugComponentRender('ButtonShowSpectator');
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
    stateSelectedParticipantId === spectatorId ||
    stateSelectedParticipantId === stateResolvedPseudonym?.id;

  const spectatorCanSeePseudonym =
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
      setStateSelectedParticipantId(resolvedPseudonymId);
      setStateShowParticipantId(resolvedPseudonymId);
      setStateTabIndex(0);
    }
    // Update global spectator to the supplied actor ID
    if (isPseudonym !== true) {
      setStateSelectedParticipantId(spectatorId);
      setStateShowParticipantId(spectatorId);
      setStateTabIndex(0);
    }
  }, [
    disabled,
    isPseudonym,
    resolvedPseudonymId,
    setStateSelectedParticipantId,
    setStateShowParticipantId,
    setStateTabIndex,
    spectatorId,
  ]);

  // Use custom icon if supplied
  const startIcon = useMemo<ReactNode>(
    () => (disabled ? <LockIcon /> : icon),
    [disabled, icon]
  );

  return (
    <Button
      variant="contained"
      // Use custom icon if supplied
      startIcon={startIcon}
      disabled={disabled}
      onClick={buttonOnClick}
    >
      {buttonLabel}
    </Button>
  );
}
