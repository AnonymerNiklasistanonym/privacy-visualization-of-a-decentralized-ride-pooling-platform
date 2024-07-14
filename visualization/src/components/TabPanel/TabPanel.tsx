'use client';

// Package imports
import {useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {Box, ButtonGroup, Chip, Divider, Tab, Tabs} from '@mui/material';
import Link from 'next/link';
// > Components
import {
  TabBlockchainIcon,
  TabMapIcon,
  TabOverviewIcon,
  TabSettingsIcon,
} from '@components/Icons';
import Footer from '@components/Footer';
import GenericButton from '@components/Input/InputButton/InputButtonGeneric';
import TabBlockchain from '@components/Tab/TabBlockchain';
import TabMap from '@components/Tab/TabMap';
import TabOverview from '@components/Tab/TabOverview';
import TabSettings from '@components/Tab/TabSettings';
// Type imports
import type {
  GlobalPropsFetch,
  GlobalPropsIntlValues,
  GlobalPropsSearch,
  GlobalPropsShowError,
  GlobalPropsSpectatorMap,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
  GlobalPropsSpectatorsSet,
} from '@misc/props/global';
import type {PropsWithChildren, ReactElement} from 'react';
import type {ModalErrorProps} from '@components/Modal/ModalError';
import type {SettingsProps} from '@misc/props/settings';

interface CustomTabPanelProps {
  index: number;
  value: number;
  spacing: string;
}

function CustomTabPanel(props: PropsWithChildren<CustomTabPanelProps>) {
  const {children, value, index, spacing} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box
          sx={{
            padding: {
              lg: `0 ${spacing} 0 ${spacing}`,
              md: 0,
              sm: 0,
              xl: `0 ${spacing} 0 ${spacing}`,
              xs: 0,
            },
          }}
        >
          {children}
          <Footer />
        </Box>
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
    GlobalPropsSpectatorMap,
    ModalErrorProps,
    GlobalPropsSpectatorsSet,
    GlobalPropsIntlValues,
    GlobalPropsSearch {
  initialTabIndex?: number;
  onTabIndexChange?: (tabIndex: number) => void;
}

// eslint-disable-next-line no-empty-pattern
export default function TabPanel(props: TabPanelProps) {
  const {
    initialTabIndex,
    onTabIndexChange,
    showError,
    stateErrorModalContent,
    stateSettingsGlobalDebug,
    setStateErrorModalOpen,
    stateSettingsMapBaseUrlSimulation,
    stateSettingsMapBaseUrlPathfinder,
    stateSettingsUiGridSpacing,
    updateGlobalSearch,
  } = props;

  // i18n
  const intl = useIntl();

  // React: States
  // > Tabpanel
  const [stateTabIndex, setStateTabIndex] = useState(initialTabIndex ?? 0);

  // React: Listen for changes in created states
  // > URL parameter listeners
  useEffect(() => {
    if (onTabIndexChange !== undefined) {
      onTabIndexChange(stateTabIndex);
    }
  }, [onTabIndexChange, stateTabIndex]);

  const tabs = useMemo<Array<[string, number, ReactElement]>>(
    () => [
      [
        intl.formatMessage({id: 'page.home.tab.map.title'}),
        0,
        <TabMapIcon key="map" />,
      ],
      [
        intl.formatMessage({id: 'page.home.tab.blockchain.title'}),
        1,
        <TabBlockchainIcon key="blockchain" />,
      ],
      [
        intl.formatMessage({id: 'page.home.tab.guide.title'}),
        2,
        <TabOverviewIcon key="overview" />,
      ],
      [
        intl.formatMessage({id: 'page.home.tab.settings.title'}),
        3,
        <TabSettingsIcon key="settings" />,
      ],
    ],
    [intl]
  );

  // Update global search entries
  // > Tabs
  updateGlobalSearch(
    [],
    tabs.map(([tabTitle, tabIndex, tabIcon]) => [
      tabTitle,
      () => ({
        callback: () => {
          setStateTabIndex(tabIndex);
        },
        category: 'tab',
        icon: tabIcon,
        keywords: ['tab', 'switch', tabTitle, `${tabIndex}`],
        name: tabTitle,
      }),
    ])
  );

  return (
    <Box>
      <Box
        sx={{
          width: '100%',
        }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Tabs
            value={stateTabIndex}
            onChange={(event, newTabIndex) => setStateTabIndex(newTabIndex)}
            scrollButtons={true}
            variant="fullWidth"
          >
            {tabs.map(([tabTitle, tabIndex, tabIcon]) => (
              <Tab
                key={tabIndex}
                label={tabTitle.toUpperCase()}
                icon={tabIcon}
              />
            ))}
          </Tabs>
        </Box>
        <CustomTabPanel
          value={stateTabIndex}
          index={0}
          spacing={`${stateSettingsUiGridSpacing / 2}rem`}
        >
          <TabMap {...props} />
        </CustomTabPanel>
        <CustomTabPanel
          value={stateTabIndex}
          index={1}
          spacing={`${stateSettingsUiGridSpacing / 2}rem`}
        >
          <TabBlockchain {...props} />
        </CustomTabPanel>
        <CustomTabPanel
          value={stateTabIndex}
          index={2}
          spacing={`${stateSettingsUiGridSpacing / 2}rem`}
        >
          <TabOverview {...props} />
        </CustomTabPanel>
        <CustomTabPanel
          value={stateTabIndex}
          index={3}
          spacing={`${stateSettingsUiGridSpacing / 2}rem`}
        >
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
              <GenericButton
                onClick={() => {
                  setStateErrorModalOpen(true);
                  if (stateErrorModalContent.length === 0) {
                    showError('Dummy', Error('Dummy', {cause: 'Dummy'}));
                  }
                }}
              >
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
    </Box>
  );
}
