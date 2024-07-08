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
import ButtonChangeSpectator from '@components/Button/ButtonChangeSpectator';
// Type imports
import type {ButtonChangeSpectatorProps} from '@components/Button/ButtonChangeSpectator';
import type {GlobalPropsSpectatorSelectedElementsSet} from '@misc/props/global';
import type {ReactState} from '@misc/react';
import type {SimulationEndpointSmartContractInformation} from '@globals/types/simulation';

export interface TableBlockchainElementProps
  extends GlobalPropsSpectatorSelectedElementsSet,
    ButtonChangeSpectatorProps {
  stateSmartContract: ReactState<SimulationEndpointSmartContractInformation>;
}

export default function TableBlockchainElement(
  props: TableBlockchainElementProps
) {
  const {stateSmartContract} = props;
  const [open, setOpen] = useState(true);

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
                // TODO
                //setStateSelectedParticipant(stateSmartContract.customerId)
                undefined
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
                // TODO
                //setStateSelectedParticipant(stateSmartContract.rideProviderId)
                undefined
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
            TODO: Use button to select? Or should the user be able to change the
            spectator from this tab/modal?
          </Typography>
          <ButtonChangeSpectator
            spectatorId={stateSmartContract.customerId}
            label="Customer"
            isPseudonym={true}
            {...props}
          />
          <ButtonChangeSpectator
            spectatorId={stateSmartContract.rideProviderId}
            label="Ride Provider"
            isPseudonym={true}
            {...props}
          />
        </Box>
      </Collapse>
    </>
  );
}
