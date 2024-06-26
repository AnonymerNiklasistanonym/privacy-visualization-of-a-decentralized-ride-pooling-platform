'use client';

// Package imports
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useIntl} from 'react-intl';
// > Components
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Switch,
  TextField,
} from '@mui/material';
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
import {ReactElement, memo, useEffect, useMemo, useState} from 'react';
// Local imports
import {i18n, i18nGetLanguageName} from '../../../../i18n-config';
// > Components
import {
  ConnectedElementsIcon,
  SettingsBrightnessIcon,
  SettingsDebugIcon,
  SettingsLanguageIcon,
  SettingsStorageIcon,
  SettingsUiIcon,
  TabBlockchainIcon,
  TabMapIcon,
} from '@components/Icons';
import NumericFormatGeneric from '@components/Input/NumericFormatGeneric';
import NumericFormatMs from '@components/Input/NumericFormatMs';
import TabContainer from '@components/Tab/TabContainer';
// > Misc
import {debugComponentUpdate, debugMemoHelper} from '@misc/debug';
import {stringComparator} from '@misc/compare';
// Type imports
import type {ReactSetState, ReactState} from '@misc/react';
import type {SettingsProps} from '@misc/props/settings';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TabSettingsProps extends SettingsProps {}

export interface SettingsElementGeneric {
  label: string;
  type: string;
}

export interface SettingsElementToggle extends SettingsElementGeneric {
  stateValue: ReactState<boolean>;
  setStateValue: ReactSetState<boolean>;
  type: 'toggle';
}

export interface SettingsElementText extends SettingsElementGeneric {
  stateValue: ReactState<string>;
  setStateValue: ReactSetState<string>;
  type: 'text';
}

export interface SettingsElementNumber extends SettingsElementGeneric {
  stateValue: ReactState<number>;
  setStateValue: ReactSetState<number>;
  type: 'number';
}

export interface SettingsElementMs extends SettingsElementGeneric {
  stateValue: ReactState<number>;
  setStateValue: ReactSetState<number>;
  type: 'ms';
}

export interface SettingsElementRadio<T extends string>
  extends SettingsElementGeneric {
  stateValue: ReactState<T>;
  setStateValue: ReactSetState<T>;
  options: Array<{label: string; value: T}>;
  type: 'radio';
}

export interface SettingsElementButton extends SettingsElementGeneric {
  onClick: () => void;
  type: 'button';
  // Compatibility
  stateValue: ReactState<string>;
  setStateValue: ReactSetState<string>;
}

export type SettingsElement =
  | SettingsElementToggle
  | SettingsElementText
  | SettingsElementNumber
  | SettingsElementMs
  | SettingsElementRadio<string>
  | SettingsElementButton;

export interface RenderSettingsElementProps {
  element: SettingsElement;
}

export const RenderSettingsElementMemo = memo(
  RenderSettingsElement,
  (prev, next) =>
    debugMemoHelper<SettingsElementToggle>(
      `RenderSettingsElement ${next.element.label} (${next.element.type})`,
      ['label', 'type', 'stateValue'],
      prev.element,
      next.element
    )
);

