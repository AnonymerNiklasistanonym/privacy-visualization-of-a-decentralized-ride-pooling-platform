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
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
// > Icons
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import InputBase from '@mui/material/InputBase';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
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
  return (
    <Box
      sx={{width: 250}}
      role="presentation"
      onClick={() => toggleDrawer(false)}
    >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
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
