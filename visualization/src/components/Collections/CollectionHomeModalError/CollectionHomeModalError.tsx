'use client';

// Package imports
import {useCallback, useRef, useState} from 'react';
// Local imports
import {showErrorBuilder} from '@components/Modal/ModalError';
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
  const [stateErrorModalContentSize, setStateErrorModalContentSize] =
    useState(0);
  const errorModalContent = useRef<Map<string, ErrorModalContentElement>>(
    new Map()
  );

  // Props: Functions (depend on created states)
  const showError = useCallback(
    (message: string, error: Error) =>
      showErrorBuilder({
        errorModalContent,
        setStateErrorModalContentSize,
        setStateErrorModalOpen,
        stateErrorModalContentSize,
        stateErrorModalOpen,
      })(message, error),
    [stateErrorModalContentSize, stateErrorModalOpen]
  );

  // Group all props
  const props: CollectionHomeProps = {
    errorModalContent,
    setStateErrorModalContentSize,
    setStateErrorModalOpen,
    showError,
    stateErrorModalContentSize,
    stateErrorModalOpen,
  };

  return (
    <>
      <ModalError {...props} />
      <CollectionHome {...props} />
    </>
  );
}
