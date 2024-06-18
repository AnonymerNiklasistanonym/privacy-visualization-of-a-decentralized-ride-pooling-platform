// Package imports
import {useIntl} from 'react-intl';
// > Components
import {
  Badge,
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Modal,
  Typography,
} from '@mui/material';
// > Icons
import {
  Delete as DeleteIcon,
  Error as ErrorIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
// Type imports
import type {ReactSetState, ReactState} from '@misc/react';
import {useState} from 'react';

export interface ErrorModalContentElement {
  title: string;
  error: Error;
  count: number;
}

export interface ErrorModalProps
  extends ErrorModalPropsGet,
    ErrorModalPropsSet,
    ErrorModalPropsErrorBuilder {}

export interface ErrorModalPropsGet {
  stateErrorModalOpen: ReactState<boolean>;
  stateErrorModalContent: ReactState<Array<ErrorModalContentElement>>;
}

export interface ErrorModalPropsSet {
  setStateErrorModalOpen: ReactSetState<boolean>;
  setStateErrorModalContent: ReactSetState<Array<ErrorModalContentElement>>;
}

export interface ErrorModalPropsErrorBuilder
  extends ErrorModalPropsGet,
    ErrorModalPropsSet {}

export const compareErrorModalContent = (
  title: string,
  error: Error,
  errorElement: ErrorModalContentElement
) =>
  errorElement.title === title &&
  errorElement.error.message === error.message &&
  errorElement.error.stack === error.stack;

export type ShowError = (message: string, error: Error) => void;

export function showErrorBuilder(
  props: ErrorModalPropsErrorBuilder,
  logError = true
): ShowError {
  return (title: string, error: Error) => {
    if (logError) {
      console.error(error);
    }
    // Append error or increase count
    const errorAlreadyInList = props.stateErrorModalContent.find(a =>
      compareErrorModalContent(title, error, a)
    );
    if (errorAlreadyInList) {
      props.setStateErrorModalContent(
        props.stateErrorModalContent.map(a => {
          if (compareErrorModalContent(title, error, a)) {
            a.count += 1;
          }
          return a;
        })
      );
    } else {
      props.setStateErrorModalContent([
        ...props.stateErrorModalContent,
        {
          count: 1,
          error,
          title,
        },
      ]);
      // Only open modal if new error is found
      props.setStateErrorModalOpen(true);
    }
  };
}

export default function ErrorModal(props: ErrorModalProps) {
  const {stateErrorModalOpen, stateErrorModalContent, setStateErrorModalOpen} =
    props;
  const intl = useIntl();

  // Close the modal when there is no content any more
  if (stateErrorModalContent.length === 0) {
    setStateErrorModalOpen(false);
  }
  return (
    <div>
      <Modal
        open={stateErrorModalOpen}
        onClose={() => setStateErrorModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            left: '50%',
            maxWidth: 1200,
            p: 4,
            position: 'absolute' as const,
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <List
            sx={{
              bgcolor: 'background.paper',
              width: '100%',
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                {intl.formatMessage({id: 'errors'})}
              </ListSubheader>
            }
          >
            {stateErrorModalContent.map(a => (
              <ErrorModalListElement key={a.title} {...props} element={a} />
            ))}
          </List>
        </Box>
      </Modal>
    </div>
  );
}

export interface ErrorModalListElementProps extends ErrorModalProps {
  element: ErrorModalContentElement;
}

export function ErrorModalListElement({
  element,
  stateErrorModalContent,
  setStateErrorModalContent,
}: ErrorModalListElementProps) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <>
      <ListItem>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <Badge
              color="secondary"
              badgeContent={element.count <= 1 ? 0 : element.count}
              max={999}
            >
              <ErrorIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText
            primary={`${element.title} (${element.error.name}${
              element.error.cause ? ` / ${element.error.cause}` : ''
            })`}
          />
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
        <ListItemButton onClick={handleClick}>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => {
              setStateErrorModalContent(
                stateErrorModalContent.filter(
                  b => !compareErrorModalContent(b.title, b.error, element)
                )
              );
            }}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box
          component="section"
          sx={{
            maxHeight: '50vh',
            maxWidth: 800,
            overflow: 'scroll',
            width: '100%',
          }}
        >
          <Typography variant="body1" gutterBottom>
            {element.error.stack ?? 'No stack found'}
          </Typography>
        </Box>
      </Collapse>
    </>
  );
}
