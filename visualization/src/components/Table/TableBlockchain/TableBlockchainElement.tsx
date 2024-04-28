// Package imports
import {useState} from 'react';
// > Components
import {
  Box,
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Rating,
  Typography,
} from '@mui/material';
// > Icons
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

export default function TableBlockchainElement() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Inbox" />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box
          component="section"
          sx={{
            maxWidth: 800,
            width: '100%',
          }}
        >
          <Typography variant="body1" gutterBottom>
            TODO
          </Typography>
          <Rating name="read-only" value={3} readOnly />
        </Box>
      </Collapse>
    </>
  );
}
