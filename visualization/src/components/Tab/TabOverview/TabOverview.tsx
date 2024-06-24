'use client';

// Package imports
import {useIntl} from 'react-intl';
import {useState} from 'react';
// > Components
import {Card, CardContent, Divider, Typography} from '@mui/material';
// Local imports
// > Components
import {
  Blockchain,
  Other,
  Participants,
  Services,
  Stakeholders,
} from './Elements';
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
// > Globals
import {getacar} from '@globals/defaults/urls';
// Type imports
import type {
  SettingsOverviewProps,
  SettingsUiProps,
} from '@misc/props/settings';
import type {ImageModalProps} from '@components/Modal/ImageModal';
import type {ReactElement} from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TabOverviewProps
  extends SettingsOverviewProps,
    SettingsUiProps {}

// eslint-disable-next-line no-empty-pattern
export default function TabOverview(propsInput: TabOverviewProps) {
  const {stateSettingsUiGridSpacing} = propsInput;
  const intl = useIntl();
  const [stateImgModalOpen, setStateImgModalOpen] = useState(false);
  const [stateImgUrl, setStateImgUrl] = useState<string | undefined>(undefined);
  const [stateImgBg, setStateImgBg] = useState<string | undefined>(undefined);
  const [stateImgAlt, setStateImgAlt] = useState<string | undefined>(undefined);
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

  const intlValues: {[key: string]: ReactElement} = {
    AUTH_SERVICE: <ChipListElement {...authServiceChip} noDescription={true} />,
    CUSTOMER: <ChipListElement {...customerChip} noDescription={true} />,
    CUSTOMERS: <ChipListElement {...customersChip} noDescription={true} />,
    GETACAR: (
      <Link href={getacar}>{intl.formatMessage({id: 'getacar.name'})}</Link>
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

  const props: TabOverviewProps &
    OverviewElementImageProps &
    OverviewElementProps &
    ImageModalProps = {
    ...propsInput,
    intlValues,
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

  return (
    <TabContainer>
      <Card
        sx={{
          marginBottom: `${stateSettingsUiGridSpacing / 2}rem`,
          marginTop: `${stateSettingsUiGridSpacing / 2}rem`,
        }}
      >
        <CardContent>
          <Typography variant="h4" gutterBottom>
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
          <Stakeholders {...props} />
          <Participants {...props} />
          <Services {...props} />
          <Blockchain {...props} />
          <Other {...props} />
        </CardContent>
      </Card>
      <ImageModal {...props} />
    </TabContainer>
  );
}
