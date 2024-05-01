'use client';

// Package imports
import {useEffect, useState} from 'react';
// > Components
import {Box, ButtonGroup, Chip, Divider} from '@mui/material';
import Link from 'next/link';
// > Globals
import {baseUrlPathfinder, baseUrlSimulation} from '@globals/defaults/urls';
// Local imports
import {fetchJson} from '@globals/lib/fetch';
import {showErrorBuilder} from '@misc/modals';
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
import type {FetchJsonOptions} from '@globals/lib/fetch';
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
      {value === index && <Box sx={{p: 3}}>{children}</Box>}
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
  const [stateSettingsMapUpdateRateInMs, setStateSettingsMapUpdateRateInMs] =
    useState(1000 / 4);
  const [
    stateSettingsBlockchainUpdateRateInMs,
    setStateSettingsBlockchainUpdateRateInMs,
  ] = useState(1000 / 4);
  const [stateSettingsGlobalDebug, setStateSettingsGlobalDebug] =
    useState(false);

  // > Snackbar
  const [stateSnackbarSpectatorOpen, setStateSnackbarSpectatorOpen] =
    useState(false);
  const [
    stateSnackbarSelectedParticipantOpen,
    setStateSnackbarSelectedParticipantOpen,
  ] = useState(false);
  const [
    stateSnackbarSelectedRideRequestOpen,
    setStateSnackbarSelectedRideRequestOpen,
  ] = useState(false);
  // > Global States
  const [stateSpectator, setStateSpectator] = useState('everything');
  const [stateSelectedParticipant, setStateSelectedParticipant] = useState<
    string | undefined
  >(undefined);
  const [stateSelectedRideRequest, setStateSelectedRideRequest] = useState<
    string | undefined
  >(undefined);

  // React: State change listeners
  // > Snackbar change listeners (only being run when a dependency changes)
  useEffect(() => {
    console.log('Spectator changed:', stateSpectator);
    setStateSnackbarSpectatorOpen(true);
  }, [stateSpectator, setStateSnackbarSpectatorOpen]);
  useEffect(() => {
    console.log('Selected participant changed:', stateSelectedParticipant);
    setStateSnackbarSelectedParticipantOpen(true);
  }, [stateSelectedParticipant, setStateSnackbarSelectedParticipantOpen]);
  useEffect(() => {
    console.log('Selected ride request changed:', stateSelectedRideRequest);
    setStateSnackbarSelectedRideRequestOpen(true);
  }, [stateSelectedRideRequest, setStateSnackbarSelectedRideRequestOpen]);

  // Functions: With global state context
  const fetchJsonSimulation = async <T,>(
    endpoint: string,
    options?: Readonly<FetchJsonOptions>
  ): Promise<T> =>
    fetchJson<T>(`${stateSettingsMapBaseUrlSimulation}${endpoint}`, options);
  const showError = showErrorBuilder({
    setStateErrorModalContent,
    setStateErrorModalOpen,
    stateErrorModalContent,
  });

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
          <TabOverview stateSettingsGlobalDebug={stateSettingsGlobalDebug} />
        </CustomTabPanel>
        <CustomTabPanel value={stateTabIndex} index={1}>
          <TabMap
            fetchJsonSimulation={fetchJsonSimulation}
            setStateSelectedParticipant={setStateSelectedParticipant}
            setStateSelectedRideRequest={setStateSelectedRideRequest}
            setStateSpectator={setStateSpectator}
            showError={showError}
            stateSelectedParticipant={stateSelectedParticipant}
            stateSelectedRideRequest={stateSelectedRideRequest}
            stateSettingsGlobalDebug={stateSettingsGlobalDebug}
            stateSettingsMapBaseUrlPathfinder={
              stateSettingsMapBaseUrlPathfinder
            }
            stateSettingsMapBaseUrlSimulation={
              stateSettingsMapBaseUrlSimulation
            }
            stateSettingsMapOpenPopupOnHover={stateOpenPopupOnHover}
            stateSettingsMapShowTooltips={stateSettingsMapShowTooltips}
            stateSettingsMapUpdateRateInMs={stateSettingsMapUpdateRateInMs}
            stateSpectator={stateSpectator}
          />
        </CustomTabPanel>
        <CustomTabPanel value={stateTabIndex} index={2}>
          <TabBlockchain
            fetchJsonSimulation={fetchJsonSimulation}
            setStateSelectedParticipant={setStateSelectedParticipant}
            setStateSelectedRideRequest={setStateSelectedRideRequest}
            setStateSpectator={setStateSpectator}
            showError={showError}
            stateSelectedParticipant={stateSelectedParticipant}
            stateSelectedRideRequest={stateSelectedRideRequest}
            stateSettingsBlockchainUpdateRateInMs={
              stateSettingsBlockchainUpdateRateInMs
            }
            stateSettingsGlobalDebug={stateSettingsGlobalDebug}
            stateSpectator={stateSpectator}
          />
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
            stateSettingsMapUpdateRateInMs={stateSettingsMapUpdateRateInMs}
            stateSettingsBlockchainUpdateRateInMs={
              stateSettingsBlockchainUpdateRateInMs
            }
            setStateSettingsMapUpdateRateInMs={
              setStateSettingsMapUpdateRateInMs
            }
            setStateSettingsBlockchainUpdateRateInMs={
              setStateSettingsBlockchainUpdateRateInMs
            }
            stateSettingsGlobalDebug={stateSettingsGlobalDebug}
            setStateSettingsGlobalDebug={setStateSettingsGlobalDebug}
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
        {stateSettingsGlobalDebug ? (
          <>
            <Divider>
              <Chip label="Debugging" size="small" />
            </Divider>
            <ButtonGroup variant="contained" aria-label="Basic button group">
              <Button onClick={() => setStateErrorModalOpen(true)}>
                Open Error Modal
              </Button>
              <Link target="_blank" href={stateSettingsMapBaseUrlSimulation}>
                <Button onClick={() => {}}>Open Simulation Website</Button>
              </Link>
              <Link target="_blank" href={stateSettingsMapBaseUrlPathfinder}>
                <Button onClick={() => {}}>Open Pathfinder Website</Button>
              </Link>
            </ButtonGroup>
          </>
        ) : (
          <></>
        )}
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
        bottomOffset={60}
      />
      <SnackbarContentChange
        stateOpen={stateSnackbarSelectedRideRequestOpen}
        stateContent={stateSelectedRideRequest}
        setStateOpen={setStateSnackbarSelectedRideRequestOpen}
        handleChangeStateContent={a =>
          a === undefined
            ? 'No ride request selected any more'
            : `Changed selected ride request to ${a}`
        }
        bottomOffset={120}
      />
    </TabPanelContainer>
  );
}
