// Package imports
import {useIntl} from 'react-intl';
// > Components
import {Typography} from '@mui/material';
// Local imports
import {
  ChipList,
  OverviewElementSectionHeadingTitle,
  OverviewElementSectionTitle,
} from './TabGuideElements';
// > Icons
import {
  MiscCryptoExchangeIcon,
  MiscGetACarFoundationIcon,
  MiscRideContractServiceIcon,
  ParticipantCustomerIcon,
  ParticipantRideProviderIcon,
  ServiceAuthenticationIcon,
  ServiceMatchingIcon,
  SpectatorPublicIcon,
} from '@components/Icons';
// Type imports
import type {OverviewElementProps} from './TabGuideElements';

export function Stakeholders(props: OverviewElementProps) {
  const intl = useIntl();
  return (
    <>
      <OverviewElementSectionTitle {...props} id="anchor-stackeholders">
        {intl.formatMessage({
          id: 'page.home.tab.guide.section.stakeholders.title',
        })}
      </OverviewElementSectionTitle>
      <Typography variant="body1" gutterBottom>
        {intl.formatMessage({
          id: 'page.home.tab.guide.section.stakeholders.participants.title',
        })}
      </Typography>
      <ChipList
        elements={[
          {
            description: intl.formatMessage({
              id: 'getacar.participant.customer.description',
            }),
            icon: <ParticipantCustomerIcon />,
            label: intl.formatMessage({
              id: 'getacar.participant.customer',
            }),
            link: '#anchor-customer',
          },
          {
            description: intl.formatMessage({
              id: 'getacar.participant.rideProvider.description',
            }),
            icon: <ParticipantRideProviderIcon />,
            label: intl.formatMessage({
              id: 'getacar.participant.rideProvider',
            }),
            link: '#anchor-ride-provider',
          },
        ]}
      />
      <Typography variant="body1" gutterBottom>
        {intl.formatMessage({
          id: 'page.home.tab.guide.section.stakeholders.services.title',
        })}
      </Typography>
      <ChipList
        elements={[
          {
            description: intl.formatMessage({
              id: 'getacar.service.auth.description',
            }),
            icon: <ServiceAuthenticationIcon />,
            label: intl.formatMessage({
              id: 'getacar.service.auth',
            }),
            link: '#anchor-as',
          },
          {
            description: intl.formatMessage({
              id: 'getacar.service.match.description',
            }),
            icon: <ServiceMatchingIcon />,
            label: intl.formatMessage({
              id: 'getacar.service.match',
            }),
            link: '#anchor-ms',
          },
        ]}
      />
      <Typography variant="body1" gutterBottom>
        {intl.formatMessage({
          id: 'page.home.tab.guide.section.stakeholders.blockchain.title',
        })}
      </Typography>
      <ChipList
        elements={[
          {
            description: intl.formatMessage({
              id: 'getacar.blockchain.cryptoExchange.description',
            }),
            icon: <MiscCryptoExchangeIcon />,
            label: intl.formatMessage({
              id: 'getacar.blockchain.cryptoExchange',
            }),
            link: '#anchor-crypto-exchange',
          },
          {
            description: intl.formatMessage({
              id: 'getacar.blockchain.rideContractService.description',
            }),
            icon: <MiscRideContractServiceIcon />,
            label: intl.formatMessage({
              id: 'getacar.blockchain.rideContractService',
            }),
            link: '#anchor-ride-provider',
          },
        ]}
      />
      <Typography variant="body1" gutterBottom>
        {intl.formatMessage({
          id: 'page.home.tab.guide.section.stakeholders.other.title',
        })}
      </Typography>
      <ChipList
        elements={[
          {
            description: intl.formatMessage({
              id: 'getacar.foundation.description',
            }),
            icon: <MiscGetACarFoundationIcon />,
            label: intl.formatMessage({
              id: 'getacar.foundation',
            }),
            link: '#anchor-getacar-foundation',
          },
        ]}
      />
    </>
  );
}

export function Participants(props: OverviewElementProps) {
  const intl = useIntl();
  return (
    <>
      <OverviewElementSectionTitle {...props} id="anchor-participants">
        {intl.formatMessage({
          id: 'page.home.tab.guide.section.participants.title',
        })}
      </OverviewElementSectionTitle>
      <ParticipantsCustomer {...props} />
      <ParticipantsRideProvider {...props} />
    </>
  );
}

export function ParticipantsCustomer(props: OverviewElementProps) {
  const intl = useIntl();
  return (
    <>
      <OverviewElementSectionHeadingTitle
        {...props}
        icon={<ParticipantCustomerIcon fontSize="small" />}
        id="anchor-customer"
      >
        {intl.formatMessage({
          id: 'getacar.participant.customer',
        })}
      </OverviewElementSectionHeadingTitle>
      <Typography variant="body1" gutterBottom>
        {intl.formatMessage({
          id: 'page.home.tab.guide.section.customer.content',
        })}
      </Typography>
    </>
  );
}

