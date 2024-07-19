// Package imports
import {memo, useState} from 'react';
// > Components
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
// > Icons
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  QuestionMark as QuestionMarkIcon,
} from '@mui/icons-material';
// Local imports
// > Components
import InputButtonSpectatorChange from '@components/Input/InputButton/InputButtonSpectatorChange';
// > Misc
import {debugComponentRender} from '@misc/debug';
// Type imports
import type {InputButtonSpectatorChangeProps} from '@components/Input/InputButton/InputButtonSpectatorChange';
import type {ModalDataInformationAccess} from './ModalDataInformation';
import type {ReactState} from '@misc/react';

export type ModalDataListElementProps = InputButtonSpectatorChangeProps;

export interface ModalDataListElementPropsInput
  extends ModalDataListElementProps {
  stateDataModalContentElement: ReactState<ModalDataInformationAccess>;
}

export default memo(ModalDataListElement);

export function ModalDataListElement(props: ModalDataListElementPropsInput) {
  debugComponentRender('DataModelListElement');

  const {stateDataModalContentElement, ...rest} = props;

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const theme = useTheme();

  const propsInputButton: InputButtonSpectatorChangeProps = {
    ...rest,
  };

  return (
    <>
      <ListItemButton
        key={`list-item-button-${stateDataModalContentElement.name}`}
        onClick={handleClick}
      >
        <ListItemIcon>
          {stateDataModalContentElement.icon ?? <QuestionMarkIcon />}
        </ListItemIcon>
        <ListItemText
          sx={{
            color: theme.palette.mode === 'dark' ? 'white' : undefined,
            margin: '1rem',
          }}
          primary={`${stateDataModalContentElement.name}`}
          secondary={stateDataModalContentElement.description}
        />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
      <Collapse
        key={`list-item-button-collapse-${stateDataModalContentElement.name}`}
        in={open}
        timeout="auto"
        unmountOnExit
      >
        <Box
          component="section"
          sx={{
            maxWidth: 800,
            width: '100%',
          }}
        >
          <Card variant="outlined">
            <CardContent>
              {stateDataModalContentElement.spectatorInformation}
            </CardContent>
            <CardActions>
              <InputButtonSpectatorChange
                {...propsInputButton}
                key={`modal_${stateDataModalContentElement.name}`}
                spectatorId={stateDataModalContentElement.spectatorId}
                icon={stateDataModalContentElement.icon ?? <QuestionMarkIcon />}
                label={stateDataModalContentElement.name}
                isPseudonym={stateDataModalContentElement.isPseudonym ?? false}
                ignoreUnableToResolve={true}
              />
            </CardActions>
          </Card>
        </Box>
      </Collapse>
    </>
  );
}
