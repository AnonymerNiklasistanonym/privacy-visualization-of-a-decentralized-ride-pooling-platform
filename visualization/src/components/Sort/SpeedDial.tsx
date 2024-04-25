'use client';

// Package imports
import * as React from 'react';
// > Components
import {Paper, SpeedDial, SpeedDialAction} from '@mui/material';
// > Icons
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import ShareIcon from '@mui/icons-material/Share';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';

const actions = [
  {icon: <FileCopyIcon />, name: 'Copy'},
  {icon: <SaveIcon />, name: 'Save'},
  {icon: <PrintIcon />, name: 'Print'},
  {icon: <ShareIcon />, name: 'Share'},
];

export default function SpeedDialTooltipOpen() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Paper
      sx={{
        bottom: 0,
        left: 0,
        position: 'fixed',
        right: 0,
      }}
      elevation={4}
    >
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{
          bottom: 16,
          position: 'absolute',
          right: 16,
        }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={handleClose}
          />
        ))}
      </SpeedDial>
    </Paper>
  );
}
