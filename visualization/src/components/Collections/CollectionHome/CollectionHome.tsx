'use client';

// Package imports
import {ReactElement, useCallback, useEffect, useMemo, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useIntl} from 'react-intl';
import {useMediaQuery} from '@mui/material';
// > Components
import {Language as LanguageIcon} from '@mui/icons-material';
// Local imports
import {i18n, i18nGetLanguageName} from '../../../../i18n-config';
import {UrlParameters} from '@misc/urlParameter';
import {fetchJson} from '@globals/lib/fetch';
import {showErrorBuilder} from '@components/Modal/ErrorModal';
// > Components
import {PageAboutIcon, PageHomeIcon} from '@components/Icons';
import ErrorModal from '@components/Modal/ErrorModal';
import SearchAppBar from '@components/SearchAppBar';
import SnackbarContentChange from '@components/Snackbar/SnackbarContentChange';
import TabPanel from '@components/TabPanel';
// > Globals
import {baseUrlPathfinder, baseUrlSimulation} from '@globals/defaults/urls';
// Type imports
import type {
  ErrorModalContentElement,
  ErrorModalProps,
} from '@components/Modal/ErrorModal';
import type {
  GlobalPropsFetch,
  GlobalPropsParticipantSelectedElements,
  GlobalPropsParticipantSelectedElementsSet,
  GlobalPropsSearch,
  GlobalPropsShowError,
  GlobalPropsSpectatorElement,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
  GlobalPropsSpectatorsSet,
  GlobalPropsTheming,
  GlobalSearchElement,
} from '@misc/props/global';
import type {
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantTypes,
  SimulationEndpointRideRequestInformation,
} from '@globals/types/simulation';
import type {FetchOptions} from '@globals/lib/fetch';
import type {SettingsProps} from '@misc/props/settings';
import ThemeContainer from '@components/ThemeContainer';

/** The Home page collection */
export default function CollectionHome() {
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

  // React: States
  // > Error Modal
  const [stateErrorModalOpen, setStateErrorModalOpen] = useState(false);
  const [stateErrorModalContent, setStateErrorModalContent] = useState<
    ErrorModalContentElement[]
  >([]);
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
    params.get(UrlParameters.DEBUG) === 'true'
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
    searchParams.get(UrlParameters.SPECTATOR) ?? 'everything'
  );
  // > Selected Elements
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

  // Props: Functions (depend on created states)
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

  // > Spectator List
  const [stateSpectators, setStateSpectators] = useState<
    Map<string, GlobalPropsSpectatorElement>
  >(new Map());
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
      params.set(UrlParameters.DEBUG, `${stateSettingsGlobalDebug}`);
    } else {
      params.delete(UrlParameters.DEBUG);
    }
    updateRouter();
  }, [stateSettingsGlobalDebug, updateRouter, pathname, params]);
  useEffect(() => {
    params.set(UrlParameters.SPECTATOR, stateSpectator);
    updateRouter();
  }, [stateSpectator, updateRouter, pathname, params]);

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
        keywords: ['language', 'switch', actorId, actorInformation.name],
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
    GlobalPropsParticipantSelectedElements &
    GlobalPropsParticipantSelectedElementsSet = {
    fetchJsonSimulation,
    globalSearch,
    setStateErrorModalContent,
    setStateErrorModalOpen,
    setStateSelectedParticipant,
    setStateSelectedParticipantCustomerInformationGlobal,
    setStateSelectedParticipantRideProviderInformationGlobal,
    setStateSelectedParticipantRideRequestInformationGlobal,
    setStateSelectedParticipantTypeGlobal,
    setStateSelectedRideRequest,
    setStateSettingsBlockchainUpdateRateInMs,
    setStateSettingsGlobalDebug,
    setStateSettingsMapBaseUrlPathfinder,
    setStateSettingsMapBaseUrlSimulation,
    setStateSettingsMapShowTooltips,
    setStateSettingsMapUpdateRateInMs,
    setStateSpectator,
    setStateThemeMode,
    showError,
    stateErrorModalContent,
    stateErrorModalOpen,
    stateSelectedParticipant,
    stateSelectedParticipantCustomerInformationGlobal,
    stateSelectedParticipantRideProviderInformationGlobal,
    stateSelectedParticipantRideRequestInformationGlobal,
    stateSelectedParticipantTypeGlobal,
    stateSelectedRideRequest,
    stateSettingsBlockchainUpdateRateInMs,
    stateSettingsGlobalDebug,
    stateSettingsMapBaseUrlPathfinder,
    stateSettingsMapBaseUrlSimulation,
    stateSettingsMapShowTooltips,
    stateSettingsMapUpdateRateInMs,
    stateSpectator,
    stateThemeMode,
    updateGlobalSearch,
  };

  return (
    <ThemeContainer {...props}>
      <SearchAppBar {...props} />
      <main className={[`mui-theme-${stateThemeMode}`].join(' ')}>
        <TabPanel {...props} />
      </main>
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
    </ThemeContainer>
  );
}
