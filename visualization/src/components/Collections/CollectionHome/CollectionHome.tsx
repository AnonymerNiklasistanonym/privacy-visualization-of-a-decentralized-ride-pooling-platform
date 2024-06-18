'use client';

// Package imports
import {useCallback, useEffect, useMemo, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useIntl} from 'react-intl';
import {useMediaQuery} from '@mui/material';
// > Components
import {Language as LanguageIcon} from '@mui/icons-material';
// Local imports
import {i18n, i18nGetLanguageName} from '../../../../i18n-config';
import {UrlParameter} from '@misc/urlParameter';
import {fetchJson} from '@globals/lib/fetch';
// > Components
import {
  PageAboutIcon,
  PageHomeIcon,
  ServiceAuthenticationIcon,
  ServiceMatchingIcon,
  SpectatorEverythingIcon,
  SpectatorPublicIcon,
} from '@components/Icons';
import SnackbarContentChange from '@components/Snackbar/SnackbarContentChange';
import TabPanel from '@components/TabPanel';
import ThemeContainer from '@components/ThemeContainer';
// > Globals
import {baseUrlPathfinder, baseUrlSimulation} from '@globals/defaults/urls';
// > Misc
import {LocalStorageKey} from '@misc/localStorage';
// Type imports
import type {
  GlobalPropsFetch,
  GlobalPropsParticipantSelectedElements,
  GlobalPropsParticipantSelectedElementsSet,
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
    localStorage !== undefined
      ? localStorage.getItem(LocalStorageKey.THEME_MODE)
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
  const [
    stateSnackbarSelectedParticipantOpen,
    setStateSnackbarSelectedParticipantOpen,
  ] = useState(false);
  const [
    stateSnackbarSelectedRideRequestOpen,
    setStateSnackbarSelectedRideRequestOpen,
  ] = useState(false);
  // > Spectator
  const [stateSpectator, setStateSpectator] = useState(
    searchParams.get(UrlParameter.SPECTATOR) ?? 'everything'
  );
  // > Selected Elements
  const [stateSelectedSpectator, setStateSelectedSpectator] = useState<
    string | undefined
  >(searchParams.get(UrlParameter.SPECTATOR) ?? undefined);
  const [stateSelectedParticipant, setStateSelectedParticipant] = useState<
    string | undefined
  >(undefined);
  const [stateSelectedRideRequest, setStateSelectedRideRequest] = useState<
    string | undefined
  >(undefined);
  // > Selected Element Information
  const [
    stateSelectedParticipantTypeGlobal,
    setStateSelectedParticipantTypeGlobal,
  ] = useState<SimulationEndpointParticipantTypes | undefined>(undefined);
  const [
    stateSelectedParticipantCustomerInformationGlobal,
    setStateSelectedParticipantCustomerInformationGlobal,
  ] = useState<undefined | SimulationEndpointParticipantInformationCustomer>(
    undefined
  );
  const [
    stateSelectedParticipantRideProviderInformationGlobal,
    setStateSelectedParticipantRideProviderInformationGlobal,
  ] = useState<
    undefined | SimulationEndpointParticipantInformationRideProvider
  >(undefined);
  const [
    stateSelectedParticipantRideRequestInformationGlobal,
    setStateSelectedParticipantRideRequestInformationGlobal,
  ] = useState<undefined | SimulationEndpointRideRequestInformation>(undefined);

  const [stateSettingsUiNavBarPosition, setStateSettingsUiNavBarPosition] =
    useState<'bottom' | 'top'>('top');

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
    for (const [spectatorId, spectatorInformation] of newSpectators) {
      if (stateSpectators.has(spectatorId)) {
        continue;
      }
      Promise.resolve(spectatorInformation())
        .then(data =>
          setStateSpectators(
            prevState => new Map(prevState.set(spectatorId, data))
          )
        )
        .then(() => {
          console.debug('stateSpectators was updated', spectatorId);
        })
        .catch(err =>
          showError(`Error getting spectator information ${spectatorId}`, err)
        );
    }
    for (const [tabName, tabInformation] of newTabs) {
      if (stateTabs.has(tabName)) {
        continue;
      }
      Promise.resolve(tabInformation())
        .then(data =>
          setStateTabs(prevState => new Map(prevState.set(tabName, data)))
        )
        .catch(err =>
          showError(`Error getting tab information ${tabName}`, err)
        );
    }
  };

  // React: Listen for changes in created states
  // > Snackbar listeners
  useEffect(() => {
    setStateSnackbarSpectatorOpen(true);
  }, [stateSpectator, setStateSnackbarSpectatorOpen]);
  useEffect(() => {
    setStateSnackbarSelectedParticipantOpen(true);
  }, [stateSelectedParticipant, setStateSnackbarSelectedParticipantOpen]);
  useEffect(() => {
    setStateSnackbarSelectedRideRequestOpen(true);
  }, [stateSelectedRideRequest, setStateSnackbarSelectedRideRequestOpen]);
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
    GlobalPropsParticipantSelectedElements &
    GlobalPropsParticipantSelectedElementsSet = {
    ...propsError,
    fetchJsonSimulation,
    globalSearch,
    setStateSelectedParticipant,
    setStateSelectedParticipantCustomerInformationGlobal,
    setStateSelectedParticipantRideProviderInformationGlobal,
    setStateSelectedParticipantRideRequestInformationGlobal,
    setStateSelectedParticipantTypeGlobal,
    setStateSelectedRideRequest,
    setStateSelectedSpectator,
    setStateSettingsBlockchainUpdateRateInMs,
    setStateSettingsGlobalDebug,
    setStateSettingsMapBaseUrlPathfinder,
    setStateSettingsMapBaseUrlSimulation,
    setStateSettingsMapShowTooltips,
    setStateSettingsMapUpdateRateInMs,
    setStateSettingsUiNavBarPosition,
    setStateSpectator,
    setStateThemeMode,
    stateSelectedParticipant,
    stateSelectedParticipantCustomerInformationGlobal,
    stateSelectedParticipantRideProviderInformationGlobal,
    stateSelectedParticipantRideRequestInformationGlobal,
    stateSelectedParticipantTypeGlobal,
    stateSelectedRideRequest,
    stateSelectedSpectator,
    stateSettingsBlockchainUpdateRateInMs,
    stateSettingsGlobalDebug,
    stateSettingsMapBaseUrlPathfinder,
    stateSettingsMapBaseUrlSimulation,
    stateSettingsMapShowTooltips,
    stateSettingsMapUpdateRateInMs,
    stateSettingsUiNavBarPosition,
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
      {children}
    </ThemeContainer>
  );
}
