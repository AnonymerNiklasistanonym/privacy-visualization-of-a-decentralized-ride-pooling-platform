// Package imports
import {useCallback, useMemo} from 'react';
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
// > Misc
import {SpectatorId} from '@misc/spectatorIds';
// Type imports
import type {
  ModalDataInformationAccess,
  ModalDataInformationOrigin,
} from '@components/Modal/ModalData';
import type {ReactElement, ReactNode} from 'react';
import type {ButtonChangeSpectatorProps} from '@components/Input/InputButton/InputButtonSpectatorChange';
import type {GlobalPropsModalDataInformation} from '@misc/props/global';

export interface DataElement {
  label: string;
  content: ReactNode;
  /** Information about who can see this data besides the owner */
  dataAccessInformation: ModalDataInformationAccess[];
}

export interface RenderDataElementProps
  extends ButtonChangeSpectatorProps,
    ModalDataInformationOrigin,
    GlobalPropsModalDataInformation {
  /** The rendered information */
  element: Readonly<DataElement>;
  id: string;
  /** The data owner information element */
  dataOriginInformation?: ReactElement;
  /** Lists all entities that have in some way access to this information */
  dataAccessInformation: Array<ModalDataInformationAccess>;
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
    setStateOpenModalData,
    setStateDataModalInformation,
  } = props;

  const dataAccessDataModal: Array<ModalDataInformationAccess> = useMemo(
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

  const [content, tooltip] = useMemo<[ReactNode | string, string]>(() => {
    let contentTemp = element.content;
    let tooltipTemp = '';
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
      contentTemp = '******';
      tooltipTemp =
        'The current spectator can`t see this data, click to learn more';
    }

    return [contentTemp, tooltipTemp];
  }, [dataAccessDataModal, element.content, stateSpectatorId]);

  const openDataModalCallback = useCallback(() => {
    setStateOpenModalData(true);
    setStateDataModalInformation({
      dataLabel: element.label,
      dataValue: element.content,
      dataValueSpectator: content,
      informationAccess: dataAccessDataModal,
      informationOrigin: {
        dataOriginIcon,
        dataOriginId,
        dataOriginName,
      },
    });
  }, [
    setStateOpenModalData,
    setStateDataModalInformation,
    element.label,
    element.content,
    content,
    dataAccessDataModal,
    dataOriginIcon,
    dataOriginId,
    dataOriginName,
  ]);

  const dataValue = useMemo<ReactElement>(
    () => (
      <Tooltip key={`render-data-element-tooltip-${id}`} title={tooltip} arrow>
        <Typography
          variant="body2"
          display="inline"
          component="span"
          gutterBottom
        >
          {content}
        </Typography>
      </Tooltip>
    ),
    [content, id, tooltip]
  );

  // TODO Convert data modal to single global modal!

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
        onClick={openDataModalCallback}
      >
        <Box fontWeight="medium" display="inline">
          {element.label}:{' '}
        </Box>
        {dataValue}
      </Typography>
    </ListItem>
  );
}

// TODO Fix this
export const dataModalInformationPersonalData: ModalDataInformationAccess[] = [
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
