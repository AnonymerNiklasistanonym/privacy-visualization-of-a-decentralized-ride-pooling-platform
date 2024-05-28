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

export interface OverviewElementProps {
  showTitle?: boolean;
}

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

export function Stakeholders(props: OverviewElementProps) {
  return (
    <>
      <OverviewElementSectionTitle
        {...props}
        title="Stakeholders"
        id="anchor-stackeholders"
      />
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
      <OverviewElementSectionTitle
        {...props}
        title="Participants"
        id="anchor-participants"
      />
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
        title="Customer"
        icon={<ParticipantCustomerIcon fontSize="small" />}
        id="anchor-customer"
      />
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
        title="Ride Provider"
        icon={<ParticipantRideProviderIcon fontSize="small" />}
        id="anchor-ride-provider"
      />
      <Typography variant="body1" gutterBottom>
        TODO: Add presentation information about Ride Provider
      </Typography>
    </>
  );
}

export function Services(props: OverviewElementProps) {
  return (
    <>
      <OverviewElementSectionTitle
        {...props}
        title="Services"
        id="anchor-services"
      />
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
        title="Authentication Service"
        icon={<ServiceAuthenticationIcon fontSize="small" />}
        id="anchor-as"
      />
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
        title="Matching Service"
        icon={<ServiceMatchingIcon fontSize="small" />}
        id="anchor-ms"
      />
      <Typography variant="body1" gutterBottom>
        TODO: Add presentation information about Matching Service
      </Typography>
    </>
  );
}

export interface OverviewElementTitleProps extends OverviewElementProps {
  title: string;
  icon?: ReactElement;
  id: string;
}

export function OverviewElementSectionTitle({
  icon,
  id,
  showTitle,
  title,
}: OverviewElementTitleProps) {
  return showTitle ? (
    <Typography variant="h4" id={id} gutterBottom>
      {icon} {title}
    </Typography>
  ) : undefined;
}

export function OverviewElementSectionHeadingTitle({
  icon,
  id,
  showTitle,
  title,
}: OverviewElementTitleProps) {
  return showTitle ? (
    <Typography variant="h5" id={id} gutterBottom>
      {icon} {title}
    </Typography>
  ) : undefined;
}

export function Blockchain(props: OverviewElementProps) {
  return (
    <>
      <OverviewElementSectionTitle
        {...props}
        title="Blockchain"
        id="anchor-blockchain"
      />
      <OverviewElementSectionHeadingTitle
        {...props}
        title="Crypto Exchange"
        icon={<MiscCryptoExchangeIcon fontSize="small" />}
        id="anchor-crypto-exchange"
      />
      <Typography variant="body1" gutterBottom>
        Text
      </Typography>
      <OverviewElementSectionHeadingTitle
        {...props}
        title="Ride Contract Service"
        icon={<MiscRideContractServiceIcon fontSize="small" />}
        id="anchor-ride-contract-service"
      />
      <Typography variant="body1" gutterBottom>
        Text
      </Typography>
    </>
  );
}
