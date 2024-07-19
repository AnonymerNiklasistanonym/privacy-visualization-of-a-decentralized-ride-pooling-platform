// Package imports
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {
  Badge,
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from '@mui/material';
// > Icons
import {
  Delete as DeleteIcon,
  Error as ErrorIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
// Local imports
// > Components
import InputButtonGeneric from '@components/Input/InputButton/InputButtonGeneric';
import ModalGeneric from '@components/Modal/ModalGeneric';
// Type imports
import type {ReactRef, ReactSetState, ReactState} from '@misc/react';

export interface ErrorModalContentElement {
  error: Error;
  count: number;
}

export interface ModalErrorProps
  extends ErrorModalPropsGet,
    ErrorModalPropsSet,
    ErrorModalPropsErrorBuilder {}

export interface ErrorModalPropsGet {
  stateErrorModalOpen: ReactState<boolean>;
  stateErrorModalContentSize: ReactState<number>;
  errorModalContent: ReactRef<Map<string, ErrorModalContentElement>>;
}

export interface ErrorModalPropsSet {
  setStateErrorModalOpen: ReactSetState<boolean>;
  setStateErrorModalContentSize: ReactSetState<number>;
}

export interface ErrorModalPropsErrorBuilder
  extends ErrorModalPropsGet,
    ErrorModalPropsSet {}

export const compareErrorModalContent = (
  title: string,
  error: Error,
  errorElementTitle: string,
  errorElement: ErrorModalContentElement
) =>
  errorElementTitle === title &&
  errorElement.error.message === error.message &&
  errorElement.error.stack === error.stack;

export type ShowError = (title: string, error: Error) => void;

export function showErrorBuilder(
  {
    errorModalContent,
    setStateErrorModalOpen,
    setStateErrorModalContentSize,
  }: ErrorModalPropsErrorBuilder,
  logError = true
): ShowError {
  return (title: string, error: Error) => {
    if (logError) {
      console.error(error);
    }
    const entry = errorModalContent.current.get(title);
    // Append error or increase count
    if (entry) {
      entry.count++;
    } else {
      errorModalContent.current.set(title, {count: 1, error});
    }
    if (entry === undefined) {
      // Only open modal if new error is found
      setStateErrorModalOpen(true);
      setStateErrorModalContentSize(new Date().getTime());
    }
  };
}

/** Modal that displays errors */
export default function ModalError({
  errorModalContent,
  stateErrorModalOpen,
  stateErrorModalContentSize,
  setStateErrorModalContentSize,
  setStateErrorModalOpen,
}: ModalErrorProps) {
  const intl = useIntl();

  useEffect(() => {
    // Close the modal when there is no content any more
    if (
      errorModalContent.current.size === 0 ||
      stateErrorModalContentSize === 0
    ) {
      setStateErrorModalOpen(false);
    }
  }, [errorModalContent, setStateErrorModalOpen, stateErrorModalContentSize]);

  const errorModalContentList = useMemo(() => {
    console.info(
      errorModalContent.current,
      Array.from(errorModalContent.current)
    );
    if (stateErrorModalContentSize === 0) {
      return [];
    }
    return Array.from(errorModalContent.current);
  }, [errorModalContent, stateErrorModalContentSize]);

  return (
    <ModalGeneric
      setStateModalOpen={setStateErrorModalOpen}
      stateModalOpen={stateErrorModalOpen}
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
        {errorModalContentList.map(([title, content]) => (
          <ErrorModalListElement
            key={title}
            errorModalContent={errorModalContent}
            stateErrorModalContentSize={stateErrorModalContentSize}
            stateErrorModalOpen={stateErrorModalOpen}
            setStateErrorModalContentSize={setStateErrorModalContentSize}
            setStateErrorModalOpen={setStateErrorModalOpen}
            title={title}
            element={content}
          />
        ))}
      </List>
    </ModalGeneric>
  );
}

export interface ErrorModalListElementProps
  extends ErrorModalPropsSet,
    ErrorModalPropsGet {
  title: string;
  element: ErrorModalContentElement;
}

export function ErrorModalListElement({
  title,
  element,
  errorModalContent,
  setStateErrorModalContentSize,
}: ErrorModalListElementProps) {
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => setOpen(!open), [setOpen, open]);
  const removeErrorMessage = useCallback(() => {
    errorModalContent.current.delete(title);
    setStateErrorModalContentSize(new Date().getTime());
  }, [errorModalContent, setStateErrorModalContentSize, title]);
  const deleteIcon = useMemo(() => <DeleteIcon />, []);

  return (
    <>
      <ListItem key={`error-modal-list-element-${title}`}>
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
            primary={`${title} (${element.error.name}${
              element.error.cause ? ` / ${element.error.cause}` : ''
            })`}
          />
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
      </ListItem>
      <Collapse
        key={`error-modal-list-element-collapse-${title}`}
        in={open}
        timeout="auto"
        unmountOnExit
      >
        <Box
          component="section"
          sx={{
            maxHeight: '50vh',
            overflow: 'scroll',
            width: '100%',
          }}
        >
          <InputButtonGeneric icon={deleteIcon} onClick={removeErrorMessage}>
            Remove Error
          </InputButtonGeneric>
          <Typography variant="body2" sx={{marginTop: '1rem'}} gutterBottom>
            {element.error.stack ?? 'No stack found'}
          </Typography>
        </Box>
      </Collapse>
    </>
  );
}
