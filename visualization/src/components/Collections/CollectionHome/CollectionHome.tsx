'use client';

// Package imports
import {useCallback, useEffect, useMemo, useState} from 'react';
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
import SnackbarContentChange from '@components/Snackbar/SnackbarContentChange';
import TabPanel from '@components/TabPanel';
import ThemeContainer from '@components/ThemeContainer';
// > Globals
import {
  baseUrlPathfinder,
  baseUrlSimulation,
  confidenceVisualizer,
  getacar,
} from '@globals/defaults/urls';
// > Misc
import {LocalStorageKey} from '@misc/localStorage';
// Type imports
import type {
  GlobalPropsFetch,
  GlobalPropsIntlValues,
  GlobalPropsSearch,
  GlobalPropsShowError,
  GlobalPropsSpectatorElement,
  GlobalPropsSpectatorMap,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
  GlobalPropsSpectatorsSet,
  GlobalPropsTheming,
  GlobalSearchElement,
} from '@misc/props/global';
import type {PropsWithChildren, ReactElement} from 'react';
import type {
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantTypes,
  SimulationEndpointRideRequestInformation,
} from '@globals/types/simulation';
import type {ErrorModalProps} from '@components/Modal/ErrorModal';
import type {FetchOptions} from '@globals/lib/fetch';
import type {SettingsProps} from '@misc/props/settings';

