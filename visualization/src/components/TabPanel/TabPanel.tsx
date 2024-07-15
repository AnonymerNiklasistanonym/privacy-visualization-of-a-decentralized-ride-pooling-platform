'use client';

// Package imports
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {
  Badge,
  Box,
  ButtonGroup,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
} from '@mui/material';
import Link from 'next/link';
import {Refresh as RefreshIcon} from '@mui/icons-material';
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
// > Misc
import {debugComponentUpdateCounter} from '@misc/debug';
import {stringComparator} from '@misc/compare';
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
import type {
  SettingsGlobalProps,
  SettingsProps,
  SettingsUiProps,
} from '@misc/props/settings';
import type {ModalErrorProps} from '@components/Modal/ModalError';

interface CustomTabPanelProps extends SettingsGlobalProps, SettingsUiProps {
  index: number;
  value: number;
}

function CustomTabPanel(props: PropsWithChildren<CustomTabPanelProps>) {
  const {
    children,
    value,
    index,
    stateSettingsUiGridSpacing,
    stateSettingsGlobalDebug,
  } = props;

  const spacing = useMemo<string>(
    () => `${stateSettingsUiGridSpacing / 2}rem`,
    [stateSettingsUiGridSpacing]
  );

  const [stateRenderList, setStateRenderList] = useState<
    Array<[string, number]>
  >([]);

  const updateRenderCount = useCallback(() => {
    setStateRenderList(
      Array.from(debugComponentUpdateCounter).sort((a, b) =>
        stringComparator(a[0], b[0])
      )
    );
  }, [setStateRenderList]);

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
      {stateSettingsGlobalDebug ? (
        <>
          <Divider>
            <Chip label="Debug #Render" size="small" />
          </Divider>
          <List>
            {stateRenderList.map(([name, count]) => (
              <ListItem key={`simple-tabpanel-${index}-item-${name}`}>
                <ListItemIcon>
                  <Badge badgeContent={count} color="primary">
                    <RefreshIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            ))}
          </List>
          <ButtonGroup variant="contained" aria-label="Basic button group">
            <GenericButton onClick={updateRenderCount}>
              Update render count
            </GenericButton>
          </ButtonGroup>
        </>
      ) : undefined}
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
  /** The initial tab that should be displayed */
  initialTabIndex?: number;
  /** Callback that runs every time the tab index changes */
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
    stateSettingsFetchBaseUrlSimulation,
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
          stateSettingsUiGridSpacing={stateSettingsUiGridSpacing}
          stateSettingsGlobalDebug={stateSettingsGlobalDebug}
        >
          <TabMap {...props} />
        </CustomTabPanel>
        <CustomTabPanel
          value={stateTabIndex}
          index={1}
          stateSettingsUiGridSpacing={stateSettingsUiGridSpacing}
          stateSettingsGlobalDebug={stateSettingsGlobalDebug}
        >
          <TabBlockchain {...props} />
        </CustomTabPanel>
        <CustomTabPanel
          value={stateTabIndex}
          index={2}
          stateSettingsUiGridSpacing={stateSettingsUiGridSpacing}
          stateSettingsGlobalDebug={stateSettingsGlobalDebug}
        >
          <TabOverview {...props} />
        </CustomTabPanel>
        <CustomTabPanel
          value={stateTabIndex}
          index={3}
          stateSettingsUiGridSpacing={stateSettingsUiGridSpacing}
          stateSettingsGlobalDebug={stateSettingsGlobalDebug}
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
              <Link target="_blank" href={stateSettingsFetchBaseUrlSimulation}>
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
