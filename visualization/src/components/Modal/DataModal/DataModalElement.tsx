// Package imports
import {useState} from 'react';
// > Components
import {
  Box,
  Collapse,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import PaperContainer from '@components/Container/PaperContainer';
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

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          {stateDataModalContentElement.icon ?? <QuestionMarkIcon />}
        </ListItemIcon>
        <ListItemText
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
          <PaperContainer>
            {stateDataModalContentElement.spectatorInformation}
            {stateDataModalContentElement.spectatorInformation !== undefined ? (
              <Divider sx={{marginBottom: '1rem', marginTop: '1rem'}} />
            ) : undefined}
            <ChangeViewButton
              {...props}
              key={`modal_${stateDataModalContentElement.name}`}
              actorId={stateDataModalContentElement.spectatorId}
              icon={stateDataModalContentElement.icon ?? <QuestionMarkIcon />}
              label={stateDataModalContentElement.name}
              isPseudonym={stateDataModalContentElement.isPseudonym ?? false}
            />
          </PaperContainer>
        </Box>
      </Collapse>
    </>
  );
}
