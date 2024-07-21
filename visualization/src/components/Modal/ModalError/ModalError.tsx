// Package imports
import {memo, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {List, ListSubheader, Typography} from '@mui/material';
// Local imports
// > Components
import ModalGeneric from '@components/Modal/ModalGeneric';
// Type imports
import type {ReactRef, ReactSetState, ReactState} from '@misc/react';
import ModalErrorListElement from './ModalErrorListElement';

export interface ErrorModalContentElement {
  error: Map<string, Error>;
  count: number;
}

export interface ModalErrorProps
  extends ErrorModalPropsGet,
    ErrorModalPropsSet,
    ErrorModalPropsErrorBuilder {}

export interface ErrorModalPropsGet {
  stateErrorModalOpen: ReactState<boolean>;
  stateErrorModalUpdate: ReactState<boolean>;
  errorModalContent: ReactRef<Map<string, ErrorModalContentElement>>;
}

export interface ErrorModalPropsSet {
  setStateErrorModalOpen: ReactSetState<boolean>;
  setStateErrorModalUpdate: ReactSetState<boolean>;
}

export interface ErrorModalPropsErrorBuilder
  extends ErrorModalPropsGet,
    ErrorModalPropsSet {}

export default memo(ModalError);

/** Modal that displays errors */
export function ModalError({
  errorModalContent,
  stateErrorModalOpen,
  stateErrorModalUpdate,
  setStateErrorModalUpdate,
  setStateErrorModalOpen,
}: ModalErrorProps) {
  const intl = useIntl();

  const [stateErrorModalContentList, setStateErrorModalContentList] = useState<
    Array<[string, ErrorModalContentElement]>
  >([]);

  useEffect(() => {
    // In case the modal is opened or updated remake the content list
    if (stateErrorModalOpen || stateErrorModalUpdate) {
      setStateErrorModalContentList(Array.from(errorModalContent.current));
      // Reset the modal update value
      setStateErrorModalUpdate(false);
    }
  }, [
    errorModalContent,
    setStateErrorModalOpen,
    setStateErrorModalUpdate,
    stateErrorModalOpen,
    stateErrorModalUpdate,
  ]);

  return (
    <ModalGeneric
      setStateModalOpen={setStateErrorModalOpen}
      stateModalOpen={stateErrorModalOpen}
    >
      <List
        sx={{
          bgcolor: 'background.paper',
          width: '100%',
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            {intl.formatMessage({id: 'errors'})}
          </ListSubheader>
        }
      >
        {stateErrorModalContentList.map(([title, content]) => (
          <ModalErrorListElement
            key={`modal-error-list-element-${title}`}
            errorModalContent={errorModalContent}
            stateErrorModalUpdate={stateErrorModalUpdate}
            stateErrorModalOpen={stateErrorModalOpen}
            setStateErrorModalUpdate={setStateErrorModalUpdate}
            setStateErrorModalOpen={setStateErrorModalOpen}
            title={title}
            element={content}
          />
        ))}
        {stateErrorModalContentList.length === 0 ? (
          <Typography
            key="modal-error-list-element-no-errors-found"
            variant="body2"
            gutterBottom
          >
            No errors found
          </Typography>
        ) : undefined}
      </List>
    </ModalGeneric>
  );
}
