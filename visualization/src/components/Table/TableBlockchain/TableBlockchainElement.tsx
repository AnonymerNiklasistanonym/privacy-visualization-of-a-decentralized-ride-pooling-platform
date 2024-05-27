// Package imports
import {useState} from 'react';
// > Components
import {
  Box,
  Collapse,
  List,
  ListItem,
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
} from '@mui/icons-material';
// Local imports
// > Components
import {
  MiscRideContractSmartContractIcon,
  ParticipantCustomerIcon,
  ParticipantRideProviderIcon,
} from '@components/Icons';
// Type imports
import type {GlobalPropsSpectatorSelectedElementsSet} from '@misc/props/global';
import type {ReactState} from '@misc/react';
import type {SimulationEndpointSmartContractInformation} from '@globals/types/simulation';

export interface TableBlockchainElementProps
  extends GlobalPropsSpectatorSelectedElementsSet {
  stateSmartContract: ReactState<SimulationEndpointSmartContractInformation>;
}

export default function TableBlockchainElement({
  stateSmartContract,
  setStateSelectedParticipant,
}: TableBlockchainElementProps) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <MiscRideContractSmartContractIcon />
        </ListItemIcon>
        <ListItemText primary={`Wallet ${stateSmartContract.walletId}`} />
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
          <List>
            <ListItem
              onClick={() =>
                setStateSelectedParticipant(stateSmartContract.customerId)
              }
            >
              <ListItemIcon>
                <ParticipantCustomerIcon />
              </ListItemIcon>
              <ListItemText
                primary={`Customer ${stateSmartContract.customerId}`}
              />
              <Box sx={{alignItems: 'center', display: 'flex', pr: 2}}>
                <Rating
                  name="rating"
                  precision={0.5}
                  disabled={stateSmartContract.customerRating === undefined}
                  value={stateSmartContract.customerRating ?? 0}
                />
              </Box>
            </ListItem>
            <ListItem
              onClick={() =>
                setStateSelectedParticipant(stateSmartContract.rideProviderId)
              }
            >
              <ListItemIcon>
                <ParticipantRideProviderIcon />
              </ListItemIcon>
              <ListItemText
                primary={`Ride Provider ${stateSmartContract.rideProviderId}`}
              />
              <Box sx={{alignItems: 'center', display: 'flex', pr: 2}}>
                <Rating
                  name="rating"
                  precision={0.5}
                  disabled={stateSmartContract.rideProviderRating === undefined}
                  value={stateSmartContract.rideProviderRating ?? 0}
                />
              </Box>
            </ListItem>
          </List>
          <Typography variant="body1" gutterBottom>
            Other details (TODO)
          </Typography>
        </Box>
      </Collapse>
    </>
  );
}
