// Package imports
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {Box, ListItem, Tooltip, Typography} from '@mui/material';
// Local imports
// > Components
import {ServiceAuthentication, ServiceMatching} from '@components/Tab/TabGuide';
import {
  ServiceAuthenticationIcon,
  ServiceMatchingIcon,
  SpectatorPublicIcon,
} from '@components/Icons';
// > Misc
import {SpectatorId} from '@misc/spectatorIds';
// Type imports
import type {
  GlobalPropsModalDataInformation,
  GlobalPropsSpectatorMap,
  GlobalPropsSpectatorSelectedElements,
} from '@misc/props/global';
import type {
  ModalDataInformationAccess,
  ModalDataInformationOrigin,
} from '@components/Modal/ModalData';
import type {InputButtonSpectatorChangeProps} from '@components/Input/InputButton/InputButtonSpectatorChange';
import type {ReactElement} from 'react';

export interface DataAccessElementInfo {
  /** Name of the data */
  label: string;
  /** The rendered content */
  content: string | number | ReactElement;
  /** Lists all entities that have in some way access to this information */
  dataAccessInformation: Array<ModalDataInformationAccess>;
}

export interface DataAccessElementProps
  extends GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorMap,
    GlobalPropsModalDataInformation {}

export interface DataAccessElementPropsInput
  extends DataAccessElementProps,
    ModalDataInformationOrigin,
    DataAccessElementInfo {
  /** Only used for the element key */
  id: string;
  // TODO Check if this is still necessary
  /** In case the ID is a pseudonym */
  isPseudonym?: boolean;
  /** The data owner information element */
  dataOriginInformation?: ReactElement;
}

export const dataHidden = '******';

export default memo(DataAccessElement);

export function DataAccessElement(props: DataAccessElementPropsInput) {
  const {
    label,
    content,
    stateSpectatorId,
    id,
    dataOriginId,
    dataOriginName,
    dataOriginIcon,
    dataOriginInformation,
    dataAccessInformation,
    stateOpenModalData,
    setStateOpenModalData,
    setStateDataModalInformation,
    stateSpectators,
  } = props;

  const intl = useIntl();

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

  const [contentFinal, tooltip] = useMemo<
    [string | ReactElement, string]
  >(() => {
    let contentTemp =
      typeof content === 'string'
        ? content
        : typeof content === 'number'
          ? `${content}`
          : content;
    let tooltipTemp = '';
    const spectator = stateSpectators.get(stateSpectatorId);
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
      contentTemp = dataHidden;
      tooltipTemp = intl.formatMessage(
        {id: 'data.access.message.currentSpectatorCantSeeData'},
        {
          data: label,
          name:
            spectator?.name !== undefined
              ? `${spectator?.name} (${stateSpectatorId})`
              : stateSpectatorId,
        }
      );
    }

    return [contentTemp, tooltipTemp];
  }, [
    content,
    stateSpectators,
    stateSpectatorId,
    dataAccessDataModal,
    intl,
    label,
  ]);

  const [stateDataModalOpened, setStateDataModalOpened] = useState(false);

  /** In case that the data modal is called on this data access element make not of that */
  const openDataModalCallback = useCallback(() => {
    setStateOpenModalData(true);
    setStateDataModalOpened(true);
  }, [setStateOpenModalData]);

  useEffect(() => {
    // In case that the data modal is closed make sure that the constant data updates are disabled
    if (stateOpenModalData === false) {
      setStateDataModalOpened(false);
    }
  }, [stateOpenModalData]);

  useEffect(() => {
    // In case that the data modal is opened on this data access element constantly update the information
    if (stateDataModalOpened) {
      setStateDataModalInformation({
        dataLabel: label,
        dataValue: content,
        dataValueSpectator: contentFinal,
        informationAccess: dataAccessDataModal,
        informationOrigin: {
          dataOriginIcon,
          dataOriginId,
          dataOriginName,
        },
      });
    }
  }, [
    content,
    dataAccessDataModal,
    dataOriginIcon,
    dataOriginId,
    dataOriginName,
    label,
    setStateDataModalInformation,
    stateDataModalOpened,
    contentFinal,
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
          {contentFinal}
        </Typography>
      </Tooltip>
    ),
    [contentFinal, id, tooltip]
  );

  return (
    <ListItem
      key={label}
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
        onClick={
          typeof contentFinal === 'string' ? openDataModalCallback : undefined
        }
      >
        <Box
          fontWeight="medium"
          display="inline"
          onClick={
            typeof contentFinal !== 'string' ? openDataModalCallback : undefined
          }
        >
          {label}:{' '}
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
