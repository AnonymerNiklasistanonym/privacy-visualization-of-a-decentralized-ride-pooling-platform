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
import ButtonChangeSpectator from '@components/Button/ButtonChangeSpectator';
// > Misc
import {debugComponentUpdate} from '@misc/debug';
// Type imports
import type {ButtonChangeSpectatorProps} from '@components/Button/ButtonChangeSpectator';
import type {DataModalInformation} from './DataModalInformation';
import type {ReactState} from '@misc/react';

export interface DataModalPropsElement extends ButtonChangeSpectatorProps {
  stateDataModalContentElement: ReactState<DataModalInformation>;
}

export default memo(DataModelListElement);

export function DataModelListElement(props: DataModalPropsElement) {
  debugComponentUpdate('DataModelListElement', true);

  const {stateDataModalContentElement} = props;

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const theme = useTheme();

  return (
    <>
      <ListItemButton onClick={handleClick}>
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
      <Collapse in={open} timeout="auto" unmountOnExit>
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
              <ButtonChangeSpectator
                {...props}
                key={`modal_${stateDataModalContentElement.name}`}
                spectatorId={stateDataModalContentElement.spectatorId}
                icon={stateDataModalContentElement.icon ?? <QuestionMarkIcon />}
                label={stateDataModalContentElement.name}
                isPseudonym={stateDataModalContentElement.isPseudonym ?? false}
              />
            </CardActions>
          </Card>
        </Box>
      </Collapse>
    </>
  );
}
