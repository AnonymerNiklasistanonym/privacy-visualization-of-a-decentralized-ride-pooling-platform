'use client';

// Package imports
import {useEffect} from 'react';
// > Components
import {Box, Modal} from '@mui/material';
// Local imports
// > Components
import TableBlockchainElement from '@components/Table/TableBlockchain/TableBlockchainElement';
// Type imports
import type {ReactSetState, ReactState} from '@misc/react';
import type {ChangeViewButtonProps} from '@components/Button/ChangeViewButton';
import type {SimulationEndpointSmartContractInformation} from '@globals/types/simulation';

export interface RideRequestModalInformation {
  smartContract: SimulationEndpointSmartContractInformation;
}

export interface RideRequestModalPropsSetStates {
  setStateRideRequestModalOpen: ReactSetState<boolean>;
}

export type RideRequestModalProps = ChangeViewButtonProps;

export interface RideRequestModalPropsInput
  extends RideRequestModalProps,
    RideRequestModalPropsSetStates {
  stateRideRequestModalOpen: ReactState<boolean>;
  stateRideRequestModalContent: ReactState<
    RideRequestModalInformation | undefined
  >;
}

export default function RideRequestModal(props: RideRequestModalPropsInput) {
  const {
    stateRideRequestModalOpen,
    stateRideRequestModalContent,
    setStateRideRequestModalOpen,
    setStateSelectedParticipant,
  } = props;

  useEffect(() => {
    if (
      stateRideRequestModalOpen &&
      stateRideRequestModalContent?.smartContract
    ) {
      setStateSelectedParticipant(
        stateRideRequestModalContent.smartContract.customerId
      );
    }
  }, [
    stateRideRequestModalOpen,
    stateRideRequestModalContent,
    setStateSelectedParticipant,
  ]);

  return (
    <Modal
      open={stateRideRequestModalOpen}
      onClose={() => setStateRideRequestModalOpen(false)}
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
        {stateRideRequestModalContent !== undefined ? (
          <>
            <TableBlockchainElement
              {...props}
              stateSmartContract={stateRideRequestModalContent.smartContract}
            />
          </>
        ) : undefined}
      </Box>
    </Modal>
  );
}
