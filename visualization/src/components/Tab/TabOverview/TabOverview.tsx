'use client';

// Package imports
import {useIntl} from 'react-intl';
import {useState} from 'react';
// > Components
import {Card, CardContent, Divider, Typography} from '@mui/material';
// Local imports
// > Components
import {Blockchain, Participants, Services, Stakeholders} from './Elements';
import {
  ChipListElement,
  ChipListElementProps,
  ImageBox,
  OverviewElementImageProps,
  OverviewElementProps,
  OverviewElementSectionContent,
  OverviewElementSectionTitle,
} from './TabOverviewElements';
import {
  ParticipantCustomerIcon,
  ParticipantRideProviderIcon,
  ServiceAuthenticationIcon,
  ServiceMatchingIcon,
} from '@components/Icons';
import ImageModal from '@components/Modal/ImageModal';
import Link from 'next/link';
import TabContainer from '../TabContainer';
// Type imports
import type {ImageModalProps} from '@components/Modal/ImageModal';
import type {SettingsOverviewProps} from '@misc/props/settings';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TabOverviewProps extends SettingsOverviewProps {}

// eslint-disable-next-line no-empty-pattern
export default function TabOverview(propsInput: TabOverviewProps) {
  const intl = useIntl();
  const [stateImgModalOpen, setStateImgModalOpen] = useState(false);
  const [stateImgUrl, setStateImgUrl] = useState<string | undefined>(undefined);
  const [stateImgBg, setStateImgBg] = useState<string | undefined>(undefined);
  const [stateImgAlt, setStateImgAlt] = useState<string | undefined>(undefined);
  const props: TabOverviewProps &
    OverviewElementImageProps &
    OverviewElementProps &
    ImageModalProps = {
    ...propsInput,
    setStateImgAlt,
    setStateImgBg,
    setStateImgModalOpen,
    setStateImgUrl,
    showTitle: true,
    stateImgAlt,
    stateImgBg,
    stateImgModalOpen,
    stateImgUrl,
  };
  const customerChip: ChipListElementProps = {
    description: 'requests rides (human)',
    icon: <ParticipantCustomerIcon />,
    label: intl.formatMessage({id: 'getacar.participant.customer'}),
    link: '#anchor-customer',
  };
  const customersChip: ChipListElementProps = {
    ...customerChip,
    label: intl.formatMessage({id: 'getacar.participant.customers'}),
  };
  const rideProviderChip: ChipListElementProps = {
    description: 'provides rides (human/autonomous vehicle)',
    icon: <ParticipantRideProviderIcon />,
    label: intl.formatMessage({id: 'getacar.participant.rideProvider'}),
    link: '#anchor-ride-provider',
  };
  const rideProvidersChip: ChipListElementProps = {
    ...customerChip,
    label: intl.formatMessage({id: 'getacar.participant.rideProviders'}),
  };
  const authServiceChip: ChipListElementProps = {
    icon: <ServiceAuthenticationIcon />,
    label: intl.formatMessage({id: 'getacar.service.auth'}),
    link: '#anchor-as',
  };
  const matchServiceChip: ChipListElementProps = {
    icon: <ServiceMatchingIcon />,
    label: intl.formatMessage({id: 'getacar.service.match'}),
    link: '#anchor-ms',
  };

  const intlValues = {
    AUTH_SERVICE: <ChipListElement {...authServiceChip} noDescription={true} />,
    CUSTOMER: <ChipListElement {...customerChip} noDescription={true} />,
    CUSTOMERS: <ChipListElement {...customersChip} noDescription={true} />,
    GETACAR: (
      <Link href="http://dx.doi.org/10.18419/opus-13788">
        {intl.formatMessage({id: 'getacar.name'})}
      </Link>
    ),
    MATCHING_SERVICE: (
      <ChipListElement {...matchServiceChip} noDescription={true} />
    ),
    RIDE_PROVIDER: (
      <ChipListElement {...rideProviderChip} noDescription={true} />
    ),
    RIDE_PROVIDERS: (
      <ChipListElement {...rideProvidersChip} noDescription={true} />
    ),
  };
  return (
    <TabContainer>
      <Card sx={{marginTop: {md: '1rem', sm: 0}}}>
        <CardContent>
          <Typography variant="h3" gutterBottom>
            {intl.formatMessage({id: 'project.name'}, intlValues)}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {intl.formatMessage({id: 'project.description'}, intlValues)}
          </Typography>
          <Divider style={{marginBottom: '1rem'}} />

          <OverviewElementSectionTitle {...props} id="anchor-summary">
            {intl.formatMessage(
              {
                id: 'page.home.tab.overview.section.summary.title',
              },
              intlValues
            )}
          </OverviewElementSectionTitle>
          <OverviewElementSectionContent>
            {intl.formatMessage(
              {
                id: 'page.home.tab.overview.section.summary.content',
              },
              intlValues
            )}
          </OverviewElementSectionContent>
          <ImageBox
            alt="TODO"
            url="./res/ride_pooling_platform_overview.svg"
            {...props}
          />
          <Typography variant="body1" gutterBottom>
            Platform Participants:
          </Typography>

          <Stakeholders showTitle={true} />
          <Participants showTitle={true} />
          <Services showTitle={true} />
          <Blockchain showTitle={true} />
          <Typography variant="subtitle1" gutterBottom>
            subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Quos blanditiis tenetur
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Quos blanditiis tenetur
          </Typography>
          <Typography variant="body1" gutterBottom>
            body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore
            consectetur, neque doloribus, cupiditate numquam dignissimos laborum
            fugiat deleniti? Eum quasi quidem quibusdam.
          </Typography>
          <Typography variant="body2" gutterBottom>
            body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore
            consectetur, neque doloribus, cupiditate numquam dignissimos laborum
            fugiat deleniti? Eum quasi quidem quibusdam.
          </Typography>
          <Typography variant="button" display="block" gutterBottom>
            button text
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            caption text
          </Typography>
          <Typography
            variant="overline"
            display="block"
            id="yourAnchorTag"
            gutterBottom
          >
            overline text
          </Typography>
          <Typography variant="body1" gutterBottom>
            body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore
            consectetur, neque doloribus, cupiditate numquam dignissimos laborum
            fugiat deleniti? Eum quasi quidem quibusdam.
          </Typography>
          <Typography variant="body2" gutterBottom>
            body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore
            consectetur, neque doloribus, cupiditate numquam dignissimos laborum
            fugiat deleniti? Eum quasi quidem quibusdam.
          </Typography>
        </CardContent>
      </Card>
      <ImageModal {...props} />
    </TabContainer>
  );
}
