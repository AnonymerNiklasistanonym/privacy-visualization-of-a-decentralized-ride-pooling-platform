// Package imports
// > Components
import {Box, Chip, Typography} from '@mui/material';
// Local imports
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
import type {ReactElement} from 'react';

export interface ChipListProps {
  elements: ReadonlyArray<{
    description?: string;
    link: string;
    label: string;
    icon: ReactElement;
  }>;
}

export function ChipList({elements}: ChipListProps) {
  return (
    <ul>
      {elements.map(a => (
        <li style={{margin: '0.2rem'}} key={a.label}>
          <a href={a.link}>
            <Chip
              icon={a.icon}
              label={a.label}
              color="primary"
              onClick={() => {}}
            />
            <Box display={'inline'} sx={{fontStyle: 'italic'}}>
              {a.description ? ` ${a.description}` : undefined}
            </Box>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Stakeholders() {
  return (
    <>
      <Typography variant="h4" id="anchor-stackeholders" gutterBottom>
        Stakeholders
      </Typography>
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

export function Participants() {
  return (
    <>
      <Typography variant="h4" id="anchor-participants" gutterBottom>
        Participants
      </Typography>
      <Typography variant="h5" id="anchor-customer" gutterBottom>
        <ParticipantCustomerIcon fontSize="small" /> Customer
      </Typography>
      <Typography variant="body1" gutterBottom>
        Text
      </Typography>
      <Typography variant="h5" id="anchor-ride-provider" gutterBottom>
        <ParticipantRideProviderIcon fontSize="small" /> Ride Provider
      </Typography>
      <Typography variant="body1" gutterBottom>
        Text
      </Typography>
    </>
  );
}

export function Services() {
  return (
    <>
      <Typography variant="h4" id="anchor-services" gutterBottom>
        Services
      </Typography>
      <Typography variant="h5" id="anchor-as" gutterBottom>
        <ServiceAuthenticationIcon fontSize="small" /> Authentication Service
      </Typography>
      <Typography variant="body1" gutterBottom>
        Text
      </Typography>
      <Typography variant="h5" id="anchor-ms" gutterBottom>
        <ServiceMatchingIcon fontSize="small" /> Matching Service
      </Typography>
      <Typography variant="body1" gutterBottom>
        Text
      </Typography>
    </>
  );
}

export function Blockchain() {
  return (
    <>
      <Typography variant="h4" id="anchor-blockchain" gutterBottom>
        Blockchain
      </Typography>
      <Typography variant="h5" id="anchor-crypto-exchange" gutterBottom>
        <MiscCryptoExchangeIcon fontSize="small" /> Crypto Exchange
      </Typography>
      <Typography variant="body1" gutterBottom>
        Text
      </Typography>
      <Typography variant="h5" id="anchor-ride-contract-service" gutterBottom>
        <MiscRideContractServiceIcon fontSize="small" /> Ride Contract Service
      </Typography>
      <Typography variant="body1" gutterBottom>
        Text
      </Typography>
    </>
  );
}
