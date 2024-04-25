'use client';

// Package imports
import {useState} from 'react';
// > Components
import {Box, ButtonGroup, Chip, Divider, Typography} from '@mui/material';
// > Globals
import {baseUrlPathfinder, baseUrlSimulation} from '@globals/defaults/urls';
// Local imports
// > Components
import Button from '@components/Button';
import ErrorModal from '@components/Modal/ErrorModal';
import TabBlockchain from './TabBlockchain';
import TabMap from './TabMap';
import TabOverview from './TabOverview';
import TabPanelContainer from './TabPanelContainer';
import TabPanelHeader from './TabPanelHeader';
import TabSettings from './TabSettings';
// Type imports
import type {ErrorModalContentElement} from '@misc/modals';
import type {PropsWithChildren} from 'react';
import type {ReactPropsI18n} from '@misc/react';

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
  // > Error Modal
  const [stateErrorModalOpen, setStateErrorModalOpen] = useState(false);
  const [stateErrorModalContent, setStateErrorModalContent] = useState<
    ErrorModalContentElement[]
  >([]);
  // > Tabpanel
  const [value, setValue] = useState(1);
  // > Settings
  const [stateSettingsMapShowTooltips, setStateSettingsMapShowTooltips] =
    useState(false);
  const [
    stateSettingsMapBaseUrlPathfinder,
    setStateSettingsMapBaseUrlPathfinder,
  ] = useState(baseUrlPathfinder);
  const [
    stateSettingsMapBaseUrlSimulation,
    setStateSettingsMapBaseUrlSimulation,
  ] = useState(baseUrlSimulation);
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
          <TabOverview />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <TabMap
            stateSettingsMapShowTooltips={stateSettingsMapShowTooltips}
            stateSettingsMapOpenPopupOnHover={stateOpenPopupOnHover}
            stateSettingsMapBaseUrlPathfinder={
              stateSettingsMapBaseUrlPathfinder
            }
            stateSettingsMapBaseUrlSimulation={
              stateSettingsMapBaseUrlSimulation
            }
            stateErrorModalContent={stateErrorModalContent}
            setStateErrorModalOpen={setStateErrorModalOpen}
            setStateErrorModalContent={setStateErrorModalContent}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <TabBlockchain />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <TabSettings
            stateSettingsMapShowTooltips={stateSettingsMapShowTooltips}
            setStateSettingsMapShowTooltips={setStateSettingsMapShowTooltips}
            stateSettingsMapOpenPopupOnHover={stateOpenPopupOnHover}
            setStateSettingsMapOpenPopupOnHover={setStateOpenPopupOnHover}
            stateSettingsMapBaseUrlPathfinder={
              stateSettingsMapBaseUrlPathfinder
            }
            stateSettingsMapBaseUrlSimulation={
              stateSettingsMapBaseUrlSimulation
            }
            setStateSettingsMapBaseUrlPathfinder={
              setStateSettingsMapBaseUrlPathfinder
            }
            setStateSettingsMapBaseUrlSimulation={
              setStateSettingsMapBaseUrlSimulation
            }
          />
        </CustomTabPanel>
      </Box>
      <Box
        sx={{
          '& > *': {m: 1},
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          marginTop: '1vh',
        }}
      >
        <Divider>
          <Chip label="Debugging" size="small" />
        </Divider>
        <ButtonGroup variant="contained" aria-label="Basic button group">
          <Button onClick={() => setStateErrorModalOpen(true)}>
            Open Error Modal
          </Button>
        </ButtonGroup>
      </Box>
      <ErrorModal
        setStateErrorModalOpen={setStateErrorModalOpen}
        setStateErrorModalContent={setStateErrorModalContent}
        stateErrorModalContent={stateErrorModalContent}
        stateErrorModalOpen={stateErrorModalOpen}
      />
    </TabPanelContainer>
  );
}
