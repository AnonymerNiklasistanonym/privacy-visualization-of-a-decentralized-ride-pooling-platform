'use client';

// Package imports
import {useState} from 'react';
// > Components
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// Local imports
// > Components
import TabMap from '@components/TabPanel/TabMap';
import TabSettings from '@components/TabPanel/TabSettings';
import TabPanelContainer from './TabPanelContainer';
import TabPanelHeader from './TabPanelHeader';
// Type imports
import type {ReactPropsI18n} from '@misc/react';
import type {PropsWithChildren} from 'react';

interface CustomTabPanelProps {
  index: number;
  value: number;
}

function CustomTabPanel(props: PropsWithChildren<CustomTabPanelProps>) {
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TabPanelProps extends ReactPropsI18n {}

export default function TabPanel({
  locale,
  messages,
}: PropsWithChildren<TabPanelProps>) {
  // React states
  // > Tabpanel
  const [value, setValue] = useState(1);
  // > Settings
  const [stateSettingsMapShowTooltips, setStateSettingsMapShowTooltips] =
    useState(false);
  const [stateOpenPopupOnHover, setStateOpenPopupOnHover] = useState(false);
  // React change handlers
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <TabPanelContainer locale={locale} messages={messages}>
      <Box sx={{width: '100%'}}>
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
          <TabPanelHeader stateValue={value} handleChange={handleChange} />
        </Box>
        <CustomTabPanel value={value} index={0}>
          TODO
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <TabMap
            locale={locale}
            stateSettingsMapShowTooltips={stateSettingsMapShowTooltips}
            stateSettingsMapOpenPopupOnHover={stateOpenPopupOnHover}
            messages={{}}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          TODO
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <TabSettings
            locale={locale}
            stateSettingsMapShowTooltips={stateSettingsMapShowTooltips}
            setStateSettingsMapShowTooltips={setStateSettingsMapShowTooltips}
            stateSettingsMapOpenPopupOnHover={stateOpenPopupOnHover}
            setStateSettingsMapOpenPopupOnHover={setStateOpenPopupOnHover}
            messages={{}}
          />
        </CustomTabPanel>
      </Box>
    </TabPanelContainer>
  );
}
