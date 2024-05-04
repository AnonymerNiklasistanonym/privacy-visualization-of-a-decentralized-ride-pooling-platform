// Package imports
// > Components
import {Box, Container} from '@mui/material';
// > Styles
import '@styles/Tab.module.scss';
import styles from '@styles/Tab.module.scss';
// Type imports
import type {PropsWithChildren} from 'react';

export default function TabContainer({children}: PropsWithChildren) {
  return (
    <Container maxWidth="lg">
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
