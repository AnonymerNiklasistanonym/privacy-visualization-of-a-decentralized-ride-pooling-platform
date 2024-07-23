// Package imports
import {memo, useCallback, useMemo} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {
  Box,
  Chip,
  Divider,
  List,
  ListSubheader,
  Stack,
  Typography,
} from '@mui/material';
// Local imports
import {dataHidden} from '@components/DataAccessElement';
// > Components
import {DataHiddenIcon, DataVisibleIcon} from '@components/Icons';
import GenericModal from '@components/Modal/ModalGeneric';
import InputButtonSpectatorChange from '@components/Input/InputButton/InputButtonSpectatorChange';
import LoadingCircle from '@components/Loading/LoadingCircle';
import ModalDataElement from './ModalDataElement';
// > Misc
import {debugComponentRender, debugMemoHelper} from '@misc/debug';
import {SpectatorId} from '@misc/spectatorIds';
import {spectatorName} from '@misc/spectatorName';
// Type imports
import type {
  ModalDataInformation,
  ModalDataInformationAccessType,
} from './ModalDataInformation';
import type {ReactSetState, ReactState} from '@misc/react';
import type {GlobalPropsSpectatorMap} from '@misc/props/global';
import type {InputButtonSpectatorChangeProps} from '@components/Input/InputButton/InputButtonSpectatorChange';
import type {ModalDataListElementProps} from './ModalDataElement';
import type {ReactNode} from 'react';

export interface ModalDataProps
  extends InputButtonSpectatorChangeProps,
    GlobalPropsSpectatorMap {}

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
    stateSpectators,
    stateSpectatorId,
    stateDataModalOpen,
    stateDataModalInformation,
    setStateDataModalOpen,
    ...rest
  } = props;

  const propsDataModelListElement: ModalDataListElementProps = useMemo(
    () => ({
      ...rest,
      stateSpectatorId,
    }),
    [rest, stateSpectatorId]
  );

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

  const spectatorInfo = useMemo(() => {
    const spectator = stateSpectators.get(stateSpectatorId);
    return spectatorName(stateSpectatorId, name => name, spectator);
  }, [stateSpectatorId, stateSpectators]);

  const closeDataModalCallback = useCallback(() => {
    setStateDataModalOpen(false);
  }, [setStateDataModalOpen]);

  // Either a loading icon or the content
  const content = useMemo<ReactNode>(() => {
    if (stateDataModalInformation?.dataLabel === undefined) {
      return <LoadingCircle key="modal-data-content-loading" />;
    }
    const dataValueHidden =
      stateDataModalInformation.dataValueSpectator === dataHidden;

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
          {intl.formatMessage(
            {
              id: 'data.access.message.whoCanSee',
            },
            {
              name: stateDataModalInformation.dataLabel,
            }
          )}
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
          onClick={
            typeof stateDataModalInformation.dataValueSpectator !== 'string'
              ? closeDataModalCallback
              : undefined
          }
        >
          {stateDataModalInformation.dataValueSpectator}
        </Box>
        <Stack direction="row" spacing={2}>
          <Chip
            icon={dataValueHidden ? <DataHiddenIcon /> : <DataVisibleIcon />}
            color={dataValueHidden ? 'error' : 'success'}
            label={
              dataValueHidden
                ? intl.formatMessage(
                    {
                      id: 'data.access.message.hiddenFor',
                    },
                    {
                      name: spectatorInfo,
                    }
                  )
                : intl.formatMessage(
                    {
                      id: 'data.access.message.visibleFor',
                    },
                    {
                      name: spectatorInfo,
                    }
                  )
            }
          />
          <InputButtonSpectatorChange
            {...props}
            spectatorId={SpectatorId.EVERYTHING}
            label={intl.formatMessage({id: 'getacar.spectator.reset'})}
          />
        </Stack>
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
                <ModalDataElement
                  {...propsDataModelListElement}
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
    closeDataModalCallback,
    intl,
    listInformation,
    props,
    propsDataModelListElement,
    spectatorInfo,
    stateDataModalInformation?.dataLabel,
    stateDataModalInformation?.dataValueSpectator,
    stateDataModalInformation?.informationAccess,
    stateDataModalInformation?.informationOrigin.dataOriginIcon,
    stateDataModalInformation?.informationOrigin.dataOriginName,
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
