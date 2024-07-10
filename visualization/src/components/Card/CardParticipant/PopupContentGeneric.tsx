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
import ModalData from '@components/Modal/ModalData';
// > Misc
import {SpectatorId} from '@misc/spectatorIds';
// Type imports
import type {
  DataModalInformation,
  DataOrigin,
} from '@components/Modal/ModalData';
import type {ReactElement, ReactNode} from 'react';
import type {ButtonChangeSpectatorProps} from '@components/Button/ButtonChangeSpectator';

export interface DataElement {
  label: string;
  content: ReactNode;
  /** Information about who can see this data besides the owner */
  dataAccessInformation: DataModalInformation[];
}

export interface RenderDataElementProps
  extends ButtonChangeSpectatorProps,
    DataOrigin {
  /** The rendered information */
  element: Readonly<DataElement>;
  id: string;
  /** The data owner information element */
  dataOriginInformation?: ReactElement;
  /** Lists all entities that have in some way access to this information */
  dataAccessInformation: Array<DataModalInformation>;
}

export function RenderDataElement(props: RenderDataElementProps) {
  const {
    element,
    stateSpectatorId,
    id,
    dataOriginId,
    dataOriginName,
    dataOriginIcon,
    dataOriginInformation,
    dataAccessInformation,
  } = props;

  const [stateOpen, setStateOpen] = useState(false);

  const dataAccessDataModal: Array<DataModalInformation> = useMemo(
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
  // TODO If spectatorId in data access is a pseudonym this is not resolved in here!
  if (
    stateSpectatorId !== SpectatorId.EVERYTHING &&
    !dataAccessDataModal.some(
      a =>
        a.spectatorId === stateSpectatorId &&
        (a.accessType === 'local_storage' ||
          a.accessType === 'transitive' ||
          a.accessType === 'owner')
    )
  ) {
    content = '******';
    tooltip = 'The current spectator can`t see this data, click to learn more';
  }
  const dataValue = (
    <Tooltip
      key={`render-data-element-tooltip-${id}`}
      title={tooltip}
      onClick={() => setStateOpen(true)}
      arrow
    >
      <Typography
        variant="body2"
        display="inline"
        component="span"
        noWrap
        gutterBottom
      >
        {content}
      </Typography>
    </Tooltip>
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
        component="span"
        style={{
          margin: 0,
          overflowWrap: 'break-word',
        }}
      >
        <Box fontWeight="medium" display="inline">
          {element.label}:{' '}
        </Box>
        {dataValue}
        <ModalData
          {...props}
          key={element.label}
          stateDataModalOpen={stateOpen}
          setStateDataModalOpen={setStateOpen}
          stateDataModalContent={dataAccessDataModal}
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
    spectatorId: SpectatorId.AUTHENTICATION_SERVICE,
    spectatorInformation: <ServiceAuthentication intlValues={{}} />,
  },
  {
    accessType: 'none',
    description:
      'Only knows the participants pseudonym but no personal information',
    icon: <ServiceMatchingIcon />,
    name: 'Matching Service',
    spectatorId: SpectatorId.MATCHING_SERVICE,
    spectatorInformation: <ServiceMatching intlValues={{}} />,
  },
  {
    accessType: 'none',
    description: 'This data is not publicly available',
    icon: <SpectatorPublicIcon />,
    name: 'Public',
    spectatorId: SpectatorId.PUBLIC,
    spectatorInformation: (
      <Typography variant="body1" gutterBottom>
        TODO Add spectator section to overview
      </Typography>
    ),
  },
];
