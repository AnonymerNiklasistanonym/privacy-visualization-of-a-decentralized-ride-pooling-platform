'use client';

// Package imports
import {useCallback, useEffect, useMemo, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useIntl} from 'react-intl';
// > Components
import {Box, ButtonGroup, Chip, Divider} from '@mui/material';
import Link from 'next/link';
// Local imports
import {UrlParameters} from '@misc/urlParameter';
// > Components
import {
  TabBlockchainIcon,
  TabMapIcon,
  TabOverviewIcon,
  TabSettingsIcon,
} from '@components/Icons';
import GenericButton from '@components/Button/GenericButton';
import TabBlockchain from '@components/Tab/TabBlockchain';
import TabMap from '@components/Tab/TabMap';
import TabOverview from '@components/Tab/TabOverview';
import TabPanelHeader from './TabPanelHeader';
import TabSettings from '@components/Tab/TabSettings';
// Type imports
import type {
  GlobalPropsFetch,
  GlobalPropsParticipantSelectedElements,
  GlobalPropsParticipantSelectedElementsSet,
  GlobalPropsSearch,
  GlobalPropsShowError,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
  GlobalPropsSpectatorsSet,
} from '@misc/props/global';
import type {PropsWithChildren, ReactElement} from 'react';
import type {ErrorModalProps} from '@components/Modal/ErrorModal';
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
      {value === index && (
        <Box sx={{p: 3, padding: {sm: '1rem', xs: 0}}}>{children}</Box>
      )}
    </div>
  );
}

export interface TabPanelProps
  extends GlobalPropsShowError,
    GlobalPropsFetch,
    GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorSelectedElementsSet,
    SettingsProps,
    ErrorModalProps,
    GlobalPropsSpectatorsSet,
    GlobalPropsSearch,
    GlobalPropsParticipantSelectedElements,
    GlobalPropsParticipantSelectedElementsSet {}

// eslint-disable-next-line no-empty-pattern
export default function TabPanel(props: TabPanelProps) {
  const {
    stateSettingsGlobalDebug,
    setStateErrorModalOpen,
    stateSettingsMapBaseUrlSimulation,
    stateSettingsMapBaseUrlPathfinder,
    updateGlobalSearch,
  } = props;

  // i18n
  const intl = useIntl();

  // NextJs: Routing
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

  // React: Listen for changes in created states
  // > URL parameter listeners
  useEffect(() => {
    params.set(UrlParameters.TAB_INDEX, `${stateTabIndex}`);
    updateRouter();
  }, [stateTabIndex, updateRouter, pathname, params]);

  const tabs: ReadonlyArray<[string, number, ReactElement]> = [
    [
      intl.formatMessage({id: 'page.home.tab.overview.title'}),
      0,
      <TabOverviewIcon key="overview" />,
    ],
    [
      intl.formatMessage({id: 'page.home.tab.map.title'}),
      1,
      <TabMapIcon key="map" />,
    ],
    [
      intl.formatMessage({id: 'page.home.tab.blockchain.title'}),
      2,
      <TabBlockchainIcon key="blockchain" />,
    ],
    [
      intl.formatMessage({id: 'page.home.tab.settings.title'}),
      3,
      <TabSettingsIcon key="settings" />,
    ],
  ];

  // Update global search entries
  // > Tabs
  updateGlobalSearch(
    [],
    tabs.map(([tabTitle, tabIndex, tabIcon]) => [
      tabTitle,
      () => ({
        callback: () => {
          console.log('TODO Switch to tab', tabIndex);
          setStateTabIndex(tabIndex);
        },
        icon: tabIcon,
        keywords: ['tab', 'switch', tabTitle, `${tabIndex}`],
        name: tabTitle,
      }),
    ]),
    []
  );

  return (
    <>
      <Box
        sx={{
          width: '100%',
        }}
      >
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
    </>
  );
}
