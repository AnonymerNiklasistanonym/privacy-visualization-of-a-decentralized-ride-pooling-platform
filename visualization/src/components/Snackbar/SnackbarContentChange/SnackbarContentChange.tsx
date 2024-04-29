'use client';

// Package imports
import {useState} from 'react';
// > Components
import {Alert, Snackbar} from '@mui/material';
// Type imports
import type {ReactNode, SyntheticEvent} from 'react';
import type {ReactSetState, ReactState} from '@misc/react';

interface SnackbarContentChangeProps<T> {
  stateOpen: ReactState<boolean>;
  setStateOpen: ReactSetState<boolean>;
  stateContent: ReactState<T>;
  bottomOffset?: number;
  handleChangeStateContent?: (content: T) => ReactNode;
}

export default function SnackbarContentChange<T extends string | undefined>({
  stateOpen,
  setStateOpen,
  stateContent,
  bottomOffset,
  handleChangeStateContent,
}: SnackbarContentChangeProps<T>) {
  const [open, setOpen] = useState(false);

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setStateOpen(false);
  };

  return (
    <Snackbar
      open={open || stateOpen}
      autoHideDuration={6000}
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
        {handleChangeStateContent !== undefined
          ? handleChangeStateContent(stateContent)
          : stateContent}
      </Alert>
    </Snackbar>
  );
}
