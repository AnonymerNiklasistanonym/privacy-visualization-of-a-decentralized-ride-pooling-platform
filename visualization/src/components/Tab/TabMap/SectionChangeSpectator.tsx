// Package imports
import {useIntl} from 'react-intl';
// > Components
import {ButtonGroup, Chip, Divider} from '@mui/material';
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

export interface SectionChangeSpectatorProps
  extends GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorMap,
    GlobalPropsSpectatorSelectedElementsSet {}

export default function SectionChangeSpectator(
  props: SectionChangeSpectatorProps
) {
  const intl = useIntl();
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
  setStateSelectedSpectator,
  stateSpectator,
  stateSpectators,
}: SectionChangeSpectatorProps) {
  const currentSpectator = stateSpectators.get(stateSpectator);
  return (
    <GenericButton
      icon={currentSpectator?.icon}
      onClick={() => setStateSelectedSpectator(stateSpectator)}
      secondaryColor={true}
    >
      {currentSpectator?.name} ({stateSpectator})
    </GenericButton>
  );
}

export function ButtonEverything({
  stateSpectator,
  setStateSpectator,
}: SectionChangeSpectatorProps) {
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

export function ButtonPublic({
  stateSpectator,
  setStateSpectator,
}: SectionChangeSpectatorProps) {
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

export function ButtonAuth({
  stateSpectator,
  setStateSpectator,
}: SectionChangeSpectatorProps) {
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

export function ButtonMatch({
  stateSpectator,
  setStateSpectator,
}: SectionChangeSpectatorProps) {
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
