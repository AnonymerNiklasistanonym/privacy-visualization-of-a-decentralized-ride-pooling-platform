'use client';

// Package imports
import {alpha, styled} from '@mui/material/styles';
import {useIntl} from 'react-intl';
import {useState} from 'react';
// > Components
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  InputBase,
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
  Info as InfoIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
// Local imports
// > Components
import SearchAppBarContainer from './SearchAppBarContainer';
// Type imports
import type {ReactPropsI18n} from '@misc/react';

const Search = styled('div')(({theme}) => ({
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  borderRadius: theme.shape.borderRadius,
  marginLeft: 0,
  position: 'relative',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  padding: theme.spacing(0, 2),
  pointerEvents: 'none',
  position: 'absolute',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      '&:focus': {width: '20ch'},
      width: '12ch',
    },
  },
  color: 'inherit',
  width: '100%',
}));

export interface SearchAppBarElementProps {
  toggleDrawer: (newOpen: boolean) => void;
}

export function SearchAppBarDrawerList({
  toggleDrawer,
}: SearchAppBarElementProps) {
  const links = [
    {
      icon: <InfoIcon />,
      id: 'About',
      link: '/about',
    },
  ];
  return (
    <Box
      sx={{width: 250}}
      role="presentation"
      onClick={() => toggleDrawer(false)}
    >
      <List>
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
      </List>
    </Box>
  );
}

export function SearchAppBarToolbar({toggleDrawer}: SearchAppBarElementProps) {
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
        suppressHydrationWarning
      >
        {intl.formatMessage({id: 'page.home.title'})}
      </Typography>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{'aria-label': 'search'}}
        />
      </Search>
    </Toolbar>
  );
}

export default function SearchAppBar({locale, messages}: ReactPropsI18n) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <SearchAppBarContainer locale={locale} messages={messages}>
      <Box sx={{flexGrow: 1}}>
        <AppBar position="static">
          <SearchAppBarToolbar toggleDrawer={toggleDrawer} />
        </AppBar>
      </Box>
      <Drawer open={open} onClose={() => toggleDrawer(false)}>
        <SearchAppBarDrawerList toggleDrawer={toggleDrawer} />
      </Drawer>
    </SearchAppBarContainer>
  );
}