export function RenderSettingsElement({element}: RenderSettingsElementProps) {
  debugComponentUpdate(
    `RenderSettingsElement ${element.label} (${element.type})`,
    true
  );
  if (element.type === 'toggle') {
    return (
      <FormControlLabel
        control={
          <Switch
            checked={element.stateValue}
            onChange={(event, checked) => element.setStateValue(checked)}
          />
        }
        label={element.label}
      />
    );
  }
  if (element.type === 'text') {
    return (
      <TextField
        label={element.label}
        variant="outlined"
        value={element.stateValue}
        onChange={event => element.setStateValue(event.target.value)}
      />
    );
  }
  if (element.type === 'number') {
    return (
      <TextField
        label={element.label}
        value={element.stateValue}
        onChange={event => element.setStateValue(Number(event.target.value))}
        InputProps={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          inputComponent: NumericFormatGeneric as any,
        }}
        variant="standard"
      />
    );
  }
  if (element.type === 'ms') {
    return (
      <TextField
        label={element.label}
        value={element.stateValue}
        onChange={event => element.setStateValue(Number(event.target.value))}
        InputProps={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          inputComponent: NumericFormatMs as any,
        }}
        variant="standard"
      />
    );
  }
  if (element.type === 'radio') {
    return (
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">
          {element.label}
        </FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          value={element.stateValue}
          onChange={(event, value) => element.setStateValue(value)}
          name="radio-buttons-group"
        >
          {element.options.map(a => (
            <FormControlLabel
              key={a.value}
              value={a.value}
              control={<Radio />}
              label={a.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    );
  }
  if (element.type === 'button') {
    return (
      <Button variant="contained" onClick={element.onClick}>
        {element.label}
      </Button>
    );
  }
  return <></>;
}

export interface RenderSettingsProps {
  title: string;
  icon: ReactElement;
  elements: Array<SettingsElement>;
}

export const RenderSettingsMemo = memo(RenderSettings, (prev, next) =>
  debugMemoHelper(
    `RenderSettings ${next.title}`,
    [
      'title',
      [
        'elements',
        (prev2, next2) =>
          (prev2 as SettingsElement).label ===
            (next2 as SettingsElement).label &&
          (prev2 as SettingsElement).stateValue ===
            (next2 as SettingsElement).stateValue &&
          (prev2 as SettingsElement).setStateValue ===
            (next2 as SettingsElement).setStateValue &&
          (prev2 as SettingsElement).type === (next2 as SettingsElement).type,
        undefined,
      ],
    ],
    prev,
    next
  )
);

export function RenderSettings({title, icon, elements}: RenderSettingsProps) {
  debugComponentUpdate(`RenderSettings ${title}`, true);
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <CardHeader avatar={icon} title={title.toUpperCase()} />
        <CardContent>
          <List
            sx={{
              '& ul': {padding: 0},
              overflow: 'auto',
              width: '100%',
            }}
            subheader={<li />}
          >
            {elements
              .sort((a, b) => stringComparator(a.label, b.label))
              .map(a => (
                <ListItem key={`${title}-${a.label}`}>
                  <RenderSettingsElement element={a} />
                </ListItem>
              ))}
          </List>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default memo(TabSettings);

export function TabSettings({
  setStateSettingsBlockchainUpdateRateInMs,
  setStateSettingsGlobalDebug,
  setStateSettingsMapBaseUrlPathfinder,
  setStateSettingsMapBaseUrlSimulation,
  setStateSettingsMapShowTooltips,
  setStateSettingsMapUpdateRateInMs,
  stateSettingsBlockchainUpdateRateInMs,
  stateSettingsGlobalDebug,
  stateSettingsMapBaseUrlPathfinder,
  stateSettingsMapBaseUrlSimulation,
  stateSettingsMapShowTooltips,
  stateSettingsMapUpdateRateInMs,
  setStateSettingsUiGridSpacing,
  stateSettingsUiGridSpacing,
  setStateSettingsUiMapScroll,
  stateSettingsUiMapScroll,
  stateSettingsCardUpdateRateInMs,
  setStateSettingsCardUpdateRateInMs,
  setStateThemeMode,
  stateThemeMode,
}: TabSettingsProps) {
  debugComponentUpdate('TabSettings', true);
  const intl = useIntl();
  const {locales, defaultLocale} = i18n;
  const router = useRouter();
  const pathname = usePathname()
    .split('/')
    .filter(a => a.length > 0);
  let locale = defaultLocale;
  if (pathname.length > 0 && locales.some(a => pathname[0].includes(a))) {
    locale = pathname[0];
    pathname.shift();
  }
  const searchParams = useSearchParams();

  const [stateSettingsLanguage, setStateSettingsLanguage] = useState(locale);
  const [stateSettingsBrightnessLocal, setStateSettingsBrightness] =
    useState<string>(stateThemeMode);
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    router.push(
      `${
        stateSettingsLanguage === defaultLocale
          ? '/'
          : `/${stateSettingsLanguage}/`
      }${pathname.join('/')}?${params.toString()}`
    );
  }, [stateSettingsLanguage, defaultLocale, searchParams, pathname, router]);

  useEffect(() => {
    if (
      stateSettingsBrightnessLocal === 'light' ||
      stateSettingsBrightnessLocal === 'dark'
    ) {
      setStateThemeMode(stateSettingsBrightnessLocal);
    }
  }, [stateSettingsBrightnessLocal, setStateThemeMode]);

  const settingsCards = useMemo<RenderSettingsProps[]>(
    () => [
      {
        elements: [
          {
            label: intl.formatMessage({
              id: 'page.home.tab.settings.card.language.selectLanguage',
            }),
            options: locales.map(a => ({
              label: i18nGetLanguageName(a),
              value: a,
            })),
            setStateValue: setStateSettingsLanguage,
            stateValue: stateSettingsLanguage,
            type: 'radio',
          },
        ],
        icon: <SettingsLanguageIcon />,
        title: intl.formatMessage({
          id: 'page.home.tab.settings.card.language.title',
        }),
      },
      {
        elements: [
          {
            label: intl.formatMessage({
              id: 'page.home.tab.settings.card.brightness.selectMode',
            }),
            options: [
              {
                label: intl.formatMessage(
                  {id: 'page.home.tab.settings.card.brightness.mode'},
                  {
                    name: intl.formatMessage({
                      id: 'theme.dark',
                    }),
                  }
                ),
                value: 'dark',
              },
              {
                label: intl.formatMessage(
                  {id: 'page.home.tab.settings.card.brightness.mode'},
                  {
                    name: intl.formatMessage({
                      id: 'theme.light',
                    }),
                  }
                ),
                value: 'light',
              },
            ],
            setStateValue: setStateSettingsBrightness,
            stateValue: stateSettingsBrightnessLocal,
            type: 'radio',
          },
        ],
        icon: <SettingsBrightnessIcon />,
        title: intl.formatMessage({
          id: 'page.home.tab.settings.card.brightness.title',
        }),
      },
      {
        elements: [
          {
            label: intl.formatMessage({
              id: 'page.home.tab.settings.card.generic.updateRate',
            }),
            setStateValue: setStateSettingsBlockchainUpdateRateInMs,
            stateValue: stateSettingsBlockchainUpdateRateInMs,
            type: 'ms',
          },
        ],
        icon: <TabBlockchainIcon />,
        title: intl.formatMessage({
          id: 'page.home.tab.blockchain.title',
        }),
      },
      {
        elements: [
          {
            label: intl.formatMessage({
              id: 'page.home.tab.settings.card.map.showTooltips',
            }),
            setStateValue: setStateSettingsMapShowTooltips,
            stateValue: stateSettingsMapShowTooltips,
            type: 'toggle',
          },
          {
            label: intl.formatMessage(
              {
                id: 'page.home.tab.settings.card.generic.baseUrl',
              },
              {
                name: intl.formatMessage({
                  id: 'pathfinder',
                }),
              }
            ),
            setStateValue: setStateSettingsMapBaseUrlPathfinder,
            stateValue: stateSettingsMapBaseUrlPathfinder,
            type: 'text',
          },
          {
            label: intl.formatMessage(
              {
                id: 'page.home.tab.settings.card.generic.baseUrl',
              },
              {
                name: intl.formatMessage({
                  id: 'simulation',
                }),
              }
            ),
            setStateValue: setStateSettingsMapBaseUrlSimulation,
            stateValue: stateSettingsMapBaseUrlSimulation,
            type: 'text',
          },
          {
            label: intl.formatMessage({
              id: 'page.home.tab.settings.card.generic.updateRate',
            }),
            setStateValue: setStateSettingsMapUpdateRateInMs,
            stateValue: stateSettingsMapUpdateRateInMs,
            type: 'ms',
          },
        ],
        icon: <TabMapIcon />,
        title: intl.formatMessage({
          id: 'page.home.tab.map.title',
        }),
      },
      {
        elements: [
          {
            label: intl.formatMessage({
              id: 'page.home.tab.settings.card.generic.updateRate',
            }),
            setStateValue: setStateSettingsCardUpdateRateInMs,
            stateValue: stateSettingsCardUpdateRateInMs,
            type: 'ms',
          },
        ],
        icon: <ConnectedElementsIcon />,
        title: intl.formatMessage({
          id: 'page.home.tab.settings.connectedElements.title',
        }),
      },
      {
        elements: [
          {
            label: intl.formatMessage({
              id: 'page.home.tab.settings.card.debug.enableDebug',
            }),
            setStateValue: setStateSettingsGlobalDebug,
            stateValue: stateSettingsGlobalDebug,
            type: 'toggle',
          },
        ],
        icon: <SettingsDebugIcon />,
        title: intl.formatMessage({
          id: 'page.home.tab.settings.card.debug.title',
        }),
      },
      {
        elements: [
          {
            label: intl.formatMessage({
              id: 'page.home.tab.settings.card.ui.gridSpacing',
            }),
            setStateValue: setStateSettingsUiGridSpacing,
            stateValue: stateSettingsUiGridSpacing,
            type: 'number',
          },
          {
            label: intl.formatMessage({
              id: 'page.home.tab.settings.card.ui.mapPopupVerticalScroll',
            }),
            setStateValue: setStateSettingsUiMapScroll,
            stateValue: stateSettingsUiMapScroll,
            type: 'toggle',
          },
        ],
        icon: <SettingsUiIcon />,
        title: intl.formatMessage({
          id: 'page.home.tab.settings.card.ui.title',
        }),
      },
      {
        elements: [
          {
            label: intl.formatMessage({
              id: 'page.home.tab.settings.card.storage.clearLocalStorage',
            }),
            onClick: () => localStorage.clear(),
            setStateValue: setStateSettingsMapBaseUrlPathfinder,
            stateValue: stateSettingsMapBaseUrlPathfinder,
            type: 'button',
          },
          {
            label: intl.formatMessage({
              id: 'page.home.tab.settings.card.storage.clearSessionStorage',
            }),
            onClick: () => sessionStorage.clear(),
            setStateValue: setStateSettingsMapBaseUrlPathfinder,
            stateValue: stateSettingsMapBaseUrlPathfinder,
            type: 'button',
          },
        ],
        icon: <SettingsStorageIcon />,
        title: intl.formatMessage({
          id: 'page.home.tab.settings.card.storage.title',
        }),
      },
    ],
    [
      intl,
      locales,
      stateSettingsLanguage,
      stateSettingsBrightnessLocal,
      setStateSettingsBlockchainUpdateRateInMs,
      stateSettingsBlockchainUpdateRateInMs,
      setStateSettingsMapShowTooltips,
      stateSettingsMapShowTooltips,
      setStateSettingsMapBaseUrlPathfinder,
      stateSettingsMapBaseUrlPathfinder,
      setStateSettingsMapBaseUrlSimulation,
      stateSettingsMapBaseUrlSimulation,
      setStateSettingsMapUpdateRateInMs,
      stateSettingsMapUpdateRateInMs,
      setStateSettingsCardUpdateRateInMs,
      stateSettingsCardUpdateRateInMs,
      setStateSettingsGlobalDebug,
      stateSettingsGlobalDebug,
      setStateSettingsUiGridSpacing,
      stateSettingsUiGridSpacing,
      setStateSettingsUiMapScroll,
      stateSettingsUiMapScroll,
    ]
  );

  return (
    <TabContainer>
      <FormGroup>
        <Box
          sx={{
            marginBottom: `${stateSettingsUiGridSpacing / 2}rem`,
            marginTop: `${stateSettingsUiGridSpacing / 2}rem`,
          }}
        >
          <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}>
            <Masonry gutter={`${stateSettingsUiGridSpacing / 2}rem`}>
              {settingsCards.map(settingsCard => (
                <RenderSettingsMemo
                  key={settingsCard.title}
                  {...settingsCard}
                />
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </Box>
      </FormGroup>
    </TabContainer>
  );
}
