'use client';

// Package imports
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useIntl} from 'react-intl';
import {useMediaQuery} from '@mui/material';
// > Components
import {Language as LanguageIcon} from '@mui/icons-material';
import {Link} from '@mui/material';
// Local imports
import {i18n, i18nGetLanguageName} from '../../../../i18n-config';
import {UrlParameter} from '@misc/urlParameter';
import {fetchJson} from '@globals/lib/fetch';
// > Components
import {
  ChipListElement,
  ChipListElementProps,
} from '@components/Tab/TabOverview/TabOverviewElements';
import {
  PageAboutIcon,
  PageHomeIcon,
  ParticipantCustomerIcon,
  ParticipantRideProviderIcon,
  ServiceAuthenticationIcon,
  ServiceMatchingIcon,
  SpectatorEverythingIcon,
  SpectatorPublicIcon,
} from '@components/Icons';
import ModalData from '@components/Modal/ModalData';
import SnackbarContentChange from '@components/Snackbar/SnackbarContentChange';
import TabPanel from '@components/TabPanel';
import WrapperThemeProvider from '@components/Wrapper/WrapperThemeProvider';
// > Globals
import {
  baseUrlPathfinder,
  baseUrlSimulation,
  confidenceVisualizer,
  getacar,
} from '@globals/defaults/urls';
// > Misc
import {LocalStorageKey} from '@misc/localStorage';
import {SearchBarId} from '@misc/searchBarIds';
import {SpectatorId} from '@misc/spectatorIds';
import {TabIndex} from '@misc/tabIndices';
// Type imports
import type {
  GlobalPropsShowError,
  GlobalPropsSpectatorInfo,
  GlobalSearchElement,
} from '@misc/props/global';
import type {
  ModalDataInformation,
  ModalDataProps,
} from '@components/Modal/ModalData';
import type {PropsWithChildren, ReactElement} from 'react';
import type {FetchOptions} from '@globals/lib/fetch';
import type {ModalErrorProps} from '@components/Modal/ModalError';
import type {TabPanelProps} from '@components/TabPanel';

export interface CollectionHomeProps
  extends GlobalPropsShowError,
    ModalErrorProps {}

