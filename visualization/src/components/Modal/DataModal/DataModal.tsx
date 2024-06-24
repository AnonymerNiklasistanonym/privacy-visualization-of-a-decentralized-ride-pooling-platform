// Package imports
import {memo} from 'react';
// > Components
import {
  Box,
  Chip,
  Divider,
  List,
  ListSubheader,
  Modal,
  Typography,
} from '@mui/material';
// Local imports
// > Components
import {DataHiddenIcon, DataVisibleIcon} from '@components/Icons';
import DataModelListElement from './DataModalElement';
// > Misc
import {debugComponentUpdate, debugMemoHelper} from '@misc/debug';
// Type imports
import type {
  DataModalInformation,
  DataModalInformationAccessType,
} from './DataModalInformation';
import type {ReactElement, ReactNode} from 'react';
import type {ReactSetState, ReactState} from '@misc/react';
import type {ChangeViewButtonProps} from '@components/Button/ChangeViewButton';
export interface DataModalPropsSetStates {
  setStateDataModalOpen: ReactSetState<boolean>;
}

export interface DataModalProps
  extends DataModalPropsSetStates,
    ChangeViewButtonProps {
  stateDataModalOpen: ReactState<boolean>;
  stateDataModalContent: ReactState<Array<DataModalInformation>>;
  dataLabel: string;
  dataValue: ReactNode;
  dataValueSpectator: ReactNode;
  dataOriginIcon: ReactElement;
  dataOriginId: string;
  dataOriginName: string;
}

export default memo(DataModal, (prev, next) =>
  debugMemoHelper(
    'DataModal',
    [
      'stateSpectator',
      'stateDataModalOpen',
      'stateDataModalContent',
      'dataLabel',
      'dataOriginName',
      'dataOriginIcon',
      'dataValueSpectator',
    ],
    prev,
    next
  )
);

export function DataModal(props: DataModalProps) {
  debugComponentUpdate('DataModal', true);
  const {
    stateSpectator,
    stateDataModalOpen,
    stateDataModalContent,
    setStateDataModalOpen,
    dataLabel,
    dataOriginName,
    dataOriginIcon,
    dataValueSpectator,
  } = props;
  const listInformation: ReadonlyArray<
    [string, DataModalInformationAccessType]
  > = [
    ['Data Owner', 'owner'],
    ['Stores this data', 'local_storage'],
    ['Can request this data', 'transitive'],
    ['Has no access', 'none'],
  ];
  // TODO: Add what data and from whom is inspected!
  // TODO: Make this better
  const dataValueHidden = dataValueSpectator === '******';
  return (
    <div>
      <Modal
        open={stateDataModalOpen}
        onClose={() => setStateDataModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          maxHeight: '90vh',
          overflow: 'scroll',
        }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            height: {
              md: '80vh',
              xs: '90%',
            },
            left: '50%',
            maxHeight: '90vh',
            maxWidth: 1200,
            p: 4,
            position: 'absolute' as const,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: {
              md: '80vw',
              xs: '100%',
            },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: theme =>
                theme.palette.mode === 'dark' ? 'white' : undefined,
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
              color: theme =>
                theme.palette.mode === 'dark' ? 'white' : undefined,
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
            } for ${stateSpectator}`}
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
              <>
                <List
                  sx={{
                    bgcolor: 'background.paper',
                    width: '100%',
                  }}
                  component="nav"
                  aria-labelledby="nested-list-subheader-owner"
                  subheader={
                    <ListSubheader
                      component="div"
                      id="nested-list-subheader-owner"
                    >
                      {title}:
                    </ListSubheader>
                  }
                >
                  {elements.map(a => (
                    <DataModelListElement
                      {...props}
                      key={`data-${accessType}-${a.name}`}
                      stateDataModalContentElement={a}
                    />
                  ))}
                </List>
              </>
            );
          })}
        </Box>
      </Modal>
    </div>
  );
}
