'use client';

// Package imports
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {
  Badge,
  Box,
  ButtonGroup,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
} from '@mui/material';
import Link from 'next/link';
import {Refresh as RefreshIcon} from '@mui/icons-material';
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
import TabPanelTabSectionDebug from './TabPanelTabSectionDebug';
import TabSettings from '@components/Tab/TabSettings';
import TableDebugData from '@components/Table/TableDebugData';
// > Globals
import {simulationEndpoints} from '@globals/defaults/endpoints';
// > Misc
import {
  debugComponentRenderCounter,
  debugComponentUpdateCounter,
} from '@misc/debug';
import {TabIndex} from '@misc/tabIndices';
import {fetchTextEndpoint} from '@misc/fetch';
import {stringComparator} from '@misc/compare';
// Type imports
import type {
  GlobalPropsShowError,
  GlobalPropsTabIndex,
  GlobalPropsTabIndexSet,
} from '@misc/props/global';
import type {
  SimulationEndpointParticipantCoordinates,
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointRideRequestInformation,
  SimulationEndpointRideRequests,
  SimulationEndpointSmartContractInformation,
  SimulationEndpointSmartContracts,
} from '@globals/types/simulation';
import type {DebugData} from '@components/Table/DebugData';
import type {ModalErrorProps} from '@components/Modal/ModalError';
import type {ReactElement} from 'react';
import type {SettingsProps} from '@misc/props/settings';
import type {TabBlockchainProps} from '@components/Tab/TabBlockchain';
import type {TabMapProps} from '@components/Tab/TabMap/TabMap';
import type {TabPanelTabProps} from './TabPanelTab';
import type {TabSettingsProps} from '@components/Tab/TabSettings';

