// Package imports
import {memo} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {ButtonGroup} from '@mui/material';
// Local imports
// > Components
import {
  ServiceAuthenticationIcon,
  ServiceMatchingIcon,
  SpectatorEverythingIcon,
  SpectatorPublicIcon,
} from '@components/Icons';
import GenericButton from '@components/Button/GenericButton';
// Type imports
import type {
  GlobalPropsSpectatorMap,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
} from '@misc/props/global';
import {debugComponentUpdate, debugMemoHelper} from '@misc/debug';

export interface SectionChangeSpectatorProps
  extends GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorMap,
    GlobalPropsSpectatorSelectedElementsSet {}

export default memo(SectionChangeSpectator);

export function SectionChangeSpectator(props: SectionChangeSpectatorProps) {
  debugComponentUpdate('SectionChangeSpectator');
  return (
    <>
      <ButtonGroup
        variant="contained"
        sx={{
          display: {md: 'none', sm: 'none', xs: 'block'},
        }}
      >
        <ButtonCurrentSpectator {...props} />
      </ButtonGroup>
      <ButtonGroup
        variant="contained"
        sx={{
          display: {md: 'none', sm: 'none', xs: 'block'},
        }}
      >
        <ButtonEverything {...props} />
      </ButtonGroup>
      <ButtonGroup
        variant="contained"
        sx={{
          display: {md: 'none', sm: 'none', xs: 'block'},
        }}
      >
        <ButtonPublic {...props} />
      </ButtonGroup>
      <ButtonGroup
        variant="contained"
        sx={{
          display: {md: 'none', sm: 'none', xs: 'block'},
        }}
      >
        <ButtonAuth {...props} />
      </ButtonGroup>
      <ButtonGroup
        variant="contained"
        sx={{
          display: {md: 'none', sm: 'none', xs: 'block'},
        }}
      >
        <ButtonMatch {...props} />
      </ButtonGroup>
      <ButtonGroup
        variant="contained"
        sx={{
          display: {md: 'none', sm: 'block', xs: 'none'},
        }}
      >
        <ButtonCurrentSpectator {...props} />
        <ButtonEverything {...props} />
      </ButtonGroup>
      <ButtonGroup
        variant="contained"
        sx={{
          display: {md: 'none', sm: 'block', xs: 'none'},
        }}
      >
        <ButtonPublic {...props} />
        <ButtonAuth {...props} />
        <ButtonMatch {...props} />
      </ButtonGroup>
      <ButtonGroup
        variant="contained"
        sx={{
          display: {lg: 'none', md: 'block', sm: 'none', xs: 'none'},
        }}
      >
        <ButtonCurrentSpectator {...props} />
      </ButtonGroup>
      <ButtonGroup
        variant="contained"
        sx={{
          display: {lg: 'none', md: 'block', sm: 'none', xs: 'none'},
        }}
      >
        <ButtonEverything {...props} />
        <ButtonPublic {...props} />
        <ButtonAuth {...props} />
        <ButtonMatch {...props} />
      </ButtonGroup>
      <ButtonGroup
        variant="contained"
        sx={{
          display: {lg: 'block', md: 'none', sm: 'none', xs: 'none'},
        }}
      >
        <ButtonCurrentSpectator {...props} />
        <ButtonEverything {...props} />
        <ButtonPublic {...props} />
        <ButtonAuth {...props} />
        <ButtonMatch {...props} />
      </ButtonGroup>
    </>
  );
}

export function ButtonCurrentSpectator({
  setStateShowSpectator,
  stateSpectator,
  stateSpectators,
}: SectionChangeSpectatorProps) {
  const currentSpectator = stateSpectators.get(stateSpectator);
  return (
    <GenericButton
      icon={currentSpectator?.icon}
      onClick={() => setStateShowSpectator(stateSpectator)}
      secondaryColor={true}
    >
      {currentSpectator?.name ?? stateSpectator ?? undefined}
    </GenericButton>
  );
}

export const ButtonEverything = memo(ButtonEverythingNormal, (prev, next) =>
  debugMemoHelper(
    'ButtonEverything',
    ['stateSpectator', 'setStateSpectator'],
    prev,
    next
  )
);

export function ButtonEverythingNormal({
  stateSpectator,
  setStateSpectator,
}: SectionChangeSpectatorProps) {
  debugComponentUpdate('ButtonEverythingNormal');
  const intl = useIntl();
  return (
    <GenericButton
      disabled={stateSpectator === 'everything'}
      icon={<SpectatorEverythingIcon />}
      onClick={() => setStateSpectator('everything')}
    >
      {intl.formatMessage({id: 'getacar.spectator.everything'})}
    </GenericButton>
  );
}

export const ButtonPublic = memo(ButtonPublicNormal, (prev, next) =>
  debugMemoHelper(
    'ButtonPublic',
    ['stateSpectator', 'setStateSpectator'],
    prev,
    next
  )
);

export function ButtonPublicNormal({
  stateSpectator,
  setStateSpectator,
}: SectionChangeSpectatorProps) {
  debugComponentUpdate('ButtonPublicNormal');
  const intl = useIntl();
  return (
    <GenericButton
      disabled={stateSpectator === 'public'}
      icon={<SpectatorPublicIcon />}
      onClick={() => setStateSpectator('public')}
    >
      {intl.formatMessage({id: 'getacar.spectator.public'})}
    </GenericButton>
  );
}

export const ButtonAuth = memo(ButtonAuthNormal, (prev, next) =>
  debugMemoHelper(
    'ButtonAuth',
    ['stateSpectator', 'setStateSpectator'],
    prev,
    next
  )
);

export function ButtonAuthNormal({
  stateSpectator,
  setStateSpectator,
}: SectionChangeSpectatorProps) {
  debugComponentUpdate('ButtonAuthNormal');
  const intl = useIntl();
  return (
    <GenericButton
      disabled={stateSpectator === 'auth'}
      icon={<ServiceAuthenticationIcon />}
      onClick={() => setStateSpectator('auth')}
    >
      {intl.formatMessage({id: 'getacar.spectator.service.authentication'})}
    </GenericButton>
  );
}

export const ButtonMatch = memo(ButtonMatchNormal, (prev, next) =>
  debugMemoHelper(
    'ButtonMatch',
    ['stateSpectator', 'setStateSpectator'],
    prev,
    next
  )
);

export function ButtonMatchNormal({
  stateSpectator,
  setStateSpectator,
}: SectionChangeSpectatorProps) {
  debugComponentUpdate('ButtonMatchNormal');
  const intl = useIntl();
  return (
    <GenericButton
      disabled={stateSpectator === 'match'}
      icon={<ServiceMatchingIcon />}
      onClick={() => setStateSpectator('match')}
    >
      {intl.formatMessage({id: 'getacar.spectator.service.matching'})}
    </GenericButton>
  );
}
