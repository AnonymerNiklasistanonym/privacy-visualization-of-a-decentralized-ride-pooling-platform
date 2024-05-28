// Package imports
// > Components
import {Typography} from '@mui/material';
// Local imports
// > Components
import CardGeneric from '@components/Card/CardGeneric';
import {ParticipantRideRequestIcon} from '@components/Icons';
// Type imports
import type {CardGenericProps} from '@components/Card/CardGeneric';
import type {ChangeViewButtonProps} from '@components/Button/ChangeViewButton';
import type {ReactState} from '@misc/react';
import type {SimulationEndpointRideRequestInformation} from '@globals/types/simulation';

export interface CardRideRequestProps
  extends ChangeViewButtonProps,
    CardGenericProps {
  stateRideRequestInformation: ReactState<SimulationEndpointRideRequestInformation>;
}

export default function CardRideRequest(props: CardRideRequestProps) {
  const {stateRideRequestInformation} = props;
  return (
    <CardGeneric
      {...props}
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
