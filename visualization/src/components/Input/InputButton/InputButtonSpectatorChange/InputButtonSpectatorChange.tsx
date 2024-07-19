// Package imports
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {Button, Tooltip} from '@mui/material';
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

export interface InputButtonSpectatorChangeProps
  extends GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorSelectedElementsSet,
    GlobalPropsShowError,
    GlobalPropsFetch {}

export interface InputButtonSpectatorChangePropsInput
  extends InputButtonSpectatorChangeProps {
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

export default memo(InputButtonSpectatorChange);

export function InputButtonSpectatorChange({
  spectatorId,
  ignoreUnableToResolve,
  isPseudonym,
  icon,
  label,
  stateSpectatorId,
  setStateSpectatorId,
  fetchJsonSimulation,
  showError,
}: InputButtonSpectatorChangePropsInput) {
  debugComponentRender('InputButtonSpectatorChange');
  const intl = useIntl();

  // React: States
  // > Fetching of actual actor ID in case it was a pseudonym
  const [stateResolvedPseudonym, setStateResolvedPseudonym] = useState<
    SimulationEndpointParticipantIdFromPseudonym | undefined
  >(undefined);

  // React: State change listener
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

  const isAlreadySelected = useMemo(() => {
    return (
      stateSpectatorId === spectatorId ||
      stateSpectatorId === stateResolvedPseudonym?.id
    );
  }, [spectatorId, stateResolvedPseudonym?.id, stateSpectatorId]);

  const spectatorCanSeePseudonym = useMemo(() => {
    return (
      ignoreUnableToResolve === true ||
      stateSpectatorId === SpectatorId.EVERYTHING ||
      // !!! This only works when there is only a single auth service!
      stateSpectatorId === SpectatorId.AUTHENTICATION_SERVICE ||
      stateSpectatorId === stateResolvedPseudonym?.id ||
      stateSpectatorId === stateResolvedPseudonym?.authServiceId
    );
  }, [
    ignoreUnableToResolve,
    stateResolvedPseudonym?.authServiceId,
    stateResolvedPseudonym?.id,
    stateSpectatorId,
  ]);

  /** If true disable the button from being pressed */
  const disabled = useMemo(() => {
    return isAlreadySelected || (isPseudonym && !spectatorCanSeePseudonym);
  }, [isAlreadySelected, isPseudonym, spectatorCanSeePseudonym]);

  /** The button label */
  const buttonLabel = useMemo<string>(() => {
    const buttonLabelSpectate = intl.formatMessage(
      {id: 'getacar.spectator.message.change'},
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
        }) + ` [${stateResolvedPseudonym?.id}]`
      );
    }
    return `${buttonLabelSpectate}${
      buttonLabelInfo.length > 0 ? ` (${buttonLabelInfo.join(', ')})` : ''
    }`;
  }, [
    spectatorId,
    intl,
    isPseudonym,
    label,
    stateResolvedPseudonym?.id,
    spectatorCanSeePseudonym,
  ]);

  const tooltip = useMemo<string>(() => {
    if (isAlreadySelected) {
      return intl.formatMessage({
        id: 'getacar.spectator.alreadySelected',
      });
    }
    return '';
  }, [intl, isAlreadySelected]);

  const buttonOnClick = useCallback(() => {
    if (disabled) {
      console.warn('Button should not be able to be pressed when disabled');
      return;
    }
    // Update global spectator to the resolved actor ID from the supplied pseudonym
    if (isPseudonym && stateResolvedPseudonym?.id !== undefined) {
      setStateSpectatorId(stateResolvedPseudonym?.id);
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
    stateResolvedPseudonym?.id,
  ]);

  // Use custom icon if supplied
  const startIcon = useMemo<ReactNode>(
    () => (disabled ? <LockIcon /> : icon),
    [disabled, icon]
  );

  return (
    <Tooltip title={tooltip}>
      <span>
        <Button
          disabled={disabled}
          onClick={buttonOnClick}
          size="small"
          startIcon={startIcon}
          variant="outlined"
        >
          {buttonLabel}
        </Button>
      </span>
    </Tooltip>
  );
}
