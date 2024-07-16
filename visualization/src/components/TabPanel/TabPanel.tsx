'use client';

// Package imports
import {useCallback, useEffect, useMemo} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {Box, ButtonGroup, Tab, Tabs} from '@mui/material';
import Link from 'next/link';
// Local imports
// > Components
import {
  TabBlockchainIcon,
  TabMapIcon,
  TabOverviewIcon,
  TabSettingsIcon,
} from '@components/Icons';
import GenericButton from '@components/Input/InputButton/InputButtonGeneric';
import TabBlockchain from '@components/Tab/TabBlockchain';
import TabMap from '@components/Tab/TabMap';
import TabOverview from '@components/Tab/TabOverview';
import TabPanelTab from './TabPanelTab';
import TabSettings from '@components/Tab/TabSettings';
// > Misc
import {TabIndex} from '@misc/tabIndices';
// Type imports
import type {
  GlobalPropsFetch,
  GlobalPropsIntlValues,
  GlobalPropsModalDataInformation,
  GlobalPropsSearch,
  GlobalPropsShowError,
  GlobalPropsSpectatorMap,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
  GlobalPropsSpectatorsSet,
  GlobalPropsTabIndex,
  GlobalPropsTabIndexSet,
} from '@misc/props/global';
import type {ModalErrorProps} from '@components/Modal/ModalError';
import type {ReactElement} from 'react';
import type {SettingsProps} from '@misc/props/settings';
import TabPanelTabSectionDebug from './TabPanelTabSectionDebug';

export interface TabPanelProps
  extends GlobalPropsShowError,
    GlobalPropsFetch,
    GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorSelectedElementsSet,
    SettingsProps,
    GlobalPropsSpectatorMap,
    GlobalPropsTabIndex,
    GlobalPropsTabIndexSet,
    GlobalPropsModalDataInformation,
    ModalErrorProps,
    GlobalPropsSpectatorsSet,
    GlobalPropsIntlValues,
    GlobalPropsSearch {}

// eslint-disable-next-line no-empty-pattern
export default function TabPanel(props: TabPanelProps) {
  const {
    setStateErrorModalOpen,
    setStateTabIndex,
    showError,
    stateErrorModalContent,
    stateSettingsFetchBaseUrlSimulation,
    stateSettingsGlobalDebug,
    stateSettingsMapBaseUrlPathfinder,
    stateSettingsUiGridSpacing,
    stateTabIndex,
    updateGlobalSearch,
  } = props;

  // i18n
  const intl = useIntl();

  const tabs = useMemo<Array<[string, number, ReactElement]>>(
    () => [
      [
        intl.formatMessage({id: 'page.home.tab.map.title'}),
        TabIndex.MAP,
        <TabMapIcon key="map" />,
      ],
      [
        intl.formatMessage({id: 'page.home.tab.blockchain.title'}),
        TabIndex.BLOCKCHAIN,
        <TabBlockchainIcon key="blockchain" />,
      ],
      [
        intl.formatMessage({id: 'page.home.tab.guide.title'}),
        TabIndex.GUIDE,
        <TabOverviewIcon key="guide" />,
      ],
      [
        intl.formatMessage({id: 'page.home.tab.settings.title'}),
        TabIndex.SETTINGS,
        <TabSettingsIcon key="settings" />,
      ],
    ],
    [intl]
  );

  useEffect(() => {
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
  }, [updateGlobalSearch, tabs, setStateTabIndex]);

  const openErrorModal = useCallback(() => {
    setStateErrorModalOpen(true);
    if (stateErrorModalContent.length === 0) {
      showError('Dummy', Error('Dummy', {cause: 'Dummy'}));
    }
  }, [setStateErrorModalOpen, showError, stateErrorModalContent.length]);

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
        <TabPanelTab
          value={stateTabIndex}
          index={0}
          stateSettingsUiGridSpacing={stateSettingsUiGridSpacing}
          stateSettingsGlobalDebug={stateSettingsGlobalDebug}
        >
          <TabMap {...props} />
        </TabPanelTab>
        <TabPanelTab
          value={stateTabIndex}
          index={1}
          stateSettingsUiGridSpacing={stateSettingsUiGridSpacing}
          stateSettingsGlobalDebug={stateSettingsGlobalDebug}
        >
          <TabBlockchain {...props} />
        </TabPanelTab>
        <TabPanelTab
          value={stateTabIndex}
          index={2}
          stateSettingsUiGridSpacing={stateSettingsUiGridSpacing}
          stateSettingsGlobalDebug={stateSettingsGlobalDebug}
        >
          <TabOverview {...props} />
        </TabPanelTab>
        <TabPanelTab
          value={stateTabIndex}
          index={3}
          stateSettingsUiGridSpacing={stateSettingsUiGridSpacing}
          stateSettingsGlobalDebug={stateSettingsGlobalDebug}
        >
          <TabSettings {...props} />
        </TabPanelTab>
      </Box>
      <TabPanelTabSectionDebug
        title="Debugging"
        stateSettingsGlobalDebug={stateSettingsGlobalDebug}
      >
        <ButtonGroup variant="contained" aria-label="Basic button group">
          <GenericButton onClick={openErrorModal}>
            Open Error Modal
          </GenericButton>
          <Link target="_blank" href={stateSettingsFetchBaseUrlSimulation}>
            <GenericButton>Open Simulation Website</GenericButton>
          </Link>
          <Link target="_blank" href={stateSettingsMapBaseUrlPathfinder}>
            <GenericButton>Open Pathfinder Website</GenericButton>
          </Link>
        </ButtonGroup>
      </TabPanelTabSectionDebug>
    </Box>
  );
}
