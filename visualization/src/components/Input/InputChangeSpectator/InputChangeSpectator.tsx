// Package imports
import {memo, useMemo} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {
  Box,
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
import InputExtraActions from '@components/Input/InputExtraActions';
// > Misc
import {debugComponentRender} from '@misc/debug';
import {spectatorName} from '@misc/spectatorName';
// Type imports
import {
  GlobalPropsSpectatorMap,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
} from '@misc/props/global';
import type {InputExtraActionsPropsInput} from '@components/Input/InputExtraActions';

export interface InputChangeSpectatorProps
  extends GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorSelectedElementsSet,
    GlobalPropsSpectatorMap {}
export interface InputChangeSpectatorPropsInput
  extends InputChangeSpectatorProps,
    InputExtraActionsPropsInput {}

export default memo(InputChangeSpectator);

export function InputChangeSpectator(props: InputChangeSpectatorPropsInput) {
  debugComponentRender('InputChangeSpectator');
  const {actions, setStateSpectatorId, stateSpectatorId, stateSpectators} =
    props;
  const intl = useIntl();
  const spectatorsList = useMemo(
    () => Array.from(stateSpectators),
    [stateSpectators]
  );
  const categories = useMemo(
    () => Array.from(new Set(spectatorsList.map(a => a[1].category))),
    [spectatorsList]
  );

  return (
    <Box sx={{width: '100%'}}>
      <Stack direction="row">
        <FormControl fullWidth>
          <InputLabel id="inputLabel.changeSpectator">
            {intl.formatMessage({id: 'getacar.spectator.message.change'})}
          </InputLabel>
          <Select
            labelId="inputLabel.changeSpectator"
            label={intl.formatMessage({id: 'getacar.spectator.message.change'})}
            value={stateSpectatorId}
            onChange={event => setStateSpectatorId(event.target.value)}
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
            {categories.map(category => [
              <ListSubheader key={category}>{category}</ListSubheader>,
              spectatorsList
                .filter(
                  ([, spectatorInfo]) => spectatorInfo.category === category
                )
                .sort()
                .map(([spectatorId, spectatorInfo]) => (
                  <MenuItem key={spectatorId} value={spectatorId}>
                    <ListItemIcon>{spectatorInfo.icon}</ListItemIcon>
                    <ListItemText
                      primary={spectatorName(
                        spectatorId,
                        name => name,
                        spectatorInfo
                      )}
                    />
                  </MenuItem>
                )),
            ])}
          </Select>
        </FormControl>
        <InputExtraActions actions={actions} />
      </Stack>
    </Box>
  );
}
