'use client';

// Package imports
import {useEffect, useState} from 'react';
// > Components
import {Box, ButtonGroup, Chip, Divider, Typography} from '@mui/material';
// > Globals
import {baseUrlPathfinder, baseUrlSimulation} from '@globals/defaults/urls';
// Local imports
// > Components
import Button from '@components/Button';
import ErrorModal from '@components/Modal/ErrorModal';
import SnackbarContentChange from '@components/Snackbar/SnackbarContentChange';
import TabBlockchain from '@components/Tab/TabBlockchain';
import TabMap from '@components/Tab/TabMap';
import TabOverview from '@components/Tab/TabOverview';
import TabPanelContainer from './TabPanelContainer';
import TabPanelHeader from './TabPanelHeader';
import TabSettings from '@components/Tab/TabSettings';
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
  // React: States
  // > Error Modal
  const [stateErrorModalOpen, setStateErrorModalOpen] = useState(false);
  const [stateErrorModalContent, setStateErrorModalContent] = useState<
    ErrorModalContentElement[]
  >([]);
  // > Tabpanel
  const [stateTabIndex, setStateTabIndex] = useState(1);
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
  // > Snackbar
  const [stateSnackbarSpectatorOpen, setStateSnackbarSpectatorOpen] =
    useState(false);
  const [
    stateSnackbarSelectedParticipantOpen,
    setStateSnackbarSelectedParticipantOpen,
  ] = useState(false);
  // > Global States
  const [stateSpectator, setStateSpectator] = useState('everything');
  const [stateSelectedParticipant, setStateSelectedParticipant] = useState<
    string | undefined
  >(undefined);

  // React: State change listeners
  useEffect(() => {
    // Run this when any listed state dependency changes
    console.log('Spectator changed:', stateSpectator);
    setStateSnackbarSpectatorOpen(true);
  }, [stateSpectator, setStateSnackbarSpectatorOpen]);
  useEffect(() => {
    // Run this when any listed state dependency changes
    console.log('Selected participant changed:', stateSelectedParticipant);
    setStateSnackbarSelectedParticipantOpen(true);
  }, [stateSelectedParticipant, setStateSnackbarSelectedParticipantOpen]);

  return (
    <TabPanelContainer locale={locale} messages={messages}>
      <Box sx={{width: '100%'}}>
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
          <TabPanelHeader
            stateTabIndex={stateTabIndex}
            handleChangeTabIndex={(event, newTabIndex) =>
              setStateTabIndex(newTabIndex)
            }
          />
        </Box>
        <CustomTabPanel value={stateTabIndex} index={0}>
          <TabOverview />
        </CustomTabPanel>
        <CustomTabPanel value={stateTabIndex} index={1}>
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
            stateSpectator={stateSpectator}
            setStateSpectator={setStateSpectator}
            stateSelectedParticipant={stateSelectedParticipant}
            setStateSelectedParticipant={setStateSelectedParticipant}
          />
        </CustomTabPanel>
        <CustomTabPanel value={stateTabIndex} index={2}>
          <TabBlockchain />
        </CustomTabPanel>
        <CustomTabPanel value={stateTabIndex} index={3}>
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
      <SnackbarContentChange
        stateOpen={stateSnackbarSpectatorOpen}
        stateContent={stateSpectator}
        setStateOpen={setStateSnackbarSpectatorOpen}
        handleChangeStateContent={a => `Changed spectator to ${a}`}
      />
      <SnackbarContentChange
        stateOpen={stateSnackbarSelectedParticipantOpen}
        stateContent={stateSelectedParticipant}
        setStateOpen={setStateSnackbarSelectedParticipantOpen}
        handleChangeStateContent={a =>
          a === undefined
            ? 'No participant selected any more'
            : `Changed selected participant to ${a}`
        }
        bottomOffset={50}
      />
    </TabPanelContainer>
  );
}
