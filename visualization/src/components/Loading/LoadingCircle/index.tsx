// Package imports
import {memo} from 'react';
// > Components
import {Box, CircularProgress} from '@mui/material';

export interface LoadingCirclePropsInput {
  /** Do not render progress centered at full width */
  notFullWidth?: boolean;
}

export default memo(LoadingCircle);

export function LoadingCircle({notFullWidth}: LoadingCirclePropsInput) {
  return (
    <Box
      sx={{display: 'flex', width: notFullWidth ? undefined : '100%'}}
      justifyContent="center"
    >
      <CircularProgress />
    </Box>
  );
}
