'use client';

// Package imports
import {usePathname, useSearchParams} from 'next/navigation';
import {useIntl} from 'react-intl';
import {useState} from 'react';
// > Components
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import Link from 'next/link';
// > Icons
import {
  Brightness7 as DarkModeIcon,
  Info as InfoIcon,
  Language as LanguageIcon,
  Brightness4 as LightModeIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
// Local imports
import {i18n, i18nGetLanguageName} from '../../../i18n-config';
// > Components
import SearchBar from '@components/TextInput/SearchBar';
// Type imports
import type {
  GlobalPropsParticipantSelectedElements,
  GlobalPropsSearch,
  GlobalPropsTheming,
} from '@misc/props/global';
import type {ReactElement} from 'react';
import type {SearchBarProps} from '@components/TextInput/SearchBar';

export interface SearchAppBarProps
  extends GlobalPropsParticipantSelectedElements,
    GlobalPropsSearch,
    GlobalPropsTheming,
    SearchBarProps {}

export interface SearchAppBarPropsInput extends SearchAppBarProps {
  toggleDrawer: (newOpen: boolean) => void;
}

export interface SearchAppBarDrawerListElement {
  icon: ReactElement;
  id: string;
  link: string;
}

export function SearchAppBarDrawerList({
  toggleDrawer,
  stateThemeMode,
  setStateThemeMode,
}: SearchAppBarPropsInput) {
  const {locales, defaultLocale} = i18n;
  const pathname = usePathname()
    .split('/')
    .filter(a => a.length > 0);
  if (pathname.length > 0 && locales.some(a => pathname[0].includes(a))) {
    pathname.shift();
  }
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const intl = useIntl();

  const links: Array<SearchAppBarDrawerListElement> = [
    {
      icon: <InfoIcon />,
      id: intl.formatMessage({id: 'page.about.title'}),
      link: '/about',
    },
    ...[...locales].sort().map(locale => ({
      icon: <LanguageIcon />,
      id: i18nGetLanguageName(locale),
      link: `${locale === defaultLocale ? '/' : `/${locale}/`}${pathname.join(
        '/'
      )}?${params.toString()}`,
    })),
  ];
  return (
    <Box
      sx={{width: {sm: 250, xs: '80vw'}}}
      role="presentation"
      onClick={() => toggleDrawer(false)}
    >
      <List>
        <ListItem
          sx={{
            display: {sm: 'none', xs: 'block'},
          }}
        >
          <ListItemText primary={intl.formatMessage({id: 'page.home.title'})} />
        </ListItem>
        {links.map(a => (
          <Link key={a.link} href={a.link}>
            <ListItem key={a.id} disablePadding>
              <ListItemButton>
                <ListItemIcon>{a.icon}</ListItemIcon>
                <ListItemText primary={a.id} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
        <ListItem
          onClick={() =>
            setStateThemeMode(prevThemeMode =>
              prevThemeMode === 'dark' ? 'light' : 'dark'
            )
          }
          disablePadding
        >
          <ListItemButton>
            <ListItemIcon>
              {stateThemeMode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
            </ListItemIcon>
            <ListItemText
              primary={intl.formatMessage(
                {id: 'page.home.search.switchTheme'},
                {
                  name: intl.formatMessage({
                    id:
                      stateThemeMode === 'dark' ? 'theme.light' : 'theme.dark',
                  }),
                }
              )}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}

export function SearchAppBarToolbar(props: SearchAppBarPropsInput) {
  const {toggleDrawer} = props;
  const intl = useIntl();
  return (
    <Toolbar>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{mr: 2}}
        onClick={() => toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{
          display: {sm: 'block', xs: 'none'},
          flexGrow: 1,
        }}
      >
        {intl.formatMessage({id: 'page.home.title'})}
      </Typography>

      <SearchBar {...props} />
    </Toolbar>
  );
}

export default function SearchAppBar(props: SearchAppBarProps) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const propsNew = {
    toggleDrawer,
  };

  return (
    <>
      <Box sx={{flexGrow: 1}}>
        <AppBar position="static">
          <SearchAppBarToolbar {...props} {...propsNew} />
        </AppBar>
      </Box>
      <Drawer open={open} onClose={() => toggleDrawer(false)}>
        <SearchAppBarDrawerList {...props} {...propsNew} />
      </Drawer>
    </>
  );
}
