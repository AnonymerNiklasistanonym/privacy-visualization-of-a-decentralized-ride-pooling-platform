// Package imports
// > Components
import {Box, Chip, Typography} from '@mui/material';
// > Icons
import {
  CurrencyExchange as CurrencyExchangeIcon,
  DirectionsCar as DirectionsCarIcon,
  DirectionsWalk as DirectionsWalkIcon,
  Foundation as FoundationIcon,
  Group as GroupIcon,
  SlowMotionVideo as SlowMotionVideoIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
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
        <ChipList
          elements={[
            {
              description: 'requests rides (human)',
              icon: <DirectionsWalkIcon />,
              label: 'Customer',
              link: '#anchor-customer',
            },
            {
              description: 'provides rides (human/autonomous vehicle)',
              icon: <DirectionsCarIcon />,
              label: 'Ride Provider',
              link: '#anchor-ride-provider',
            },
          ]}
        />
        Platform (decentralized) Services:
        <ChipList
          elements={[
            {
              icon: <VerifiedIcon />,
              label: 'Authentication Service (AS)',
              link: '#anchor-as',
            },
            {
              icon: <GroupIcon />,
              label: 'Matching Service (MS)',
              link: '#anchor-ms',
            },
          ]}
        />
        Platform Blockchain Connection:
        <ChipList
          elements={[
            {
              icon: <CurrencyExchangeIcon />,
              label: 'Crypto Exchange',
              link: '#anchor-crypto-exchange',
            },
            {
              icon: <SlowMotionVideoIcon />,
              label: 'Ride Contract Service',
              link: '#anchor-ride-provider',
            },
          ]}
        />
        Other:
        <ChipList
          elements={[
            {
              description: 'verifies Authentication Services',
              icon: <FoundationIcon />,
              label: 'GETACAR foundation',
              link: '#anchor-getacar-foundation',
            },
          ]}
        />
      </Typography>
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
        <DirectionsWalkIcon fontSize="small" /> Customer
      </Typography>
      <Typography variant="body1" gutterBottom>
        Text
      </Typography>
      <Typography variant="h5" id="anchor-ride-provider" gutterBottom>
        <DirectionsCarIcon fontSize="small" /> Ride Provider
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
        <VerifiedIcon fontSize="small" /> Authentication Service
      </Typography>
      <Typography variant="body1" gutterBottom>
        Text
      </Typography>
      <Typography variant="h5" id="anchor-ms" gutterBottom>
        <GroupIcon fontSize="small" /> Matching Service
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
        <CurrencyExchangeIcon fontSize="small" /> Crypto Exchange
      </Typography>
      <Typography variant="body1" gutterBottom>
        Text
      </Typography>
      <Typography variant="h5" id="anchor-ride-contract-service" gutterBottom>
        <SlowMotionVideoIcon fontSize="small" /> Ride Contract Service
      </Typography>
      <Typography variant="body1" gutterBottom>
        Text
      </Typography>
    </>
  );
}
