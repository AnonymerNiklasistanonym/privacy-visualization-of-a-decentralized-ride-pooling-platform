// Package imports
// > Components
import {Box, Fade, Modal} from '@mui/material';
// Type imports
import type {ReactSetState, ReactState} from '@misc/react';

export interface ImageModalProps {
  stateImgModalOpen: ReactState<boolean>;
  stateImgUrl: ReactState<string | undefined>;
  stateImgBg: ReactState<string | undefined>;
  stateImgAlt: ReactState<string | undefined>;
  setStateImgModalOpen: ReactSetState<boolean>;
}

export default function ImageModal({
  setStateImgModalOpen,
  stateImgAlt,
  stateImgBg,
  stateImgModalOpen,
  stateImgUrl,
}: ImageModalProps) {
  const handleClick = () => {
    setStateImgModalOpen(false);
  };
  return (
    <Modal
      open={stateImgModalOpen}
      onClose={handleClick}
      style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: theme =>
              theme.palette.mode === 'light'
                ? 'rgba(120,120,120,0.7)'
                : 'rgba(0,0,0,0.8)',
          },
        },
      }}
      closeAfterTransition
    >
      <Fade in={stateImgModalOpen} timeout={500}>
        <Box
          component="img"
          sx={{
            backgroundColor: stateImgBg,
            borderRadius: '1rem',
            maxHeight: '100%',
            maxWidth: '100%',
            padding: '1rem',
          }}
          alt={stateImgAlt}
          src={stateImgUrl}
          onClick={handleClick}
        />
      </Fade>
    </Modal>
  );
}
