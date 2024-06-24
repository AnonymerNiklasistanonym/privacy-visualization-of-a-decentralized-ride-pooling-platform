// Package imports
import {useMemo, useState} from 'react';
// > Components
import {Box, ListItem, Tooltip, Typography} from '@mui/material';
// Local imports
// > Components
import {
  ServiceAuthentication,
  ServiceMatching,
} from '@components/Tab/TabOverview/Elements';
import {
  ServiceAuthenticationIcon,
  ServiceMatchingIcon,
  SpectatorPublicIcon,
} from '@components/Icons';
import DataModal from '@components/Modal/DataModal';
// Type imports
import type {ReactElement, ReactNode} from 'react';
import type {ChangeViewButtonProps} from '@components/Button/ChangeViewButton';
import type {DataModalInformation} from '@components/Modal/DataModal';

export interface ShowContentSpectatorElement {
  spectator: string;
  description: string;
}

export interface DataElement {
  label: string;
  content: ReactNode;
  /** Show content only for the specified spectators. */
  showContentSpectator: ShowContentSpectatorElement[];
  /** Information about who can see this data besides the owner */
  dataAccessInformation: DataModalInformation[];
}

export interface RenderDataElementProps extends ChangeViewButtonProps {
  element: Readonly<DataElement>;
  id: string;
  dataOriginId: string;
  dataOriginName: string;
  dataOriginIcon: ReactElement;
  dataOriginInformation?: ReactElement;
  dataAccessInformation: Array<DataModalInformation>;
}

export function RenderDataElement(props: RenderDataElementProps) {
  const {
    element,
    stateSpectator,
    id,
    dataOriginId,
    dataOriginName,
    dataOriginIcon,
    dataOriginInformation,
    dataAccessInformation,
  } = props;

  const [stateOpen, setStateOpen] = useState(false);

  const dataModalContent: Array<DataModalInformation> = useMemo(
    () => [
      {
        accessType: 'owner',
        description: 'Owns this data',
        icon: dataOriginIcon,
        name: dataOriginName,
        spectatorId: dataOriginId,
        spectatorInformation: dataOriginInformation,
      },
      ...dataAccessInformation,
    ],
    [
      dataAccessInformation,
      dataOriginIcon,
      dataOriginId,
      dataOriginInformation,
      dataOriginName,
    ]
  );

  let content = element.content;
  let tooltip = '';
  if (
    stateSpectator !== id &&
    stateSpectator !== 'everything' &&
    !element.showContentSpectator.some(a => a.spectator === stateSpectator)
  ) {
    content = '******';
    tooltip = 'The current spectator can`t see this data, click to learn more';
  }
  const dataValue = (
    <>
      <Tooltip title={tooltip} onClick={() => setStateOpen(true)} arrow>
        <Typography variant="body2" display="inline" noWrap gutterBottom>
          {content}
        </Typography>
      </Tooltip>
    </>
  );
  return (
    <ListItem
      key={element.label}
      style={{
        paddingTop: 4,
      }}
      disablePadding
    >
      <Typography
        variant="body2"
        gutterBottom
        style={{
          margin: 0,
          overflowWrap: 'break-word',
        }}
      >
        <Box fontWeight="medium" display="inline">
          {element.label}:{' '}
        </Box>
        {dataValue}
        <DataModal
          {...props}
          key={element.label}
          stateDataModalOpen={stateOpen}
          setStateDataModalOpen={setStateOpen}
          stateDataModalContent={dataModalContent}
          dataLabel={element.label}
          dataValue={element.content}
          dataValueSpectator={content}
        />
      </Typography>
    </ListItem>
  );
}

// TODO Fix this
export const dataModalInformationPersonalData: DataModalInformation[] = [
  {
    accessType: 'local_storage',
    description:
      'Stores it locally to prevent multiple accounts and to contact this participant',
    icon: <ServiceAuthenticationIcon />,
    name: 'Authentication Service',
    spectatorId: 'auth',
    spectatorInformation: <ServiceAuthentication intlValues={{}} />,
  },
  {
    accessType: 'none',
    description:
      'Only knows the participants pseudonym but no personal information',
    icon: <ServiceMatchingIcon />,
    name: 'Matching Service',
    spectatorId: 'match',
    spectatorInformation: <ServiceMatching intlValues={{}} />,
  },
  {
    accessType: 'none',
    description: 'This data is not publicly available',
    icon: <SpectatorPublicIcon />,
    name: 'Public',
    spectatorId: 'public',
    spectatorInformation: (
      <Typography variant="body1" gutterBottom>
        TODO Add spectator section to overview
      </Typography>
    ),
  },
];
