// Package imports
// > Components
import {Button, Chip, Divider, List, Typography} from '@mui/material';
// Local imports
import {dataModalInformationPersonalData} from './PopupContentGeneric';
// > Components
import {
  ParticipantCustomerIcon,
  ParticipantPersonalDataIcon,
  ParticipantRideProviderIcon,
  ParticipantRideRequestIcon,
} from '@components/Icons';
import {ParticipantsCustomer} from '@components/Tab/TabOverview/Elements';
import {RenderDataElement} from './PopupContentGeneric';
// > Components
import ChangeViewButton from '@components/Button/ChangeViewButton';
// Type imports
import type {ChangeViewButtonProps} from '@components/Button/ChangeViewButton';
import type {DataElement} from './PopupContentGeneric';
import type {DataModalInformation} from '@components/Modal/DataModal';
import type {GlobalPropsSpectatorSelectedElementsSet} from '@misc/props/global';
import type {SimulationEndpointParticipantInformationCustomer} from '@globals/types/simulation';

export interface PopupContentCustomerProps
  extends GlobalPropsSpectatorSelectedElementsSet,
    ChangeViewButtonProps {
  customer: SimulationEndpointParticipantInformationCustomer;
}

export default function PopupContentCustomer(props: PopupContentCustomerProps) {
  const {customer, setStateSelectedRideRequest} = props;
  const showContentSpectatorContactDetails = [
    {
      description: 'registered authentication service',
      spectator: 'auth',
    },
  ];
  const rideProviderPassenger: DataModalInformation[] = [
    ...(customer.passenger !== undefined
      ? [
          {
            accessType: 'transitive',
            description:
              'Since this customer is a passenger of this ride provider this data is known to them',
            icon: <ParticipantRideProviderIcon />,
            name: 'Current Ride Provider of this customer',
            spectatorId: customer.passenger,
          } satisfies DataModalInformation,
        ]
      : []),
  ];
  const personalData: DataElement[] = [
    {
      content: customer.dateOfBirth,
      dataAccessInformation: [...dataModalInformationPersonalData],
      label: 'Date of birth',
      showContentSpectator: [...showContentSpectatorContactDetails],
    },
    {
      content: customer.emailAddress,
      dataAccessInformation: [...dataModalInformationPersonalData],
      label: 'Email Address',
      showContentSpectator: [...showContentSpectatorContactDetails],
    },
    {
      content: customer.fullName,
      dataAccessInformation: [
        ...dataModalInformationPersonalData,
        ...rideProviderPassenger,
      ],
      label: 'Full Name',
      showContentSpectator: [...showContentSpectatorContactDetails],
    },
    {
      content: customer.gender,
      dataAccessInformation: [
        ...dataModalInformationPersonalData,
        ...rideProviderPassenger,
      ],
      label: 'Gender',
      showContentSpectator: [...showContentSpectatorContactDetails],
    },
    {
      content: customer.homeAddress,
      dataAccessInformation: [...dataModalInformationPersonalData],
      label: 'Home Address',
      showContentSpectator: [...showContentSpectatorContactDetails],
    },
    {
      content: customer.phoneNumber,
      dataAccessInformation: [...dataModalInformationPersonalData],
      label: 'Phone Number',
      showContentSpectator: [...showContentSpectatorContactDetails],
    },
  ];
  return (
    <>
      <Divider>
        <Chip
          icon={<ParticipantPersonalDataIcon />}
          label="Personal Details"
          size="small"
        />
      </Divider>
      <List>
        {personalData.map((a, index) => (
          <RenderDataElement
            {...props}
            key={`render-data-element-${index}`}
            element={a}
            id={customer.id}
            dataOriginName={`Customer (${customer.id})`}
            dataOriginId={customer.id}
            dataOriginIcon={<ParticipantCustomerIcon />}
            dataOriginInformation={<ParticipantsCustomer />}
            dataAccessInformation={a.dataAccessInformation}
          />
        ))}
      </List>
      <Divider>
        <Chip
          icon={<ParticipantRideProviderIcon />}
          label="Passenger"
          size="small"
        />
      </Divider>
      {customer.passenger !== undefined ? (
        <ChangeViewButton
          {...props}
          actorId={customer.passenger}
          icon={<ParticipantRideProviderIcon />}
          label={'the current ride provider'}
          isPseudonym={true}
        />
      ) : (
        <></>
      )}
      <Divider>
        <Chip
          icon={<ParticipantRideRequestIcon />}
          label="Ride Request"
          size="small"
        />
      </Divider>
      <Typography variant="body2" gutterBottom>
        {customer.rideRequest !== undefined ? (
          <Button
            variant="contained"
            startIcon={<ParticipantRideRequestIcon />}
            onClick={() => setStateSelectedRideRequest(customer.rideRequest)}
          >
            Show ride request ({customer.rideRequest})
          </Button>
        ) : (
          <></>
        )}
      </Typography>
    </>
  );
}
