// Package imports
// > Components
import {
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Modal,
} from '@mui/material';
// > Icons
import {Delete as DeleteIcon, Error as ErrorIcon} from '@mui/icons-material';
// Type imports
import type {ReactSetState, ReactState} from '@misc/react';

export interface ErrorModalContentElement {
  title: string;
  error: Error;
  count: number;
}

export interface ErrorModalProps
  extends ErrorModalPropsSetStates,
    ErrorModalPropsErrorBuilder {
  stateErrorModalOpen: ReactState<boolean>;
}

export interface ErrorModalPropsSetStates {
  setStateErrorModalOpen: ReactSetState<boolean>;
  setStateErrorModalContent: ReactSetState<Array<ErrorModalContentElement>>;
}

export interface ErrorModalPropsErrorBuilder extends ErrorModalPropsSetStates {
  stateErrorModalContent: ReactState<Array<ErrorModalContentElement>>;
}

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

export default function ErrorModal({
  stateErrorModalOpen,
  stateErrorModalContent,
  setStateErrorModalOpen,
  setStateErrorModalContent,
}: ErrorModalProps) {
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
                Errors
              </ListSubheader>
            }
          >
            {stateErrorModalContent.map((a, index) => {
              return (
                <ListItem
                  key={`content-${index}`}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        setStateErrorModalContent(
                          stateErrorModalContent.filter(
                            b => !compareErrorModalContent(b.title, b.error, a)
                          )
                        );
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <Badge
                      color="secondary"
                      badgeContent={a.count <= 1 ? 0 : a.count}
                      max={999}
                    >
                      <ErrorIcon />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={`${a.title} (${a.error.name})`}
                    secondary={
                      a.error.message +
                      (a.error.stack ? ` [Stack: ${a.error.stack}]` : '') +
                      (a.error.cause ? ` [Cause:\n\n${a.error.cause}]` : '')
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Modal>
    </div>
  );
}
