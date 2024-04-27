'use client';

// Package imports
import {useState} from 'react';
// > Components
import {Alert, Snackbar} from '@mui/material';
// Type imports
import type {SyntheticEvent} from 'react';

interface SnackbarSpectatorChangeProps {
  openState: boolean;
  setStateOpen: (a: boolean) => void;
  textState: string;
}

export default function SnackbarSpectatorChange({
  openState,
  setStateOpen,
  textState,
}: SnackbarSpectatorChangeProps) {
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
      open={open || openState}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity="success"
        variant="filled"
        sx={{width: '100%'}}
      >
        Changed spectator to {textState}
      </Alert>
    </Snackbar>
  );
}
