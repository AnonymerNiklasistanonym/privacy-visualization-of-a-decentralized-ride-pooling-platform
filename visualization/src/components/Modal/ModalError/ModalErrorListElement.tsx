// Package imports
import {memo, useCallback, useMemo, useState} from 'react';
// > Components
import {
  Badge,
  Box,
  Collapse,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
// Type imports
import type {
  ErrorModalContentElement,
  ErrorModalPropsGet,
  ErrorModalPropsSet,
} from './ModalError';

export interface ErrorModalListElementProps
  extends ErrorModalPropsSet,
    ErrorModalPropsGet {
  title: string;
  element: ErrorModalContentElement;
}

export default memo(ErrorModalListElement);

export function ErrorModalListElement({
  title,
  element,
  errorModalContent,
  setStateErrorModalUpdate,
}: ErrorModalListElementProps) {
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => setOpen(!open), [setOpen, open]);

  const removeErrorMessage = useCallback(() => {
    errorModalContent.current.delete(title);
    // Update error modal
    setStateErrorModalUpdate(true);
  }, [errorModalContent, setStateErrorModalUpdate, title]);

  const deleteIcon = useMemo(() => <DeleteIcon />, []);

  const errorList = useMemo(() => Array.from(element.error), [element.error]);
  const errorName = useMemo(
    () =>
      errorList
        .map(
          ([, error]) =>
            `${error.name}${error.cause ? ` / ${error.cause}` : ''}`
        )
        .join(', '),
    [errorList]
  );

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
          <ListItemText primary={`${title} (${errorName})`} />
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
          {errorList.map(([name, error]) => (
            <Typography
              key={`error-stack-${name}`}
              variant="body2"
              sx={{marginTop: '1rem'}}
              gutterBottom
            >
              {`${error.name}${error.cause ? ` / ${error.cause}` : ''}:`}
              {error.stack ?? 'No stack found'}
            </Typography>
          ))}
        </Box>
      </Collapse>
    </>
  );
}
