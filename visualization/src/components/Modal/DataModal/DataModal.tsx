// Package imports
// > Components
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Modal,
  Typography,
} from '@mui/material';
// > Icons
import {QuestionMark as QuestionMarkIcon} from '@mui/icons-material';
// Local imports
import ChangeViewButton from '@components/Button/ChangeViewButton';
// Type imports
import type {ReactSetState, ReactState} from '@misc/react';
import type {ChangeViewButtonProps} from '@components/Button/ChangeViewButton';

export type DataModalInformationAccessType =
  | 'none'
  | 'owner'
  | 'local_storage'
  | 'transitive';

export interface DataModalInformation {
  isPseudonym?: boolean;
  accessType: DataModalInformationAccessType;
  name: string;
  description?: string;
  spectator: string;
}

export interface DataModalPropsSetStates {
  setStateDataModalOpen: ReactSetState<boolean>;
}

export interface DataModalProps
  extends DataModalPropsSetStates,
    ChangeViewButtonProps {
  stateDataModalOpen: ReactState<boolean>;
  stateDataModalContent: ReactState<Array<DataModalInformation>>;
}

export interface DataModalPropsElement extends ChangeViewButtonProps {
  stateDataModalContentElement: ReactState<DataModalInformation>;
}

export function DataModelListElement(props: DataModalPropsElement) {
  const {stateDataModalContentElement} = props;
  // TODO: Reuse element from overview to explain what a customer/service/... is!
  return (
    <>
      <ListItem>
        <ListItemText
          primary={`${stateDataModalContentElement.name} (${stateDataModalContentElement.spectator})`}
          secondary={stateDataModalContentElement.description}
        />
        <ChangeViewButton
          {...props}
          key={`modal_${stateDataModalContentElement.name}`}
          actorId={stateDataModalContentElement.spectator}
          icon={<QuestionMarkIcon />}
          label={stateDataModalContentElement.name}
          isPseudonym={stateDataModalContentElement.isPseudonym ?? false}
        />
      </ListItem>
    </>
  );
}

export default function DataModal(props: DataModalProps) {
  const {stateDataModalOpen, stateDataModalContent, setStateDataModalOpen} =
    props;
  const listInformation: ReadonlyArray<
    [string, DataModalInformationAccessType]
  > = [
    ['Data Owner', 'owner'],
    ['Stores this data', 'local_storage'],
    ['Can request this data', 'transitive'],
    ['Special information about why this actor has no access', 'none'],
  ];
  // TODO: Add what data and from whom is inspected!
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
          <Typography variant="h4" gutterBottom>
            Who can see this data?
          </Typography>
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
