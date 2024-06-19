'use client';

// Package imports
import {useState} from 'react';
// Local imports
import {showErrorBuilder} from '@components/Modal/ErrorModal';
// > Components
import CollectionHome from '@components/Collections/CollectionHome';
import ErrorModal from '@components/Modal/ErrorModal';
// > Globals
// Type imports
import type {
  ErrorModalContentElement,
  ErrorModalProps,
} from '@components/Modal/ErrorModal';
import type {GlobalPropsShowError} from '@misc/props/global';

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

  // Group all props for easy forwarding
  const props: GlobalPropsShowError & ErrorModalProps = {
    setStateErrorModalContent,
    setStateErrorModalOpen,
    showError,
    stateErrorModalContent,
    stateErrorModalOpen,
  };

  return (
    <>
      <ErrorModal {...props} />
      <CollectionHome {...props} />
    </>
  );
}
