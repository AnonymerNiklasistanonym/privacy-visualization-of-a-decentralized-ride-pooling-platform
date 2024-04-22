'use client';

// Package imports
import * as React from 'react';
// > Components
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// Local imports imports
// > Components
import TabMap from '@components/Tabs/TabMap';
// Type imports
import type {PropsWithChildren} from 'react';
import type {ReactPropsI18n} from '@globals/types/react';
import type {ReactHandleChange} from '@misc/React';

const ariaNameTabCollection = 'tabpanel-getacar';
const ariaNameTabCollectionTab = `${ariaNameTabCollection}-tab`;

const ariaPropsTab = (index: number) => ({
  id: `${ariaNameTabCollectionTab}-${index}`,
  'aria-controls': `${ariaNameTabCollection}-${index}`,
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel({
  children,
  value,
  index,
}: PropsWithChildren<TabPanelProps>) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${ariaNameTabCollection}-${index}`}
      aria-labelledby={`${ariaNameTabCollectionTab}-${index}`}
    >
      {value === index && (
        <Box sx={{p: 3}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function BasicTabs({locale}: PropsWithChildren<ReactPropsI18n>) {
  // React states
  const [value, setValue] = React.useState<number>(1);
  // React change handlers
  const handleChange: ReactHandleChange<number> = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{width: '100%', bgcolor: 'background.paper'}}>
      <Box sx={{borderBottom: 10, borderColor: 'divider'}}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="Overview" {...ariaPropsTab(0)} />
          <Tab label="Map" {...ariaPropsTab(1)} />
          <Tab label="Blockchain" {...ariaPropsTab(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        Item One
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <TabMap locale={locale} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
  );
}
