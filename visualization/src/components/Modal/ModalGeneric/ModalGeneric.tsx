// Package imports
import {memo} from 'react';
// > Components
import {Box, Modal} from '@mui/material';
// Local imports
// > Misc
import {debugComponentUpdate} from '@misc/debug';
// Type imports
import type {ReactSetState, ReactState} from '@misc/react';
import type {PropsWithChildren} from 'react';

export interface GenericModalProps {
  stateModalOpen: ReactState<boolean>;
  setStateModalOpen: ReactSetState<boolean>;
}

export default memo(GenericModal);

/** Modal that showcases data access and ownership */
export function GenericModal({
  children,
  setStateModalOpen,
  stateModalOpen,
}: PropsWithChildren<GenericModalProps>) {
  debugComponentUpdate('GenericModal', true);

  return (
    <div>
      <Modal
        open={stateModalOpen}
        onClose={() => setStateModalOpen(false)}
        sx={{
          maxHeight: '90vh',
          overflow: 'scroll',
        }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            left: '50%',
            maxHeight: {
              md: '80vh',
              xs: '90%',
            },
            maxWidth: 1200,
            p: 4,
            position: 'absolute' as const,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: {
              md: '80vw',
              xs: '100%',
            },
          }}
        >
          {children}
        </Box>
      </Modal>
    </div>
  );
}
