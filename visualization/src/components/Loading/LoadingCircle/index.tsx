// Package imports
// > Components
import {Box, CircularProgress} from '@mui/material';

export default function LoadingCircle() {
  return (
    <Box sx={{display: 'flex', width: '100%'}} justifyContent="center">
      <CircularProgress />
    </Box>
  );
}
