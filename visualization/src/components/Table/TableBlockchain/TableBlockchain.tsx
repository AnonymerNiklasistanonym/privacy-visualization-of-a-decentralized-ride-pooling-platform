// Package imports
// > Components
import {Box, List} from '@mui/material';
// Local imports
// > Components
import TableBlockchainElement from './TableBlockchainElement';

export default function TableBlockchain() {
  return (
    <Box
      sx={{
        height: 400,
        width: '100%',
      }}
    >
      <List
        sx={{bgcolor: 'background.paper', maxWidth: 800, width: '100%'}}
        component="nav"
      >
        {[1, 2, 3, 4].map(() => TableBlockchainElement())}
      </List>
    </Box>
  );
}
