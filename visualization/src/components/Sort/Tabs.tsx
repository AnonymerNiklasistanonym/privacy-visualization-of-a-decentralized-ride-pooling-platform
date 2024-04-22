'use client';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// Type imports
import {useState, type PropsWithChildren} from 'react';
import TabMap from '@components/Tabs/TabMap';
import {ReactPropsI18n} from '@globals/types/react';
import TabSettings from '@components/Tabs/TabSettings';

interface TabPanelProps {
  index: number;
  value: number;
}

function CustomTabPanel(props: PropsWithChildren<TabPanelProps>) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{p: 3}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({locale}: PropsWithChildren<ReactPropsI18n>) {
  // React states
  // > Tabpanel
  const [value, setValue] = useState(0);
  // > Settings
  const [stateSettingsMapShowTooltips, setStateSettingsMapShowTooltips] =
    useState(false);
  // React change handlers
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{width: '100%'}}>
      <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="Overview" {...a11yProps(0)} />
          <Tab label="Map" {...a11yProps(1)} />
          <Tab label="Blockchain" {...a11yProps(2)} />
          <Tab label="Settings" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        Item One
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <TabMap
          locale={locale}
          stateSettingsMapShowTooltips={stateSettingsMapShowTooltips}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <TabSettings
          locale={locale}
          stateSettingsMapShowTooltips={stateSettingsMapShowTooltips}
          setStateSettingsMapShowTooltips={setStateSettingsMapShowTooltips}
        />
      </CustomTabPanel>
    </Box>
  );
}
