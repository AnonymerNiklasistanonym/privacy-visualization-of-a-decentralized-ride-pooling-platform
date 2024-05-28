// Package imports
// > Components
import {Typography} from '@mui/material';
// Local imports
// > Components
import CardGeneric from '@components/Card/CardGeneric';
import {ParticipantRideRequestIcon} from '@components/Icons';
// Type imports
import type {ChangeViewButtonProps} from '@components/Button/ChangeViewButton';
import type {ReactState} from '@misc/react';
import type {SimulationEndpointRideRequestInformation} from '@globals/types/simulation';

export interface CardRideRequestProps extends ChangeViewButtonProps {
  stateRideRequestInformation: ReactState<SimulationEndpointRideRequestInformation>;
  label?: string;
}

export default function CardRideRequest(props: CardRideRequestProps) {
  const {label, stateRideRequestInformation} = props;
  return (
    <CardGeneric
      label={label}
      icon={<ParticipantRideRequestIcon />}
      name={'Ride Request'}
      id={stateRideRequestInformation.id}
      status={stateRideRequestInformation.auctionStatus}
      content={[
        {
          content: (
            <Typography variant="body1" gutterBottom>
              TODO: Add ride request information
            </Typography>
          ),
        },
      ]}
    />
  );
}
