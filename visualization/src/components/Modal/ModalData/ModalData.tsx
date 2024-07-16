// Package imports
import {memo, useMemo} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {
  Box,
  Chip,
  CircularProgress,
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
import type {ReactSetState, ReactState} from '@misc/react';
import type {ButtonChangeSpectatorProps} from '@components/Input/InputButton/InputButtonSpectatorChange';
import type {ReactNode} from 'react';

export type ModalDataProps = ButtonChangeSpectatorProps;

export interface ModalDataPropsInput extends ModalDataProps {
  /** The open state of the modal */
  stateDataModalOpen: ReactState<boolean>;
  /** Set the open state of the modal */
  setStateDataModalOpen: ReactSetState<boolean>;
  /** The information that the modal should render */
  stateDataModalInformation: ReactState<undefined | ModalDataInformation>;
}

export default memo(ModalData, (prev, next) =>
  debugMemoHelper('ModalData', undefined, prev, next)
);

/** Modal that showcases data access and ownership */
export function ModalData(props: ModalDataPropsInput) {
  debugComponentRender('ModalData');
  const {
    stateSpectatorId,
    stateDataModalOpen,
    stateDataModalInformation,
    setStateDataModalOpen,
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

  // Either a loading icon or the content
  const content = useMemo<ReactNode>(() => {
    if (stateDataModalInformation?.dataLabel === undefined) {
      return (
        <Box
          key="modal-data-content-loading"
          sx={{display: 'flex', width: '100%'}}
          justifyContent="center"
        >
          <CircularProgress />
        </Box>
      );
    }
    const dataValueHidden =
      stateDataModalInformation.dataValueSpectator === '******';

    return (
      <>
        <Typography
          variant="h5"
          sx={{
            color: theme =>
              theme.palette.mode === 'dark' ? 'white' : undefined,
          }}
          gutterBottom
        >
          Who can see {stateDataModalInformation.dataLabel} from{' '}
          <Chip
            icon={stateDataModalInformation.informationOrigin.dataOriginIcon}
            label={stateDataModalInformation.informationOrigin.dataOriginName}
            color="primary"
            onClick={() => {}}
          />
          ?
        </Typography>
        <Box
          sx={{
            color: theme =>
              theme.palette.mode === 'dark' ? 'white' : undefined,
            margin: '1rem',
          }}
        >
          {stateDataModalInformation.dataValueSpectator}
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
          const elements = stateDataModalInformation.informationAccess.filter(
            a => a.accessType === accessType
          );
          if (elements.length === 0) {
            return undefined;
          }
          return (
            <List
              key={`data-modal-${accessType}-${title}-${stateDataModalInformation.informationOrigin.dataOriginName}`}
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
                  key={`data-modal-${accessType}-${a.name}-${stateDataModalInformation.informationOrigin.dataOriginName}`}
                  stateDataModalContentElement={a}
                />
              ))}
            </List>
          );
        })}
      </>
    );
  }, [
    listInformation,
    props,
    stateDataModalInformation?.dataLabel,
    stateDataModalInformation?.dataValueSpectator,
    stateDataModalInformation?.informationAccess,
    stateDataModalInformation?.informationOrigin.dataOriginIcon,
    stateDataModalInformation?.informationOrigin.dataOriginName,
    stateSpectatorId,
  ]);

  return (
    <GenericModal
      setStateModalOpen={setStateDataModalOpen}
      stateModalOpen={stateDataModalOpen}
    >
      {content}
    </GenericModal>
  );
}
