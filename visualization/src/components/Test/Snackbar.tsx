'use client';

//import type {FC} from 'react';
import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface CustomizedSnackbarProps {
  openState: boolean;
  setStateOpen: (a: boolean) => void;
  textState: string;
}

export default function CustomizedSnackbar({
  openState,
  setStateOpen,
  textState,
}: CustomizedSnackbarProps) {
  const [open, setOpen] = React.useState(false);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
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