/** The Home page collection */
export default function CollectionHome(
  propsError: PropsWithChildren<GlobalPropsShowError & ErrorModalProps>
) {
  const {children, showError} = propsError;

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
  const localStorageThemeMode =
    typeof window !== 'undefined' && window.localStorage !== undefined
      ? window.localStorage.getItem(LocalStorageKey.THEME_MODE)
      : null;
  const [stateThemeMode, setStateThemeMode] = useState<'light' | 'dark'>(
    localStorageThemeMode === 'dark' || localStorageThemeMode === 'light'
      ? localStorageThemeMode
      : prefersDarkMode
        ? 'dark'
        : 'light'
  );

  // React: States
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
  const [stateSettingsMapUpdateRateInMs, setStateSettingsMapUpdateRateInMs] =
    useState(1000 / 5);
  const [stateSettingsCardUpdateRateInMs, setStateSettingsCardUpdateRateInMs] =
    useState(1000 / 5);
  const [
    stateSettingsBlockchainUpdateRateInMs,
    setStateSettingsBlockchainUpdateRateInMs,
  ] = useState(1000 / 5);
  const [stateSettingsGlobalDebug, setStateSettingsGlobalDebug] = useState(
    params.get(UrlParameter.DEBUG) === 'true'
  );
  // > Snackbars
  const [stateSnackbarSpectatorOpen, setStateSnackbarSpectatorOpen] =
    useState(false);
  // > Spectator
  const [stateSpectator, setStateSpectator] = useState(
    searchParams.get(UrlParameter.SPECTATOR) ?? 'everything'
  );
  const [stateShowSpectator, setStateShowSpectator] = useState<
    undefined | string
  >(stateSpectator);
  // > Settings
  const [stateSettingsUiNavBarPosition, setStateSettingsUiNavBarPosition] =
    useState<'bottom' | 'top'>('top');
  const [stateSettingsUiGridSpacing, setStateSettingsUiGridSpacing] =
    useState<number>(2);
  const [stateSettingsUiMapScroll, setStateSettingsUiMapScroll] =
    useState<boolean>(false);

  // Props: Functions (depend on created states)
  const fetchJsonSimulation = async <T,>(
    endpoint: string,
    options?: Readonly<FetchOptions>
  ): Promise<T> =>
    fetchJson<T>(`${stateSettingsMapBaseUrlSimulation}${endpoint}`, options);

  // > Spectator List
  const [stateSpectators, setStateSpectators] = useState<
    Map<string, GlobalPropsSpectatorElement>
  >(
    new Map(
      [
        {
          icon: <SpectatorPublicIcon />,
          id: 'public',
          nameId: 'getacar.spectator.public',
        },
        {
          icon: <SpectatorEverythingIcon />,
          id: 'everything',
          nameId: 'getacar.spectator.everything',
        },
        {
          icon: <ServiceAuthenticationIcon />,
          id: 'auth',
          nameId: 'getacar.spectator.service.authentication',
        },
        {
          icon: <ServiceMatchingIcon />,
          id: 'match',
          nameId: 'getacar.spectator.service.matching',
        },
      ].map(a => [
        a.id,
        {
          callback: () => {
            setStateSpectator(a.id);
          },
          icon: a.icon,
          name: intl.formatMessage({id: a.nameId}),
        } as GlobalPropsSpectatorElement,
      ])
    )
  );
  const [stateTabs, setStateTabs] = useState<
    Map<string, GlobalPropsSpectatorElement>
  >(new Map());
  const updateGlobalSearch = (
    newSpectators: Array<
      [
        string,
        () =>
          | Promise<GlobalPropsSpectatorElement>
          | GlobalPropsSpectatorElement,
      ]
    >,
    newTabs: Array<
      [
        string,
        () =>
          | Promise<GlobalPropsSpectatorElement>
          | GlobalPropsSpectatorElement,
      ]
    >
  ) => {
    const newSpectatorsInformation = newSpectators
      .filter(([spectatorId]) => !stateSpectators.has(spectatorId))
      .map<Promise<[string, GlobalPropsSpectatorElement]>>(
        ([spectatorId, spectatorInformation]) =>
          Promise.resolve<GlobalPropsSpectatorElement>(
            spectatorInformation()
          ).then(spectatorInformationResolved => [
            spectatorId,
            spectatorInformationResolved,
          ])
      );
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
      .map<Promise<[string, GlobalPropsSpectatorElement]>>(
        ([tabName, tabInformation]) =>
          Promise.resolve<GlobalPropsSpectatorElement>(tabInformation()).then(
            tabInformationResolved => [tabName, tabInformationResolved]
          )
      );
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
  };

  // React: Listen for changes in created states
  // > Snackbar listeners
  useEffect(() => {
    setStateSnackbarSpectatorOpen(true);
  }, [stateSpectator, setStateSnackbarSpectatorOpen]);
  // > URL parameter listeners
  useEffect(() => {
    if (stateSettingsGlobalDebug) {
      params.set(UrlParameter.DEBUG, `${stateSettingsGlobalDebug}`);
    } else {
      params.delete(UrlParameter.DEBUG);
    }
    updateRouter();
  }, [stateSettingsGlobalDebug, updateRouter, pathname, params]);
  useEffect(() => {
    params.set(UrlParameter.SPECTATOR, stateSpectator);
    updateRouter();
  }, [stateSpectator, updateRouter, pathname, params]);

  useEffect(() => {
    localStorage.setItem(LocalStorageKey.THEME_MODE, stateThemeMode);
  }, [stateThemeMode]);

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
          setStateSpectator(tabName);
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
          setStateSpectator(actorId);
          actorInformation.callback();
        },
      });
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
    label: intl.formatMessage({id: 'getacar.participant.customers'}),
  };
  const rideProviderChip: ChipListElementProps = {
    description: 'provides rides (human/autonomous vehicle)',
    icon: <ParticipantRideProviderIcon />,
    label: intl.formatMessage({id: 'getacar.participant.rideProvider'}),
    link: '#anchor-ride-provider',
  };
  const rideProvidersChip: ChipListElementProps = {
    ...customerChip,
    label: intl.formatMessage({id: 'getacar.participant.rideProviders'}),
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
  const props: GlobalPropsShowError &
    GlobalPropsFetch &
    GlobalPropsSpectatorSelectedElements &
    GlobalPropsSpectatorSelectedElementsSet &
    SettingsProps &
    ErrorModalProps &
    GlobalPropsTheming &
    GlobalPropsSpectatorsSet &
    GlobalPropsSearch &
    GlobalPropsSpectatorMap &
    GlobalPropsIntlValues = {
    ...propsError,
    fetchJsonSimulation,
    globalSearch,
    intlValues,
    setStateSettingsBlockchainUpdateRateInMs,
    setStateSettingsCardUpdateRateInMs,
    setStateSettingsGlobalDebug,
    setStateSettingsMapBaseUrlPathfinder,
    setStateSettingsMapBaseUrlSimulation,
    setStateSettingsMapShowTooltips,
    setStateSettingsMapUpdateRateInMs,
    setStateSettingsUiGridSpacing,
    setStateSettingsUiMapScroll,
    setStateSettingsUiNavBarPosition,
    setStateShowSpectator,
    setStateSpectator,
    setStateThemeMode,
    stateSettingsBlockchainUpdateRateInMs,
    stateSettingsCardUpdateRateInMs,
    stateSettingsGlobalDebug,
    stateSettingsMapBaseUrlPathfinder,
    stateSettingsMapBaseUrlSimulation,
    stateSettingsMapShowTooltips,
    stateSettingsMapUpdateRateInMs,
    stateSettingsUiGridSpacing,
    stateSettingsUiMapScroll,
    stateSettingsUiNavBarPosition,
    stateShowSpectator,
    stateSpectator,
    stateSpectators,
    stateThemeMode,
    updateGlobalSearch,
  };

  return (
    <ThemeContainer {...props}>
      {/*<SearchAppBar {...props} />*/}
      <main className={[`mui-theme-${stateThemeMode}`].join(' ')}>
        <TabPanel {...props} />
      </main>
      <SnackbarContentChange
        stateOpen={stateSnackbarSpectatorOpen}
        stateContent={stateSpectator}
        setStateOpen={setStateSnackbarSpectatorOpen}
        handleChangeStateContent={a =>
          intl.formatMessage({id: 'getacar.spectator.changed'}, {name: a})
        }
      />
      {children}
    </ThemeContainer>
  );
}
