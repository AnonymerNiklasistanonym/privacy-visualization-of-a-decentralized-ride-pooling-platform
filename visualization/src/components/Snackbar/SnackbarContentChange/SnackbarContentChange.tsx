'use client';

// Package imports
import {useCallback, useMemo, useState} from 'react';
// > Components
import {Alert, Snackbar} from '@mui/material';
// Type imports
import type {ReactSetState, ReactState} from '@misc/react';
import type {SyntheticEvent} from 'react';

interface SnackbarContentChangeProps<T> {
  stateOpen: ReactState<boolean>;
  setStateOpen: ReactSetState<boolean>;
  stateContent: ReactState<T>;
  bottomOffset?: number;
  handleChangeStateContent?: (content: T) => string;
}

export default function SnackbarContentChange<T extends string | undefined>({
  stateOpen,
  setStateOpen,
  stateContent,
  bottomOffset,
  handleChangeStateContent,
}: SnackbarContentChangeProps<T>) {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(
    (event?: SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }

      setOpen(false);
      setStateOpen(false);
    },
    [setStateOpen]
  );

  const text = useMemo<string | T>(() => {
    if (handleChangeStateContent !== undefined) {
      return handleChangeStateContent(stateContent) ?? '';
    }
    return stateContent;
  }, [handleChangeStateContent, stateContent]);

  return (
    <Snackbar
      open={open || stateOpen}
      autoHideDuration={1 * 1000}
      onClose={handleClose}
      sx={{
        '&.MuiSnackbar-root': {bottom: `${(bottomOffset ?? 0) + 25}px`},
      }}
    >
      <Alert
        onClose={handleClose}
        severity="success"
        variant="filled"
        sx={{width: '100%'}}
      >
        {text}
      </Alert>
    </Snackbar>
  );
}
