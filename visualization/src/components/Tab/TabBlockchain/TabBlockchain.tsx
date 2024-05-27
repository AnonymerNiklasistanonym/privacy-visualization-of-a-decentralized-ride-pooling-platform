'use client';

// Package imports
// > Components
import {Divider, Typography} from '@mui/material';
// Local imports
// > Components
import TabContainer from '@components/Tab/TabContainer';
import TableBlockchain from '@components/Table/TableBlockchain';
// Type imports
import type {TableBlockchainProps} from '@components/Table/TableBlockchain';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TabBlockchainProps extends TableBlockchainProps {}

// eslint-disable-next-line no-empty-pattern
export default function TabBlockchain(props: TabBlockchainProps) {
  return (
    <TabContainer>
      <Typography variant="h5" gutterBottom>
        Public Smart Contracts
      </Typography>
      <Divider />
      <Typography variant="body1" gutterBottom>
        TODO: Add pagination and don`t fetch all of them at once
      </Typography>
      <TableBlockchain {...props} />
    </TabContainer>
  );
}
