// Package imports
// > Components
import {List, Typography} from '@mui/material';
// Local imports
// > Components
import {
  ParticipantCustomerIcon,
  ParticipantPersonalDataIcon,
  ParticipantRideRequestIcon,
} from '@components/Icons';
import CardGeneric from '@components/Card/CardGeneric';
// Type imports
import type {
  CardGenericProps,
  CardGenericPropsContentElement,
} from '@components/Card/CardGeneric';
import type {ChangeViewButtonProps} from '@components/Button/ChangeViewButton';
import type {GlobalPropsSpectatorSelectedElementsSet} from '@misc/props/global';
import type {ReactState} from '@misc/react';
import type {SimulationEndpointRideRequestInformation} from '@globals/types/simulation';
// A
import {
  type DataElement,
  RenderDataElement,
} from '../CardParticipant/PopupContentGeneric';
import {ParticipantsCustomer} from '@components/Tab/TabOverview/Elements';

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
        ...cardRideRequestContent(
          props,
          stateRideRequestInformation ?? undefined
        ),
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

export interface CardRideRequestContentProps
  extends GlobalPropsSpectatorSelectedElementsSet,
    ChangeViewButtonProps {
  showRideRequest?: boolean;
}

export function cardRideRequestContent(
  props: CardRideRequestContentProps,
  request?: SimulationEndpointRideRequestInformation
) {
  const result: Array<CardGenericPropsContentElement> = [];
  const showContentSpectatorContactDetails = [
    {
      description: 'registered authentication service',
      spectator: 'auth',
    },
  ];
  const personalData: DataElement[] = [];
  if (request !== undefined) {
    personalData.push(
      ...[
        {
          content: request.id,
          dataAccessInformation: [],
          label: 'ID',
          showContentSpectator: [...showContentSpectatorContactDetails],
        },
      ]
    );
  }
  result.push({
    content: (
      <List>
        {request !== undefined
          ? personalData.map((a, index) => (
              <RenderDataElement
                {...props}
                key={`render-data-element-${index}`}
                element={a}
                id={request.id}
                dataOriginName={`Customer (${request.id})`}
                dataOriginId={request.id}
                dataOriginIcon={<ParticipantCustomerIcon />}
                dataOriginInformation={<ParticipantsCustomer />}
                dataAccessInformation={a.dataAccessInformation}
              />
            ))
          : null}
      </List>
    ),
    label: 'Personal Details',
    labelIcon: <ParticipantPersonalDataIcon />,
  });
  return result;
}
