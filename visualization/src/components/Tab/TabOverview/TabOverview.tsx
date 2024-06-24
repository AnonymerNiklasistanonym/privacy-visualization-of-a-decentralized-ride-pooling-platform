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
  ImageBox,
  OverviewElementImageProps,
  OverviewElementProps,
  OverviewElementSectionContent,
  OverviewElementSectionTitle,
} from './TabOverviewElements';
import ImageModal from '@components/Modal/ImageModal';
import TabContainer from '../TabContainer';
// Type imports
import type {
  SettingsOverviewProps,
  SettingsUiProps,
} from '@misc/props/settings';
import type {GlobalPropsIntlValues} from '@misc/props/global';
import type {ImageModalProps} from '@components/Modal/ImageModal';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TabOverviewProps
  extends SettingsOverviewProps,
    SettingsUiProps,
    GlobalPropsIntlValues {}

// eslint-disable-next-line no-empty-pattern
export default function TabOverview(propsInput: TabOverviewProps) {
  const {intlValues, stateSettingsUiGridSpacing} = propsInput;
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
            {intl.formatMessage({id: 'project.description'}, intlValues)}.
          </Typography>
          <Typography variant="body1">
            {intl.formatMessage(
              {id: 'page.home.tab.overview.section.sources'},
              intlValues
            )}
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
