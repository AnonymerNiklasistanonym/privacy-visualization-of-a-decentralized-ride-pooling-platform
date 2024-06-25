// Package imports
import {memo} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {
  Box,
  ButtonGroup,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
// Local imports
// > Components
import {
  ParticipantCustomerIcon,
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
  const {setStateSpectator, stateSpectator, stateSpectators} = props;
  const intl = useIntl();
  const spectatorsList = Array.from(stateSpectators);
  console.log(spectatorsList);
  const spectatorsOther = spectatorsList.filter(
    ([spectatorId, spectatorInfo]) =>
      !spectatorInfo.keywords.includes(
        intl.formatMessage({id: 'getacar.participant.rideProvider'})
      ) &&
      !spectatorInfo.keywords.includes(
        intl.formatMessage({id: 'getacar.participant.customer'})
      ) &&
      !spectatorInfo.keywords.includes(
        intl.formatMessage({id: 'getacar.service'})
      )
  );
  const spectatorsServices = spectatorsList.filter(
    ([spectatorId, spectatorInfo]) =>
      spectatorInfo.keywords.includes(
        intl.formatMessage({id: 'getacar.service'})
      )
  );
  const spectatorsCustomers = spectatorsList.filter(
    ([spectatorId, spectatorInfo]) =>
      spectatorInfo.keywords.includes(
        intl.formatMessage({id: 'getacar.participant.customer'})
      )
  );
  const spectatorsRideProvider = spectatorsList.filter(
    ([spectatorId, spectatorInfo]) =>
      spectatorInfo.keywords.includes(
        intl.formatMessage({id: 'getacar.participant.rideProvider'})
      )
  );
  return (
    <>
      <Box sx={{minWidth: 500}}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">
            {intl.formatMessage({id: 'getacar.spectator.change'})}
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label={intl.formatMessage({id: 'getacar.spectator.change'})}
            value={stateSpectator}
            onChange={event => setStateSpectator(event.target.value)}
            renderValue={value => {
              const info = stateSpectators.get(value);
              if (info === undefined) {
                return value;
              }
              return (
                <Stack alignItems="center" direction="row" gap={2}>
                  {info.icon} {`${info.name} (${value})`}
                </Stack>
              );
            }}
          >
            {spectatorsOther.map(([spectatorId, spectatorInfo]) => (
              <MenuItem key={spectatorId} value={spectatorId}>
                <ListItemIcon>{spectatorInfo.icon}</ListItemIcon>
                <ListItemText
                  primary={`${spectatorInfo.name} (${spectatorId})`}
                />
              </MenuItem>
            ))}
            <ListSubheader>
              {intl.formatMessage({id: 'getacar.service.plural'})}
            </ListSubheader>
            {spectatorsServices.map(([spectatorId, spectatorInfo]) => (
              <MenuItem key={spectatorId} value={spectatorId}>
                <ListItemIcon>{spectatorInfo.icon}</ListItemIcon>
                <ListItemText
                  primary={`${spectatorInfo.name} (${spectatorId})`}
                />
              </MenuItem>
            ))}
            <ListSubheader>
              {intl.formatMessage({id: 'getacar.participant.customer.plural'})}
            </ListSubheader>
            {spectatorsCustomers.map(([spectatorId, spectatorInfo]) => (
              <MenuItem key={spectatorId} value={spectatorId}>
                <ListItemIcon>{spectatorInfo.icon}</ListItemIcon>
                <ListItemText
                  primary={`${spectatorInfo.name} (${spectatorId})`}
                />
              </MenuItem>
            ))}
            <ListSubheader>
              {intl.formatMessage({
                id: 'getacar.participant.rideProvider.plural',
              })}
            </ListSubheader>
            {spectatorsRideProvider.map(([spectatorId, spectatorInfo]) => (
              <MenuItem key={spectatorId} value={spectatorId}>
                <ListItemIcon>{spectatorInfo.icon}</ListItemIcon>
                <ListItemText
                  primary={`${spectatorInfo.name} (${spectatorId})`}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
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
