// Package imports
import {useEffect, useState} from 'react';
// > Components
import {Box, List} from '@mui/material';
// Local imports
import {fetchJsonEndpoint} from '@misc/fetch';
import {showErrorBuilder} from '@misc/modals';
// > Components
import TableBlockchainElement from './TableBlockchainElement';
// > Globals
import {simulationEndpoints} from '@globals/defaults/endpoints';
// Type imports
import type {
  SimulationEndpointSmartContractInformation,
  SimulationEndpointSmartContracts,
} from '@globals/types/simulation';
import type {ErrorModalPropsErrorBuilder} from '@misc/modals';
import type {GlobalStates} from '@misc/globalStates';
import type {SettingsBlockchainPropsStates} from '@misc/settings';

export interface TableBlockchainProps
  extends SettingsBlockchainPropsStates,
    ErrorModalPropsErrorBuilder,
    GlobalStates {}

export default function TableBlockchain({
  stateSettingsMapBaseUrlSimulation,
  stateSettingsMapUpdateRateInMs,
  setStateErrorModalContent,
  setStateErrorModalOpen,
  stateErrorModalContent,
  setStateSelectedParticipant,
  setStateSpectator,
  stateSelectedParticipant,
  stateSpectator,
}: TableBlockchainProps) {
  const showError = showErrorBuilder({
    setStateErrorModalContent,
    setStateErrorModalOpen,
    stateErrorModalContent,
  });

  // React: States
  const [stateSmartContracts, setStateSmartContracts] = useState<
    Array<SimulationEndpointSmartContractInformation>
  >([]);
  // React: Effects
  useEffect(() => {
    const interval = setInterval(() => {
      fetchJsonEndpoint<SimulationEndpointSmartContracts>(
        stateSettingsMapBaseUrlSimulation,
        simulationEndpoints.apiV1.smartContracts
      )
        .then(data =>
          Promise.all(
            data.smartContracts.map(smartContractId =>
              fetchJsonEndpoint<SimulationEndpointSmartContractInformation>(
                stateSettingsMapBaseUrlSimulation,
                simulationEndpoints.apiV1.smartContract(smartContractId)
              )
            )
          )
        )
        .then(data => {
          setStateSmartContracts(data);
        })
        .catch(err => showError('Fetch simulation smart contracts', err));
    }, stateSettingsMapUpdateRateInMs);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <Box
      sx={{
        height: 400,
        width: '100%',
      }}
    >
      <List
        sx={{bgcolor: 'background.paper', maxWidth: 800, width: '100%'}}
        component="nav"
      >
        {stateSmartContracts.map(smartContract => (
          <TableBlockchainElement
            key={smartContract.walletId}
            stateSmartContract={smartContract}
            setStateSelectedParticipant={setStateSelectedParticipant}
            setStateSpectator={setStateSpectator}
            stateSelectedParticipant={stateSelectedParticipant}
            stateSpectator={stateSpectator}
          />
        ))}
      </List>
    </Box>
  );
}