export function ParticipantsRideProvider(props: OverviewElementProps) {
  const intl = useIntl();
  return (
    <>
      <OverviewElementSectionHeadingTitle
        {...props}
        icon={<ParticipantRideProviderIcon fontSize="small" />}
        id="anchor-ride-provider"
      >
        {intl.formatMessage({
          id: 'getacar.participant.rideProvider',
        })}
      </OverviewElementSectionHeadingTitle>
      <Typography variant="body1" gutterBottom>
        {intl.formatMessage({
          id: 'page.home.tab.guide.section.rideProvider.content',
        })}
      </Typography>
    </>
  );
}

export function Services(props: OverviewElementProps) {
  const intl = useIntl();
  return (
    <>
      <OverviewElementSectionTitle {...props} id="anchor-services">
        {intl.formatMessage({
          id: 'page.home.tab.guide.section.services.title',
        })}
      </OverviewElementSectionTitle>
      <ServiceAuthentication {...props} />
      <ServiceMatching {...props} />
    </>
  );
}

export function ServiceAuthentication(props: OverviewElementProps) {
  const intl = useIntl();
  return (
    <>
      <OverviewElementSectionHeadingTitle
        {...props}
        icon={<ServiceAuthenticationIcon fontSize="small" />}
        id="anchor-as"
      >
        {intl.formatMessage({
          id: 'getacar.service.auth',
        })}
        Authentication Service
      </OverviewElementSectionHeadingTitle>
      <Typography variant="body1" gutterBottom>
        {intl.formatMessage({
          id: 'page.home.tab.guide.section.as.content',
        })}
      </Typography>
    </>
  );
}

export function ServiceMatching(props: OverviewElementProps) {
  const {intlValues} = props;
  const intl = useIntl();
  return (
    <>
      <OverviewElementSectionHeadingTitle
        {...props}
        icon={<ServiceMatchingIcon fontSize="small" />}
        id="anchor-ms"
      >
        {intl.formatMessage({
          id: 'getacar.service.match',
        })}
      </OverviewElementSectionHeadingTitle>
      <Typography variant="body1" gutterBottom>
        {intl.formatMessage(
          {
            id: 'page.home.tab.guide.section.ms.content',
          },
          intlValues
        )}
      </Typography>
    </>
  );
}

export function Public(props: OverviewElementProps) {
  const {intlValues} = props;
  const intl = useIntl();
  return (
    <>
      <OverviewElementSectionHeadingTitle
        {...props}
        icon={<SpectatorPublicIcon fontSize="small" />}
        id="anchor-ms"
      >
        {intl.formatMessage({
          id: 'getacar.spectator.public',
        })}
      </OverviewElementSectionHeadingTitle>
      <Typography variant="body1" gutterBottom>
        {intl.formatMessage(
          {
            id: 'page.home.tab.guide.section.public.content',
          },
          intlValues
        )}
      </Typography>
    </>
  );
}

export function Blockchain(props: OverviewElementProps) {
  const {intlValues} = props;
  const intl = useIntl();
  return (
    <>
      <OverviewElementSectionTitle {...props} id="anchor-blockchain">
        {intl.formatMessage({
          id: 'page.home.tab.guide.section.blockchain.title',
        })}
      </OverviewElementSectionTitle>
      <OverviewElementSectionHeadingTitle
        {...props}
        icon={<MiscCryptoExchangeIcon fontSize="small" />}
        id="anchor-crypto-exchange"
      >
        {intl.formatMessage({
          id: 'getacar.blockchain.cryptoExchange',
        })}
      </OverviewElementSectionHeadingTitle>
      <Typography variant="body1" component={'span'}>
        {intl.formatMessage(
          {
            id: 'page.home.tab.guide.section.cryptoExchange.content',
          },
          intlValues
        )}
      </Typography>
      <br />
      <Typography variant="body1" component={'span'}>
        {intl.formatMessage(
          {
            id: 'page.home.tab.guide.section.cryptoExchange.notes',
          },
          intlValues
        )}
      </Typography>
      <OverviewElementSectionHeadingTitle
        {...props}
        icon={<MiscRideContractServiceIcon fontSize="small" />}
        id="anchor-ride-contract-service"
      >
        {intl.formatMessage({
          id: 'getacar.blockchain.rideContractService',
        })}
      </OverviewElementSectionHeadingTitle>
      <Typography variant="body1" component={'span'}>
        {intl.formatMessage(
          {
            id: 'page.home.tab.guide.section.rideContractService.content',
          },
          intlValues
        )}
      </Typography>
    </>
  );
}

export function Other(props: OverviewElementProps) {
  const {intlValues} = props;
  const intl = useIntl();
  return (
    <>
      <OverviewElementSectionTitle {...props} id="other">
        {intl.formatMessage({
          id: 'page.home.tab.guide.section.other.title',
        })}
      </OverviewElementSectionTitle>
      <OverviewElementSectionHeadingTitle
        {...props}
        icon={<MiscGetACarFoundationIcon fontSize="small" />}
        id="anchor-getacar-foundation"
      >
        {intl.formatMessage({
          id: 'getacar.foundation',
        })}
      </OverviewElementSectionHeadingTitle>
      <Typography variant="body1" component={'span'}>
        {intl.formatMessage(
          {
            id: 'page.home.tab.guide.section.other.foundation.content',
          },
          intlValues
        )}
      </Typography>
    </>
  );
}