export interface TabPanelProps
  extends GlobalPropsShowError,
    SettingsProps,
    GlobalPropsTabIndex,
    GlobalPropsTabIndexSet,
    ModalErrorProps,
    TabBlockchainProps,
    TabMapProps,
    TabSettingsProps {}

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
    fetchJsonSimulation,
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

  const [stateRenderList, setStateRenderList] = useState<
    Array<[string, number]>
  >([]);

  const [stateUpdateList, setStateUpdateList] = useState<
    Array<[string, number]>
  >([]);

  // React states
  // > Debug
  const [stateDebugData, setStateDebugData] = useState<DebugData>({
    customers: [],
    rideProviders: [],
    rideRequests: [],
    smartContracts: [],
  });

  /** Fetch general debug data */
  const fetchDebugData = useCallback(
    (clear = false) => {
      if (clear === true) {
        setStateDebugData(prev => ({
          ...prev,
          customers: [],
          rideProviders: [],
          rideRequests: [],
          smartContracts: [],
        }));
        return;
      }

      Promise.all([
        fetchJsonSimulation<SimulationEndpointParticipantCoordinates>(
          simulationEndpoints.apiV1.participantCoordinates
        ),
        fetchJsonSimulation<SimulationEndpointRideRequests>(
          simulationEndpoints.apiV1.rideRequests
        ),
        fetchJsonSimulation<SimulationEndpointSmartContracts>(
          simulationEndpoints.apiV1.smartContracts
        ),
      ])
        .then(
          ([
            participantCoordinatesData,
            rideRequestsData,
            smartContractsData,
          ]) =>
            Promise.all([
              Promise.all(
                participantCoordinatesData.customers.map(a =>
                  fetchJsonSimulation<SimulationEndpointParticipantInformationCustomer>(
                    simulationEndpoints.apiV1.participantInformationCustomer(
                      a.id
                    )
                  )
                )
              ),
              Promise.all(
                participantCoordinatesData.rideProviders.map(a =>
                  fetchJsonSimulation<SimulationEndpointParticipantInformationRideProvider>(
                    simulationEndpoints.apiV1.participantInformationRideProvider(
                      a.id
                    )
                  )
                )
              ),
              Promise.all(
                rideRequestsData.rideRequests.map(a =>
                  fetchJsonSimulation<SimulationEndpointRideRequestInformation>(
                    simulationEndpoints.apiV1.rideRequestInformation(a)
                  )
                )
              ),
              Promise.all(
                smartContractsData.smartContracts.map(a =>
                  fetchJsonSimulation<SimulationEndpointSmartContractInformation>(
                    simulationEndpoints.apiV1.smartContract(a)
                  )
                )
              ),
            ])
        )
        .then(([customers, rideProviders, rideRequests, smartContracts]) => {
          setStateDebugData({
            customers,
            rideProviders,
            rideRequests,
            smartContracts,
          });
        })
        .catch(err => showError('Fetch debug data', err));
    },
    [fetchJsonSimulation, showError]
  );
  const clearDebugData = useCallback(
    () => fetchDebugData(true),
    [fetchDebugData]
  );

  const updateRenderCount = useCallback(() => {
    setStateRenderList(
      Array.from(debugComponentRenderCounter).sort((a, b) =>
        stringComparator(a[0], b[0])
      )
    );
  }, [setStateRenderList]);

  const updateUpdateCount = useCallback(() => {
    setStateUpdateList(
      Array.from(debugComponentUpdateCounter).sort((a, b) =>
        stringComparator(a[0], b[0])
      )
    );
  }, [setStateUpdateList]);

  const propsTabPanelTab: TabPanelTabProps = {
    stateSettingsGlobalDebug,
    stateSettingsUiGridSpacing,
  };

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
                key={`tab-${tabIndex}`}
                label={tabTitle.toUpperCase()}
                icon={tabIcon}
              />
            ))}
          </Tabs>
        </Box>
        <TabPanelTab {...propsTabPanelTab} value={stateTabIndex} index={0}>
          <TabMap {...props} />
        </TabPanelTab>
        <TabPanelTab {...propsTabPanelTab} value={stateTabIndex} index={1}>
          <TabBlockchain {...props} />
        </TabPanelTab>
        <TabPanelTab {...propsTabPanelTab} value={stateTabIndex} index={2}>
          <TabOverview {...props} />
        </TabPanelTab>
        <TabPanelTab {...propsTabPanelTab} value={stateTabIndex} index={3}>
          <TabSettings {...props} />
        </TabPanelTab>
      </Box>
      <TabPanelTabSectionDebug
        title="Debugging"
        stateSettingsGlobalDebug={stateSettingsGlobalDebug}
      >
        <ButtonGroup variant="contained">
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

      <TabPanelTabSectionDebug
        title="Debug #Render"
        stateSettingsGlobalDebug={stateSettingsGlobalDebug}
      >
        <ButtonGroup variant="contained">
          <GenericButton onClick={updateRenderCount}>
            Update render count
          </GenericButton>
        </ButtonGroup>
        <List>
          {stateRenderList.map(([name, count]) => (
            <ListItem key={`render-count-debug-item-${name}`}>
              <ListItemIcon>
                <Badge badgeContent={count} max={100000} color="primary">
                  <RefreshIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
          ))}
        </List>
      </TabPanelTabSectionDebug>

      <TabPanelTabSectionDebug
        title="Debug #Update"
        stateSettingsGlobalDebug={stateSettingsGlobalDebug}
      >
        <ButtonGroup variant="contained">
          <GenericButton onClick={updateUpdateCount}>
            Update update count
          </GenericButton>
        </ButtonGroup>
        <List>
          {stateUpdateList.map(([name, count]) => (
            <ListItem key={`update-count-debug-item-${name}`}>
              <ListItemIcon>
                <Badge badgeContent={count} max={100000} color="primary">
                  <RefreshIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
          ))}
        </List>
      </TabPanelTabSectionDebug>

      <TabPanelTabSectionDebug
        title="Control Simulation"
        stateSettingsGlobalDebug={stateSettingsGlobalDebug}
      >
        <ButtonGroup variant="contained">
          <GenericButton
            onClick={() =>
              fetchTextEndpoint(
                stateSettingsFetchBaseUrlSimulation,
                simulationEndpoints.simulation.state
              )
                .then(a => alert(`Simulation state: ${a}`))
                .catch(err => showError('Fetch simulation state', err))
            }
          >
            State
          </GenericButton>
          <GenericButton
            onClick={() =>
              fetchTextEndpoint(
                stateSettingsFetchBaseUrlSimulation,
                simulationEndpoints.simulation.pause
              ).catch(err => showError('Fetch simulation state pause', err))
            }
          >
            Pause
          </GenericButton>
          <GenericButton
            onClick={() =>
              fetchTextEndpoint(
                stateSettingsFetchBaseUrlSimulation,
                simulationEndpoints.simulation.run
              ).catch(err => showError('Fetch simulation state run', err))
            }
          >
            Run
          </GenericButton>
        </ButtonGroup>
      </TabPanelTabSectionDebug>

      <TabPanelTabSectionDebug
        title="Debug Data"
        stateSettingsGlobalDebug={stateSettingsGlobalDebug}
      >
        <ButtonGroup variant="contained">
          <GenericButton onClick={fetchDebugData}>
            Fetch Debug Data
          </GenericButton>
          <GenericButton onClick={clearDebugData}>
            Clear Debug Data
          </GenericButton>
        </ButtonGroup>
      </TabPanelTabSectionDebug>

      <TabPanelTabSectionDebug
        title="Debug Data > Customers"
        stateSettingsGlobalDebug={stateSettingsGlobalDebug}
        outlined={true}
      >
        <TableDebugData
          stateDebugData={stateDebugData}
          debugDataType="customer"
        />
      </TabPanelTabSectionDebug>

      <TabPanelTabSectionDebug
        title="Debug Data > Ride Providers"
        stateSettingsGlobalDebug={stateSettingsGlobalDebug}
        outlined={true}
      >
        <TableDebugData
          stateDebugData={stateDebugData}
          debugDataType="customer"
        />
      </TabPanelTabSectionDebug>

      <TabPanelTabSectionDebug
        title="Debug Data > Ride Requests"
        stateSettingsGlobalDebug={stateSettingsGlobalDebug}
        outlined={true}
      >
        <TableDebugData
          stateDebugData={stateDebugData}
          debugDataType="ride_request"
        />
      </TabPanelTabSectionDebug>

      <TabPanelTabSectionDebug
        title="Debug Data > Smart Contracts"
        stateSettingsGlobalDebug={stateSettingsGlobalDebug}
        outlined={true}
      >
        <TableDebugData
          stateDebugData={stateDebugData}
          debugDataType="smart_contract"
        />
      </TabPanelTabSectionDebug>
    </Box>
  );
}
