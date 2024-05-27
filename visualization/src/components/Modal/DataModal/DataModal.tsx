// Package imports
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
import {Lock as LockIcon, LockOpen as LockOpenIcon} from '@mui/icons-material';
// Local imports
// > Components
import DataModelListElement from './DataModalElement';
// Type imports
import type {ReactElement, ReactNode} from 'react';
import type {ReactSetState, ReactState} from '@misc/react';
import type {ChangeViewButtonProps} from '@components/Button/ChangeViewButton';

export type DataModalInformationAccessType =
  | 'none'
  | 'owner'
  | 'local_storage'
  | 'transitive';

export interface DataModalInformation {
  icon?: ReactNode;
  isPseudonym?: boolean;
  accessType: DataModalInformationAccessType;
  name: string;
  description?: string;
  spectatorId: string;
  spectatorInformation?: ReactNode;
}

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

export default function DataModal(props: DataModalProps) {
  const {
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
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            left: '50%',
            maxWidth: 1200,
            minWidth: 600,
            p: 4,
            position: 'absolute' as const,
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Who can see {dataLabel} from{' '}
            <Chip
              icon={dataOriginIcon}
              label={dataOriginName}
              color="primary"
              onClick={() => {}}
            />
            ?
          </Typography>
          {dataValueSpectator}
          <Chip
            sx={{marginLeft: '1rem', marginRight: '1rem'}}
            icon={dataValueHidden ? <LockIcon /> : <LockOpenIcon />}
            color={dataValueHidden ? 'error' : 'success'}
            label={dataValueHidden ? 'Hidden' : 'Visible'}
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
                  {elements.map(a => {
                    return (
                      <DataModelListElement
                        {...props}
                        key={`data-${accessType}-${a.name}`}
                        stateDataModalContentElement={a}
                      />
                    );
                  })}
                </List>
              </>
            );
          })}
        </Box>
      </Modal>
    </div>
  );
}
