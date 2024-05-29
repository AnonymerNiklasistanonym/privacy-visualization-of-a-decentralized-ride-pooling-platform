// Package imports
// > Components
import {Box, Container} from '@mui/material';
// > Styles
import '@styles/Tab.module.scss';
import styles from '@styles/Tab.module.scss';
// Type imports
import type {PropsWithChildren} from 'react';

export interface TabContainerProps {
  fullPage?: boolean;
}

export default function TabContainer({
  children,
  fullPage,
}: PropsWithChildren<TabContainerProps>) {
  return (
    <Container sx={{maxWidth: fullPage ? 'xl' : 'lg'}}>
      <Box display="flex" justifyContent="center">
        <Box
          component="section"
          sx={{
            width: '100%',
          }}
          className={styles['tab-container']}
        >
          {children}
        </Box>
      </Box>
    </Container>
  );
}
