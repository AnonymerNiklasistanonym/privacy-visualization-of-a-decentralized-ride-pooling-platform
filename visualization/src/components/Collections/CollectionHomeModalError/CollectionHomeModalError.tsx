'use client';

// Package imports
import {useCallback, useRef, useState} from 'react';
// > Components
import CollectionHome from '@components/Collections/CollectionHome';
import ModalError from '@components/Modal/ModalError';
// > Misc
import {debugComponentRender} from '@misc/debug';
// Type imports
import type {CollectionHomeProps} from '@components/Collections/CollectionHome';
import type {ErrorModalContentElement} from '@components/Modal/ModalError';

/** Home page collection + error modal */
export default function CollectionHomeModalError() {
  debugComponentRender('CollectionHomeModalError');

  // React: States
  // > Error Modal
  const [stateErrorModalOpen, setStateErrorModalOpen] = useState(false);
  const [stateErrorModalUpdate, setStateErrorModalUpdate] = useState(false);
  const errorModalContent = useRef<Map<string, ErrorModalContentElement>>(
    new Map()
  );

  // Props: Functions (depend on created states)
  const showError = useCallback((message: string, error: Error) => {
    console.error(error);
    const entry = errorModalContent.current.get(message);
    // Append error or increase count
    if (entry !== undefined) {
      entry.count++;
      entry.error.set(error.name + error.message, error);
      // Update modal content but not necessarily open the error modal
      setStateErrorModalUpdate(true);
    } else {
      errorModalContent.current.set(message, {
        count: 1,
        error: new Map([[error.name + error.message, error]]),
      });
      console.log(JSON.stringify(errorModalContent.current));
      // Only open modal if new error is found
      setStateErrorModalOpen(true);
    }
  }, []);

  // Group all props
  const props: CollectionHomeProps = {
    errorModalContent,
    setStateErrorModalOpen,
    setStateErrorModalUpdate,
    showError,
    stateErrorModalOpen,
    stateErrorModalUpdate,
  };

  return (
    <>
      <ModalError key="global-modal-error" {...props} />
      <CollectionHome key="global-collection-home" {...props} />
    </>
  );
}