/** Home page collection (top level component) */
export default function CollectionHome(
  propsCollectionHome: PropsWithChildren<CollectionHomeProps>
) {
  const {children, showError} = propsCollectionHome;

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

  // i18n: Translate
  const intl = useIntl();

  // MUI: Theming
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [stateThemeMode, setStateThemeMode] = useState<'light' | 'dark'>(
    prefersDarkMode ? 'dark' : 'light'
  );
  const [stateThemeModeInitialized, setStateThemeModeInitialized] =
    useState<boolean>(false);

  // React: States
  // > Settings
  // >> Map
  const [stateSettingsMapShowTooltips, setStateSettingsMapShowTooltips] =
    useState(false);
  const [
    stateSettingsFetchBaseUrlSimulation,
    setStateSettingsFetchBaseUrlSimulation,
  ] = useState(baseUrlSimulation);
  const [stateSettingsMapUpdateRateInMs, setStateSettingsMapUpdateRateInMs] =
    useState(1000 / 5);
  const [
    stateSettingsMapBaseUrlPathfinder,
    setStateSettingsMapBaseUrlPathfinder,
  ] = useState(baseUrlPathfinder);
  // >> Cards
  const [stateSettingsCardUpdateRateInMs, setStateSettingsCardUpdateRateInMs] =
    useState(1000 / 5);
  // >> Blockchain
  const [
    stateSettingsBlockchainUpdateRateInMs,
    setStateSettingsBlockchainUpdateRateInMs,
  ] = useState(1000 / 5);
  // >> Debug
  const [stateSettingsGlobalDebug, setStateSettingsGlobalDebug] = useState(
    params.get(UrlParameter.DEBUG) === 'true'
  );
  // >> UI
  const [stateSettingsUiGridSpacing, setStateSettingsUiGridSpacing] =
    useState<number>(2);
  // > Snackbars
  const [stateSnackbarSpectatorOpen, setStateSnackbarSpectatorOpen] =
    useState(false);
  const [
    stateSnackbarSelectedParticipantOpen,
    setStateSnackbarSelectedParticipantOpen,
  ] = useState(false);
  const [
    stateSnackbarSelectedSmartContractOpen,
    setStateSnackbarSelectedSmartContractOpen,
  ] = useState(false);
  // > Modals
  const [stateOpenModalData, setStateOpenModalData] = useState(false);
  const [stateDataModalInformation, setStateDataModalInformation] = useState<
    undefined | ModalDataInformation
  >(undefined);
  // > Spectator
  const [stateSpectatorId, setStateSpectatorId] = useState(
    searchParams.get(UrlParameter.SPECTATOR) ?? SpectatorId.EVERYTHING
  );
  const [stateShowParticipantId, setStateShowParticipantId] = useState<
    undefined | string
  >(stateSpectatorId);
  // > Selected participant
  const [stateSelectedParticipantId, setStateSelectedParticipantId] = useState<
    undefined | string
  >(searchParams.get(UrlParameter.SELECTED_PARTICIPANT) ?? undefined);
  // > Selected smart contract
  const [stateSelectedSmartContractId, setStateSelectedSmartContractId] =
    useState<undefined | string>(
      searchParams.get(UrlParameter.SELECTED_SMART_CONTRACT_ID) ?? undefined
    );
  // > Tabpanel
  const [stateTabIndex, setStateTabIndex] = useState(
    searchParams.get(UrlParameter.TAB_INDEX)
      ? Number(searchParams.get(UrlParameter.TAB_INDEX))
      : TabIndex.MAP
  );
  // > Fetching
  const [
    stateSettingsFetchCacheUpdateRateInMs,
    setStateSettingsFetchCacheUpdateRateInMs,
  ] = useState(1000 / 20);

  /** Caches requests with a time so multiple requests won't be made in the same time frame */
  const requestCache = useRef(
    new Map<string, {time: Date; data: Promise<unknown>}>()
  );

  // Props: Functions (depend on created states)
  const fetchJsonSimulation = useCallback(
    async <T,>(
      endpoint: string,
      options?: Readonly<FetchOptions>
    ): Promise<T> => {
      const cacheEntry = requestCache.current.get(endpoint);
      const currentTime = new Date();
      // In case the current time and cache time are sufficiently close ignore request and return cached data instead
      if (
        cacheEntry !== undefined &&
        currentTime.getTime() - cacheEntry.time.getTime() <
          stateSettingsFetchCacheUpdateRateInMs
      ) {
        console.warn(
          `Stopped request '${endpoint}' since it was cached recently`
        );
        return cacheEntry.data as T;
      }
      const data = fetchJson<T>(
        `${stateSettingsFetchBaseUrlSimulation}${endpoint}`,
        options
      );
      // If a request is made update the cache
      requestCache.current.set(endpoint, {data, time: currentTime});
      // TODO Cache only gets bigger, nothing is purged - clean routine
      return data;
    },
    [stateSettingsFetchBaseUrlSimulation, stateSettingsFetchCacheUpdateRateInMs]
  );

  // > Spectator List
  const [stateSpectators, setStateSpectators] = useState<
    Map<string, GlobalPropsSpectatorInfo>
  >(
    new Map(
      [
        {
          category: intl.formatMessage({id: 'other'}),
          icon: <SpectatorPublicIcon />,
          id: SpectatorId.PUBLIC,
          name: intl.formatMessage({id: 'getacar.spectator.public'}),
        },
        {
          category: intl.formatMessage({id: 'other'}),
          icon: <SpectatorEverythingIcon />,
          id: SpectatorId.EVERYTHING,
          name: intl.formatMessage({id: 'getacar.spectator.everything'}),
        },
        {
          category: intl.formatMessage({id: 'getacar.service'}),
          icon: <ServiceAuthenticationIcon />,
          id: SpectatorId.AUTHENTICATION_SERVICE,
          name: intl.formatMessage({
            id: 'getacar.spectator.service.authentication',
          }),
        },
        {
          category: intl.formatMessage({id: 'getacar.service'}),
          icon: <ServiceMatchingIcon />,
          id: SpectatorId.MATCHING_SERVICE,
          name: intl.formatMessage({id: 'getacar.spectator.service.matching'}),
        },
      ].map(a => [
        a.id,
        {
          callback: () => {
            setStateSpectatorId(a.id);
          },
          category: a.category,
          icon: a.icon,
          keywords: [],
          name: a.name,
        },
      ])
    )
  );
  const [stateTabs, setStateTabs] = useState<
    Map<string, GlobalPropsSpectatorInfo>
  >(new Map());
  const updateGlobalSearch = useCallback(
    (
      newSpectators: Array<
        [
          string,
          () => Promise<GlobalPropsSpectatorInfo> | GlobalPropsSpectatorInfo,
        ]
      >,
      newTabs: Array<
        [
          string,
          () => Promise<GlobalPropsSpectatorInfo> | GlobalPropsSpectatorInfo,
        ]
      >
    ) => {
      const newSpectatorsInformation = newSpectators
        .filter(([spectatorId]) => !stateSpectators.has(spectatorId))
        .map<
          Promise<[string, GlobalPropsSpectatorInfo]>
        >(([spectatorId, spectatorInformation]) => Promise.resolve<GlobalPropsSpectatorInfo>(spectatorInformation()).then(spectatorInformationResolved => [spectatorId, spectatorInformationResolved]));
      Promise.all(newSpectatorsInformation)
        .then(data => {
          if (data.length > 0) {
            setStateSpectators(prevState => {
              for (const [spectatorId, spectatorInformationResolved] of data) {
                prevState.set(spectatorId, spectatorInformationResolved);
              }
              return new Map(prevState);
            });
          }
        })
        .catch(err => showError('Error getting spectator information', err));
      const newTabsInformation = newTabs
        .filter(([tabName]) => !stateTabs.has(tabName))
        .map<
          Promise<[string, GlobalPropsSpectatorInfo]>
        >(([tabName, tabInformation]) => Promise.resolve<GlobalPropsSpectatorInfo>(tabInformation()).then(tabInformationResolved => [tabName, tabInformationResolved]));
      Promise.all(newTabsInformation)
        .then(data => {
          if (data.length > 0) {
            setStateTabs(prevState => {
              for (const [tabName, tabInformation] of data) {
                prevState.set(tabName, tabInformation);
              }
              return new Map(prevState);
            });
          }
        })
        .catch(err => showError('Error getting tab information', err));
    },
    [showError, stateSpectators, stateTabs]
  );

  // React: Run once on the first render (twice in debug mode)
  // > Local storage data fetching
  useEffect(() => {
    // Theme Mode
    const localStorageThemeMode =
      localStorage !== undefined
        ? localStorage.getItem(LocalStorageKey.THEME_MODE)
        : null;
    console.info(
      'Initialization localStorage themeMode:',
      localStorageThemeMode
    );
    if (localStorageThemeMode === 'dark' || localStorageThemeMode === 'light') {
      setStateThemeMode(localStorageThemeMode);
    }
    setStateThemeModeInitialized(true);
  }, []);

  // React: Run every time a state changes
  // > Snackbar listeners
  useEffect(() => {
    setStateSnackbarSpectatorOpen(true);
  }, [stateSpectatorId, setStateSnackbarSpectatorOpen]);
  useEffect(() => {
    if (stateSelectedParticipantId) {
      setStateSnackbarSelectedParticipantOpen(true);
    }
  }, [stateSelectedParticipantId, setStateSnackbarSelectedParticipantOpen]);
  useEffect(() => {
    if (stateSelectedSmartContractId) {
      setStateSnackbarSelectedSmartContractOpen(true);
    }
  }, [stateSelectedSmartContractId, setStateSnackbarSelectedSmartContractOpen]);
  // > URL parameter listeners
  useEffect(() => {
    if (stateSettingsGlobalDebug) {
      params.set(UrlParameter.DEBUG, `${stateSettingsGlobalDebug}`);
    } else {
      params.delete(UrlParameter.DEBUG);
    }
    if (stateSpectatorId !== SpectatorId.EVERYTHING) {
      params.set(UrlParameter.SPECTATOR, stateSpectatorId);
    } else {
      params.delete(UrlParameter.SPECTATOR);
    }
    if (stateSelectedParticipantId !== undefined) {
      params.set(UrlParameter.SELECTED_PARTICIPANT, stateSelectedParticipantId);
    } else {
      params.delete(UrlParameter.SELECTED_PARTICIPANT);
    }
    if (stateSelectedSmartContractId !== undefined) {
      params.set(
        UrlParameter.SELECTED_SMART_CONTRACT_ID,
        stateSelectedSmartContractId
      );
    } else {
      params.delete(UrlParameter.SELECTED_SMART_CONTRACT_ID);
    }
    if (stateTabIndex !== 0) {
      params.set(UrlParameter.TAB_INDEX, `${stateTabIndex}`);
    } else {
      params.delete(UrlParameter.TAB_INDEX);
    }

    updateRouter();
  }, [
    stateSettingsGlobalDebug,
    stateSpectatorId,
    updateRouter,
    pathname,
    params,
    stateSelectedParticipantId,
    stateSelectedSmartContractId,
    stateTabIndex,
  ]);

  useEffect(() => {
    if (!stateThemeModeInitialized) {
      return;
    }
    localStorage.setItem(LocalStorageKey.THEME_MODE, stateThemeMode);
  }, [stateThemeMode, stateThemeModeInitialized]);

  // Global search bar
  const globalSearch = useMemo(() => {
    const tempGlobalSearch: Array<GlobalSearchElement> = [];
    const pages: Array<[string, string, ReactElement]> = [
      [
        intl.formatMessage({id: 'page.home.title'}),
        '/',
        <PageHomeIcon key="home" />,
      ],
      [
        intl.formatMessage({id: 'page.about.title'}),
        '/about',
        <PageAboutIcon key="info" />,
      ],
    ];
    for (const [pageTitle, pagePath, pageIcon] of pages) {
      tempGlobalSearch.push({
        icon: pageIcon,
        keywords: ['page', 'switch', pageTitle, pagePath],
        name: intl.formatMessage(
          {id: 'page.home.search.switchPage'},
          {
            name: pageTitle,
          }
        ),
        onClick: () => {
          console.log('TODO Switch to page', pagePath);
          router.push(pagePath);
        },
      });
    }

    const {locales, defaultLocale} = i18n;
    for (const locale of locales) {
      tempGlobalSearch.push({
        icon: <LanguageIcon />,
        keywords: ['language', 'switch', locale, i18nGetLanguageName(locale)],
        name: intl.formatMessage(
          {id: 'page.home.search.changeLanguage'},
          {
            name: i18nGetLanguageName(locale),
          }
        ),
        onClick: () => {
          const pathname2 = pathname.split('/').filter(a => a.length > 0);
          if (
            pathname2.length > 0 &&
            locales.some(a => pathname2[0].includes(a))
          ) {
            pathname2.shift();
          }
          router.push(
            `${locale === defaultLocale ? '/' : `/${locale}/`}${pathname2.join(
              '/'
            )}?${params.toString()}`
          );
        },
      });
    }
    for (const [tabName, tabInformation] of Array.from(stateTabs.entries())) {
      tempGlobalSearch.push({
        icon: tabInformation.icon,
        keywords: ['tab', 'switch', tabName, tabInformation.name],
        name: intl.formatMessage(
          {
            id: 'page.home.search.switchTab',
          },
          {
            name: tabInformation.name,
          }
        ),
        onClick: () => {
          setStateSpectatorId(tabName);
          tabInformation.callback();
        },
      });
    }
    for (const [actorId, actorInformation] of Array.from(
      stateSpectators.entries()
    )) {
      tempGlobalSearch.push({
        icon: actorInformation.icon,
        keywords: [
          actorId,
          actorInformation.name,
          ...(actorInformation.keywords ?? []),
        ],
        name: intl.formatMessage(
          {
            id: 'page.home.search.spectateAs',
          },
          {
            name: `${actorInformation.name} (${actorId})`,
          }
        ),
        onClick: () => {
          setStateSpectatorId(actorId);
          actorInformation.callback();
        },
      });
      const categoryCustomer = intl.formatMessage({
        id: 'getacar.participant.customer',
      });
      const categoryRideProvider = intl.formatMessage({
        id: 'getacar.participant.rideProvider',
      });
      if (
        actorInformation.category === categoryCustomer ||
        actorInformation.category === categoryRideProvider
      ) {
        tempGlobalSearch.push({
          icon: actorInformation.icon,
          keywords: [
            actorId,
            actorInformation.name,
            SearchBarId.SHOW_PARTICIPANT,
            ...(actorInformation.keywords ?? []),
          ],
          name: intl.formatMessage(
            {
              id: 'getacar.spectator.show',
            },
            {
              name: `${actorInformation.name} (${actorId})`,
            }
          ),
          onClick: () => {
            setStateShowParticipantId(actorId);
            actorInformation.callback();
          },
        });
        tempGlobalSearch.push({
          icon: actorInformation.icon,
          keywords: [
            actorId,
            actorInformation.name,
            SearchBarId.FILTER_SMART_CONTRACT_PARTICIPANT,
            ...(actorInformation.keywords ?? []),
          ],
          name: intl.formatMessage(
            {
              id: 'getacar.spectator.filter',
            },
            {
              name: `${actorInformation.name} (${actorId})`,
            }
          ),
          onClick: () => {
            setStateSelectedParticipantId(actorId);
            actorInformation.callback();
          },
        });
      }
    }
    return tempGlobalSearch.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }, [stateSpectators, stateTabs, params, pathname, router, intl]);

  // TODO intl values
  const customerChip: ChipListElementProps = {
    description: 'requests rides (human)',
    icon: <ParticipantCustomerIcon />,
    label: intl.formatMessage({id: 'getacar.participant.customer'}),
    link: '#anchor-customer',
  };
  const customersChip: ChipListElementProps = {
    ...customerChip,
    label: intl.formatMessage({id: 'getacar.participant.customer.plural'}),
  };
  const rideProviderChip: ChipListElementProps = {
    description: 'provides rides (human/autonomous vehicle)',
    icon: <ParticipantRideProviderIcon />,
    label: intl.formatMessage({id: 'getacar.participant.rideProvider'}),
    link: '#anchor-ride-provider',
  };
  const rideProvidersChip: ChipListElementProps = {
    ...customerChip,
    label: intl.formatMessage({id: 'getacar.participant.rideProvider.plural'}),
  };
  const authServiceChip: ChipListElementProps = {
    icon: <ServiceAuthenticationIcon />,
    label: intl.formatMessage({id: 'getacar.service.auth'}),
    link: '#anchor-as',
  };
  const matchServiceChip: ChipListElementProps = {
    icon: <ServiceMatchingIcon />,
    label: intl.formatMessage({id: 'getacar.service.match'}),
    link: '#anchor-ms',
  };

  const intlValues: {[key: string]: ReactElement} = {
    AUTH_SERVICE: <ChipListElement {...authServiceChip} noDescription={true} />,
    CONFIDENTIALITY_VISUALIZER: (
      <Link href={confidenceVisualizer}>
        {intl.formatMessage({id: 'confidentialityVisualizer.name'})}
      </Link>
    ),
    CUSTOMER: <ChipListElement {...customerChip} noDescription={true} />,
    CUSTOMERS: <ChipListElement {...customersChip} noDescription={true} />,
    GETACAR: (
      <Link href={getacar}>{intl.formatMessage({id: 'getacar.name'})}</Link>
    ),
    MATCHING_SERVICE: (
      <ChipListElement {...matchServiceChip} noDescription={true} />
    ),
    RIDE_PROVIDER: (
      <ChipListElement {...rideProviderChip} noDescription={true} />
    ),
    RIDE_PROVIDERS: (
      <ChipListElement {...rideProvidersChip} noDescription={true} />
    ),
  };

  // Group all props for easy forwarding
  const props: TabPanelProps & ModalDataProps = {
    ...propsCollectionHome,
    fetchJsonSimulation,
    globalSearch,
    intlValues,
    setStateDataModalInformation,
    setStateOpenModalData,
    setStateSelectedParticipantId,
    setStateSelectedSmartContractId,
    setStateSettingsBlockchainUpdateRateInMs,
    setStateSettingsCardUpdateRateInMs,
    setStateSettingsFetchBaseUrlSimulation,
    setStateSettingsFetchCacheUpdateRateInMs,
    setStateSettingsGlobalDebug,
    setStateSettingsMapBaseUrlPathfinder,
    setStateSettingsMapShowTooltips,
    setStateSettingsMapUpdateRateInMs,
    setStateSettingsUiGridSpacing,
    setStateShowParticipantId,
    setStateSpectatorId,
    setStateTabIndex,
    setStateThemeMode,
    stateSelectedParticipantId,
    stateSelectedSmartContractId,
    stateSettingsBlockchainUpdateRateInMs,
    stateSettingsCardUpdateRateInMs,
    stateSettingsFetchBaseUrlSimulation,
    stateSettingsFetchCacheUpdateRateInMs,
    stateSettingsGlobalDebug,
    stateSettingsMapBaseUrlPathfinder,
    stateSettingsMapShowTooltips,
    stateSettingsMapUpdateRateInMs,
    stateSettingsUiGridSpacing,
    stateShowParticipantId,
    stateSpectatorId,
    stateSpectators,
    stateTabIndex,
    stateThemeMode,
    updateGlobalSearch,
  };

  // TODO Initial fetching of participants for a search index
  // TODO Also update spectators
  // TODO Map/Blockchain page: Disable inputs while they are not initialized and show a linear or circular progress
  // TODO Map/blockchain page: Show a circular progress whioe they are not initialized and for the table linear progress every time elements are fetched
  // TODO Input search bar show as a chip the currently selected/filtered element if you can still search for a new one at the same time
  // TODO Blockchain page: Fix filter search and change spectator to be the same as on the map page
  // TODO Move info elements to map and blockchain page to guide page as additional card
  // TODO Add content parts of the guide page

  return (
    <WrapperThemeProvider
      stateSettingsGlobalDebug={stateSettingsGlobalDebug}
      stateThemeMode={stateThemeMode}
    >
      <main className={[`mui-theme-${stateThemeMode}`].join(' ')}>
        <TabPanel {...props} />
      </main>
      <ModalData
        {...props}
        stateDataModalOpen={stateOpenModalData}
        setStateDataModalOpen={setStateOpenModalData}
        stateDataModalInformation={stateDataModalInformation}
      />
      <SnackbarContentChange
        stateOpen={stateSnackbarSpectatorOpen}
        stateContent={stateSpectatorId}
        setStateOpen={setStateSnackbarSpectatorOpen}
        handleChangeStateContent={a =>
          intl.formatMessage({id: 'getacar.spectator.changed'}, {name: a})
        }
        bottomOffset={60 * 0}
      />
      <SnackbarContentChange
        stateOpen={stateSnackbarSelectedParticipantOpen}
        stateContent={stateSelectedParticipantId}
        setStateOpen={setStateSnackbarSelectedParticipantOpen}
        handleChangeStateContent={a =>
          intl.formatMessage(
            {id: 'getacar.participant.selectedChanged'},
            {name: a}
          )
        }
        bottomOffset={60 * 1}
      />
      <SnackbarContentChange
        stateOpen={stateSnackbarSelectedSmartContractOpen}
        stateContent={stateSelectedSmartContractId}
        setStateOpen={setStateSnackbarSelectedSmartContractOpen}
        handleChangeStateContent={a =>
          intl.formatMessage(
            {id: 'getacar.blockchain.smartContract.selectedChanged'},
            {name: a}
          )
        }
        bottomOffset={60 * 2}
      />
      {children}
    </WrapperThemeProvider>
  );
}
