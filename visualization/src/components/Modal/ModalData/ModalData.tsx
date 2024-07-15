// Package imports
import {memo, useMemo} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {
  Box,
  Chip,
  Divider,
  List,
  ListSubheader,
  Typography,
} from '@mui/material';
// Local imports
// > Components
import {DataHiddenIcon, DataVisibleIcon} from '@components/Icons';
import DataModelListElement from './ModalDataElement';
import GenericModal from '@components/Modal/ModalGeneric';
// > Misc
import {debugComponentRender, debugMemoHelper} from '@misc/debug';
// Type imports
import type {
  ModalDataInformation,
  ModalDataInformationAccessType,
} from './ModalDataInformation';
import type {ReactElement, ReactNode} from 'react';
import type {ReactSetState, ReactState} from '@misc/react';
import type {ButtonChangeSpectatorProps} from '@components/Input/InputButton/InputButtonSpectatorChange';

export interface ModalDataPropsSetStates {
  setStateDataModalOpen: ReactSetState<boolean>;
}

export interface ModalDataProps
  extends ModalDataPropsSetStates,
    ButtonChangeSpectatorProps,
    DataOrigin {
  stateDataModalOpen: ReactState<boolean>;
  /** Lists all entities that have in some way access to this information */
  stateDataModalContent: ReactState<Array<ModalDataInformation>>;
  /** The data label */
  dataLabel: string;
  /** The data value element */
  dataValue: ReactNode;
  /** The data value element as rendered by the current spectator */
  dataValueSpectator: ReactNode;
}

export interface DataOrigin {
  /** The data owner icon */
  dataOriginIcon: ReactElement;
  /** The data owner ID */
  dataOriginId: string;
  /** The data owner name */
  dataOriginName: string;
}

export default memo(ModalData, (prev, next) =>
  debugMemoHelper('ModalData', undefined, prev, next)
);

/** Modal that showcases data access and ownership */
export function ModalData(props: ModalDataProps) {
  debugComponentRender('ModalData');
  const {
    stateSpectatorId,
    stateDataModalOpen,
    stateDataModalContent,
    setStateDataModalOpen,
    dataLabel,
    dataOriginName,
    dataOriginIcon,
    dataValueSpectator,
  } = props;
  const intl = useIntl();
  const listInformation = useMemo<
    Array<[string, ModalDataInformationAccessType]>
  >(
    () => [
      [intl.formatMessage({id: 'data.access.owner'}), 'owner'],
      [intl.formatMessage({id: 'data.access.localStorage'}), 'local_storage'],
      [intl.formatMessage({id: 'data.access.transitive'}), 'transitive'],
      [intl.formatMessage({id: 'data.access.none'}), 'none'],
    ],
    [intl]
  );
  // TODO: Add Button to show the data if hidden!
  const dataValueHidden = dataValueSpectator === '******';
  return (
    <GenericModal
      setStateModalOpen={setStateDataModalOpen}
      stateModalOpen={stateDataModalOpen}
    >
      <Typography
        variant="h5"
        sx={{
          color: theme => (theme.palette.mode === 'dark' ? 'white' : undefined),
        }}
        gutterBottom
      >
        Who can see {dataLabel} from{' '}
        <Chip
          icon={dataOriginIcon}
          label={dataOriginName}
          color="primary"
          onClick={() => {}}
        />
        ?
      </Typography>
      <Box
        sx={{
          color: theme => (theme.palette.mode === 'dark' ? 'white' : undefined),
          margin: '1rem',
        }}
      >
        {dataValueSpectator}
      </Box>
      <Chip
        icon={dataValueHidden ? <DataHiddenIcon /> : <DataVisibleIcon />}
        color={dataValueHidden ? 'error' : 'success'}
        label={`${
          dataValueHidden ? 'Hidden' : 'Visible'
        } for ${stateSpectatorId}`}
      />
      <Divider sx={{paddingTop: '1rem'}} />
      {listInformation.map(([title, accessType]) => {
        const elements = stateDataModalContent.filter(
          a => a.accessType === accessType
        );
        if (elements.length === 0) {
          return undefined;
        }
        return (
          <List
            key={`data-modal-${accessType}-${title}-${dataOriginName}`}
            sx={{
              bgcolor: 'background.paper',
              width: '100%',
            }}
            component="nav"
            aria-labelledby="nested-list-subheader-owner"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader-owner">
                {title}:
              </ListSubheader>
            }
          >
            {elements.map(a => (
              <DataModelListElement
                {...props}
                key={`data-modal-${accessType}-${a.name}-${dataOriginName}`}
                stateDataModalContentElement={a}
              />
            ))}
          </List>
        );
      })}
    </GenericModal>
  );
}
