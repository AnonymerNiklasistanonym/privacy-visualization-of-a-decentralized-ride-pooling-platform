// Package imports
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {Button, Tooltip} from '@mui/material';
import {Lock as LockIcon} from '@mui/icons-material';
// Local imports
// > Globals
import {constants} from 'lib_globals';
// > Misc
import {debugComponentRender, debugMemoHelper} from '@misc/debug';
import {SpectatorId} from '@misc/spectatorIds';
// Type imports
import type {
  GlobalPropsFetch,
  GlobalPropsShowError,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
  GlobalPropsTabIndexSet,
} from '@misc/props/global';
import type {ReactNode} from 'react';
import type {SimulationEndpointParticipantIdFromPseudonym} from 'lib_globals';

export interface InputButtonSpectatorShowProps
  extends GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorSelectedElementsSet,
    GlobalPropsShowError,
    GlobalPropsTabIndexSet,
    GlobalPropsFetch {}

export interface BInputButtonSpectatorShowPropsInput
  extends InputButtonSpectatorShowProps {
  /** The ID of the spectator that the should be shown on clicking it */
  spectatorId: string;
  /** A custom label that should be displayed on the button */
  label?: string;
  /** In case the supplied ID is a pseudonym some extra logic is required */
  isPseudonym?: boolean;
  /** A custom icon that should be displayed on the button */
  icon?: ReactNode;
}

export default memo(InputButtonSpectatorShow, (prev, next) =>
  debugMemoHelper('InputButtonSpectatorShow', undefined, prev, next)
);

export function InputButtonSpectatorShow({
  spectatorId,
  isPseudonym,
  icon,
  label,
  stateSpectatorId,
  setStateSelectedParticipantId,
  setStateShowParticipantId,
  setStateTabIndex,
  fetchJsonSimulation,
  showError,
}: BInputButtonSpectatorShowPropsInput) {
  debugComponentRender('InputButtonSpectatorShow');
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
        constants.endpoints.simulation.apiV1.participantIdFromPseudonym(
          spectatorId
        )
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

  const spectatorCanSeePseudonym =
    stateSpectatorId === SpectatorId.EVERYTHING ||
    // !!! This only works when there is only a single auth service!
    stateSpectatorId === SpectatorId.AUTHENTICATION_SERVICE ||
    stateSpectatorId === stateResolvedPseudonym?.id ||
    stateSpectatorId === stateResolvedPseudonym?.authServiceId;

  /** If true disable the button from being pressed */
  const disabled = isPseudonym && !spectatorCanSeePseudonym;

  /** The button label */
  const buttonLabel = useMemo<string>(() => {
    const buttonLabelSpectate =
      label !== undefined
        ? intl.formatMessage(
            {id: 'getacar.spectator.message.showParticipant'},
            {
              name: label,
            }
          )
        : intl.formatMessage({id: 'getacar.spectator.message.show'});
    const buttonLabelInfo = [];
    if (isPseudonym && !spectatorCanSeePseudonym) {
      buttonLabelInfo.push(
        intl.formatMessage({
          id: 'pseudonym',
        }) + ` [${spectatorId}]`
      );
    }
    if (
      isPseudonym &&
      spectatorCanSeePseudonym &&
      stateResolvedPseudonym?.id !== undefined
    ) {
      buttonLabelInfo.push(
        intl.formatMessage({
          id: 'pseudonym.resolved',
        }) + ` [${stateResolvedPseudonym.id}]`
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
    if (isPseudonym && !spectatorCanSeePseudonym) {
      return intl.formatMessage({
        id: 'getacar.spectator.message.unableToResolvePseudonym',
      });
    }
    return '';
  }, [intl, isPseudonym, spectatorCanSeePseudonym]);

  const buttonOnClick = useCallback(() => {
    if (disabled) {
      console.warn('Button should not be able to be pressed when disabled');
      return;
    }
    // Update global spectator to the resolved actor ID from the supplied pseudonym
    if (isPseudonym && stateResolvedPseudonym?.id !== undefined) {
      setStateSelectedParticipantId(stateResolvedPseudonym.id);
      setStateShowParticipantId(stateResolvedPseudonym.id);
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
    stateResolvedPseudonym?.id,
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
