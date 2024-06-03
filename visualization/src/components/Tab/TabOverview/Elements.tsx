// Package imports
// > Components
import {Typography} from '@mui/material';
// Local imports
import {
  ChipList,
  OverviewElementSectionHeadingTitle,
  OverviewElementSectionTitle,
} from './TabOverviewElements';
// > Icons
import {
  MiscCryptoExchangeIcon,
  MiscGetACarFoundationIcon,
  MiscRideContractServiceIcon,
  ParticipantCustomerIcon,
  ParticipantRideProviderIcon,
  ServiceAuthenticationIcon,
  ServiceMatchingIcon,
} from '@components/Icons';
// Type imports
import {OverviewElementProps} from './TabOverviewElements';

export function Stakeholders(props: OverviewElementProps) {
  return (
    <>
      <OverviewElementSectionTitle {...props} id="anchor-stackeholders">
        Stakeholders
      </OverviewElementSectionTitle>
      <Typography variant="body1" gutterBottom>
        Platform Participants:
      </Typography>
      <ChipList
        elements={[
          {
            description: 'requests rides (human)',
            icon: <ParticipantCustomerIcon />,
            label: 'Customer',
            link: '#anchor-customer',
          },
          {
            description: 'provides rides (human/autonomous vehicle)',
            icon: <ParticipantRideProviderIcon />,
            label: 'Ride Provider',
            link: '#anchor-ride-provider',
          },
        ]}
      />
      <Typography variant="body1" gutterBottom>
        Platform (decentralized) Services:
      </Typography>
      <ChipList
        elements={[
          {
            icon: <ServiceAuthenticationIcon />,
            label: 'Authentication Service (AS)',
            link: '#anchor-as',
          },
          {
            icon: <ServiceMatchingIcon />,
            label: 'Matching Service (MS)',
            link: '#anchor-ms',
          },
        ]}
      />
      <Typography variant="body1" gutterBottom>
        Platform Blockchain Connection:
      </Typography>
      <ChipList
        elements={[
          {
            icon: <MiscCryptoExchangeIcon />,
            label: 'Crypto Exchange',
            link: '#anchor-crypto-exchange',
          },
          {
            icon: <MiscRideContractServiceIcon />,
            label: 'Ride Contract Service',
            link: '#anchor-ride-provider',
          },
        ]}
      />
      <Typography variant="body1" gutterBottom>
        Other:
      </Typography>
      <ChipList
        elements={[
          {
            description: 'verifies Authentication Services',
            icon: <MiscGetACarFoundationIcon />,
            label: 'GETACAR foundation',
            link: '#anchor-getacar-foundation',
          },
        ]}
      />
    </>
  );
}

export function Participants(props: OverviewElementProps) {
  return (
    <>
      <OverviewElementSectionTitle {...props} id="anchor-participants">
        Participants
      </OverviewElementSectionTitle>
      <ParticipantsCustomer {...props} />
      <ParticipantsRideProvider {...props} />
    </>
  );
}

export function ParticipantsCustomer(props: OverviewElementProps) {
  return (
    <>
      <OverviewElementSectionHeadingTitle
        {...props}
        icon={<ParticipantCustomerIcon fontSize="small" />}
        id="anchor-customer"
      >
        Customer
      </OverviewElementSectionHeadingTitle>
      <Typography variant="body1" gutterBottom>
        TODO: Add presentation information about Customer
      </Typography>
    </>
  );
}

export function ParticipantsRideProvider(props: OverviewElementProps) {
  return (
    <>
      <OverviewElementSectionHeadingTitle
        {...props}
        icon={<ParticipantRideProviderIcon fontSize="small" />}
        id="anchor-ride-provider"
      >
        Ride Provider
      </OverviewElementSectionHeadingTitle>
      <Typography variant="body1" gutterBottom>
        TODO: Add presentation information about Ride Provider
      </Typography>
    </>
  );
}

export function Services(props: OverviewElementProps) {
  return (
    <>
      <OverviewElementSectionTitle {...props} id="anchor-services">
        Services
      </OverviewElementSectionTitle>
      <ServiceAuthentication {...props} />
      <ServiceMatching {...props} />
    </>
  );
}

export function ServiceAuthentication(props: OverviewElementProps) {
  return (
    <>
      <OverviewElementSectionHeadingTitle
        {...props}
        icon={<ServiceAuthenticationIcon fontSize="small" />}
        id="anchor-as"
      >
        Authentication Service
      </OverviewElementSectionHeadingTitle>
      <Typography variant="body1" gutterBottom>
        TODO: Add presentation information about Authentication Service
      </Typography>
    </>
  );
}

export function ServiceMatching(props: OverviewElementProps) {
  return (
    <>
      <OverviewElementSectionHeadingTitle
        {...props}
        icon={<ServiceMatchingIcon fontSize="small" />}
        id="anchor-ms"
      >
        Matching Service
      </OverviewElementSectionHeadingTitle>
      <Typography variant="body1" gutterBottom>
        TODO: Add presentation information about Matching Service
      </Typography>
    </>
  );
}

export function Blockchain(props: OverviewElementProps) {
  return (
    <>
      <OverviewElementSectionTitle {...props} id="anchor-blockchain">
        Blockchain
      </OverviewElementSectionTitle>
      <OverviewElementSectionHeadingTitle
        {...props}
        icon={<MiscCryptoExchangeIcon fontSize="small" />}
        id="anchor-crypto-exchange"
      >
        Crypto Exchange
      </OverviewElementSectionHeadingTitle>
      <Typography variant="body1" gutterBottom>
        Text
      </Typography>
      <OverviewElementSectionHeadingTitle
        {...props}
        icon={<MiscRideContractServiceIcon fontSize="small" />}
        id="anchor-ride-contract-service"
      >
        Ride Contract Service
      </OverviewElementSectionHeadingTitle>
      <Typography variant="body1" gutterBottom>
        Text
      </Typography>
    </>
  );
}
