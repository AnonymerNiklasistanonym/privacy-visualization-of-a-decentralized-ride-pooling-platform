'use client';

// Package imports
// > Components
import {Card, CardContent, Divider, Typography} from '@mui/material';
// Local imports
// > Components
import TabContainer from '@components/Tab/TabContainer';
import TableBlockchain from '@components/Table/TableBlockchain';
// Type imports
import type {TableBlockchainProps} from '@components/Table/TableBlockchain';
import {useIntl} from 'react-intl';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TabBlockchainProps extends TableBlockchainProps {}

// eslint-disable-next-line no-empty-pattern
export default function TabBlockchain(props: TabBlockchainProps) {
  const intl = useIntl();
  return (
    <TabContainer>
      <Card sx={{marginTop: {md: '1rem', sm: 0}}}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {intl.formatMessage({
              id: 'page.home.tab.blockchain.section.smartContracts.title',
            })}
          </Typography>
          <Divider />
          <Typography variant="body1" gutterBottom>
            {intl.formatMessage({
              id: 'page.home.tab.blockchain.section.smartContracts.content',
            })}
          </Typography>
          <Typography variant="body1" gutterBottom>
            TODO: Include real ID/Names in the table or is it enough in the
            modal (if available to spectator?)
          </Typography>
          <TableBlockchain {...props} />
        </CardContent>
      </Card>
    </TabContainer>
  );
}
