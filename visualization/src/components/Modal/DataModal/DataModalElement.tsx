// Package imports
import {useState} from 'react';
// > Components
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Divider,
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
import ChangeViewButton from '@components/Button/ChangeViewButton';
// Type imports
import type {ChangeViewButtonProps} from '@components/Button/ChangeViewButton';
import type {DataModalInformation} from './DataModal';
import type {ReactState} from '@misc/react';

export interface DataModalPropsElement extends ChangeViewButtonProps {
  stateDataModalContentElement: ReactState<DataModalInformation>;
}

export default function DataModelListElement(props: DataModalPropsElement) {
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
              <ChangeViewButton
                {...props}
                key={`modal_${stateDataModalContentElement.name}`}
                actorId={stateDataModalContentElement.spectatorId}
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
