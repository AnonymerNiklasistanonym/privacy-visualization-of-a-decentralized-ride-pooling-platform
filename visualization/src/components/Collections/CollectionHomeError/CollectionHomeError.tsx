'use client';

// Package imports
import {useState} from 'react';
// Local imports
import {showErrorBuilder} from '@components/Modal/ModalError';
// > Components
import CollectionHome from '@components/Collections/CollectionHome';
import ModalError from '@components/Modal/ModalError';
// > Globals
// Type imports
import type {
  ErrorModalContentElement,
  ModalErrorProps,
} from '@components/Modal/ModalError';
import type {GlobalPropsShowError} from '@misc/props/global';

/** Home page collection with error modal */
export default function ErrorModalWrapperCollectionHome() {
  // React: States
  // > Error Modal
  const [stateErrorModalOpen, setStateErrorModalOpen] = useState(false);
  const [stateErrorModalContent, setStateErrorModalContent] = useState<
    ErrorModalContentElement[]
  >([]);

  // Props: Functions (depend on created states)
  const showError = showErrorBuilder({
    setStateErrorModalContent,
    setStateErrorModalOpen,
    stateErrorModalContent,
    stateErrorModalOpen,
  });

  // Group all props
  const props: GlobalPropsShowError & ModalErrorProps = {
    setStateErrorModalContent,
    setStateErrorModalOpen,
    showError,
    stateErrorModalContent,
    stateErrorModalOpen,
  };

  return (
    <>
      <ModalError {...props} />
      <CollectionHome {...props} />
    </>
  );
}
