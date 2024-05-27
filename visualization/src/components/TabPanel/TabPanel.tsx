'use client';

// Package imports
import {useCallback, useEffect, useMemo, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
// > Components
import {Box, ButtonGroup, Chip, Divider} from '@mui/material';
import Link from 'next/link';
// > Globals
import {baseUrlPathfinder, baseUrlSimulation} from '@globals/defaults/urls';
// Local imports
import {fetchJson} from '@globals/lib/fetch';
import {showErrorBuilder} from '@components/Modal/ErrorModal';
// > Components
import ErrorModal from '@components/Modal/ErrorModal';
import GenericButton from '@components/Button/GenericButton';
import SnackbarContentChange from '@components/Snackbar/SnackbarContentChange';
import TabBlockchain from '@components/Tab/TabBlockchain';
import TabMap from '@components/Tab/TabMap';
import TabOverview from '@components/Tab/TabOverview';
import TabPanelContainer from './TabPanelContainer';
import TabPanelHeader from './TabPanelHeader';
import TabSettings from '@components/Tab/TabSettings';
// Type imports
import type {
  ErrorModalContentElement,
  ErrorModalProps,
} from '@components/Modal/ErrorModal';
import type {
  GlobalPropsFetch,
  GlobalPropsShowError,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
} from '@misc/props/global';
import type {FetchOptions} from '@globals/lib/fetch';
import type {PropsWithChildren} from 'react';
import type {ReactPropsI18n} from '@misc/react';
import type {SettingsProps} from '@misc/props/settings';

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

enum UrlParameters {
  TAB_INDEX = 'tabIndex',
  DEBUG = 'debug',
  SPECTATOR = 'spectator',
}

export default function TabPanel({
  locale,
  messages,
}: PropsWithChildren<TabPanelProps>) {
  // Nextjs: Routing
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );
  const updateRouter = useCallback(() => {
    router.replace(`${pathname}?${params.toString()}`);
  }, [router, pathname, params]);

  // React: States
  // > Error Modal
  const [stateErrorModalOpen, setStateErrorModalOpen] = useState(false);
  const [stateErrorModalContent, setStateErrorModalContent] = useState<
    ErrorModalContentElement[]
  >([]);
  // > Tabpanel
  const [stateTabIndex, setStateTabIndex] = useState(
    searchParams.get(UrlParameters.TAB_INDEX)
      ? // Never go below min index 0 or over max index 3 (needs to be updated if additional pages are added!)
        Math.min(
          Math.max(0, Number(searchParams.get(UrlParameters.TAB_INDEX))),
          3
        )
      : 1
  );
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
  const [
    stateSettingsMapOpenPopupOnHover,
    setStateSettingsMapOpenPopupOnHover,
  ] = useState(false);
  const [stateSettingsMapUpdateRateInMs, setStateSettingsMapUpdateRateInMs] =
    useState(1000 / 5);
  const [
    stateSettingsBlockchainUpdateRateInMs,
    setStateSettingsBlockchainUpdateRateInMs,
  ] = useState(1000 / 5);
  const [stateSettingsGlobalDebug, setStateSettingsGlobalDebug] = useState(
    params.get(UrlParameters.DEBUG) === 'true'
  );
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
  const [stateSpectator, setStateSpectator] = useState(
    searchParams.get(UrlParameters.SPECTATOR) ?? 'everything'
  );
  const [stateSelectedParticipant, setStateSelectedParticipant] = useState<
    string | undefined
  >(undefined);
  const [stateSelectedRideRequest, setStateSelectedRideRequest] = useState<
    string | undefined
  >(undefined);
  // > Spectator List
  // TODO Experiment with fixing the autocomplete select
  const [stateSpectators, setStateSpectators] = useState<Map<string, {}>>(
    new Map()
  );
  const updateMap = (spectators: Array<[string, {}]>) => {
    for (const [spectatorId, spectatorInformation] of spectators) {
      setStateSpectators(
        prevState => new Map(prevState.set(spectatorId, spectatorInformation))
      );
    }
  };
  // TODO Use the global map to resolve additional information about an ID like a name (to resolve Customer/Matching Service instead of dfhsdhfdsfj and match)

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
  // > Update URL parameters
  useEffect(() => {
    console.log('Debug changed:', stateSettingsGlobalDebug);
    if (stateSettingsGlobalDebug) {
      params.set(UrlParameters.DEBUG, `${stateSettingsGlobalDebug}`);
    } else {
      params.delete(UrlParameters.DEBUG);
    }
    updateRouter();
  }, [stateSettingsGlobalDebug, updateRouter, pathname, params]);
  useEffect(() => {
    console.log('Tab index changed:', stateTabIndex);
    params.set(UrlParameters.TAB_INDEX, `${stateTabIndex}`);
    updateRouter();
  }, [stateTabIndex, updateRouter, pathname, params]);
  useEffect(() => {
    console.log('Spectator changed:', stateSpectator);
    params.set(UrlParameters.SPECTATOR, stateSpectator);
    updateRouter();
  }, [stateSpectator, updateRouter, pathname, params]);

  // Functions: With global state context
  const fetchJsonSimulation = async <T,>(
    endpoint: string,
    options?: Readonly<FetchOptions>
  ): Promise<T> =>
    fetchJson<T>(`${stateSettingsMapBaseUrlSimulation}${endpoint}`, options);
  const showError = showErrorBuilder({
    setStateErrorModalContent,
    setStateErrorModalOpen,
    stateErrorModalContent,
    stateErrorModalOpen,
  });

  // Group all available props together for easy forwarding
  const props: GlobalPropsShowError &
    GlobalPropsFetch &
    GlobalPropsSpectatorSelectedElements &
    GlobalPropsSpectatorSelectedElementsSet &
    SettingsProps &
    ErrorModalProps = {
    fetchJsonSimulation,
    setStateErrorModalContent,
    setStateErrorModalOpen,
    setStateSelectedParticipant,
    setStateSelectedRideRequest,
    setStateSettingsBlockchainUpdateRateInMs,
    setStateSettingsGlobalDebug,
    setStateSettingsMapBaseUrlPathfinder,
    setStateSettingsMapBaseUrlSimulation,
    setStateSettingsMapOpenPopupOnHover,
    setStateSettingsMapShowTooltips,
    setStateSettingsMapUpdateRateInMs,
    setStateSpectator,
    showError,
    stateErrorModalContent,
    stateErrorModalOpen,
    stateSelectedParticipant,
    stateSelectedRideRequest,
    stateSettingsBlockchainUpdateRateInMs,
    stateSettingsGlobalDebug,
    stateSettingsMapBaseUrlPathfinder,
    stateSettingsMapBaseUrlSimulation,
    stateSettingsMapOpenPopupOnHover,
    stateSettingsMapShowTooltips,
    stateSettingsMapUpdateRateInMs,
    stateSpectator,
  };

  return (
    <TabPanelContainer locale={locale} messages={messages}>
      <Box sx={{width: '100%'}}>
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
          <TabPanelHeader
            stateTabIndex={stateTabIndex}
            handleChangeTabIndex={(event, newTabIndex) => {
              setStateTabIndex(newTabIndex);
            }}
          />
        </Box>
        <CustomTabPanel value={stateTabIndex} index={0}>
          <TabOverview {...props} />
        </CustomTabPanel>
        <CustomTabPanel value={stateTabIndex} index={1}>
          <TabMap {...props} />
        </CustomTabPanel>
        <CustomTabPanel value={stateTabIndex} index={2}>
          <TabBlockchain {...props} />
        </CustomTabPanel>
        <CustomTabPanel value={stateTabIndex} index={3}>
          <TabSettings {...props} />
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
              <GenericButton onClick={() => setStateErrorModalOpen(true)}>
                Open Error Modal
              </GenericButton>
              <Link target="_blank" href={stateSettingsMapBaseUrlSimulation}>
                <GenericButton>Open Simulation Website</GenericButton>
              </Link>
              <Link target="_blank" href={stateSettingsMapBaseUrlPathfinder}>
                <GenericButton>Open Pathfinder Website</GenericButton>
              </Link>
            </ButtonGroup>
          </>
        ) : (
          <></>
        )}
      </Box>
      <ErrorModal {...props} />
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
