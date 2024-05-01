// Package imports
import {useEffect, useState} from 'react';
// > Components
import {Box, List} from '@mui/material';
// Local imports
// > Components
import TableBlockchainElement from './TableBlockchainElement';
// > Globals
import {simulationEndpoints} from '@globals/defaults/endpoints';
// Type imports
import type {
  GlobalPropsFetch,
  GlobalPropsShowError,
  GlobalPropsUserInput,
  GlobalPropsUserInputSet,
} from '@misc/globalProps';
import type {
  SimulationEndpointSmartContractInformation,
  SimulationEndpointSmartContracts,
} from '@globals/types/simulation';
import type {SettingsBlockchainPropsStates} from '@misc/settings';

export interface TableBlockchainProps
  extends SettingsBlockchainPropsStates,
    GlobalPropsFetch,
    GlobalPropsShowError,
    GlobalPropsUserInput,
    GlobalPropsUserInputSet {}

export default function TableBlockchain({
  stateSettingsBlockchainUpdateRateInMs,
  showError: stateShowError,
  setStateSelectedParticipant,
  fetchJsonSimulation,
}: TableBlockchainProps) {
  // React: States
  const [stateSmartContracts, setStateSmartContracts] = useState<
    Array<SimulationEndpointSmartContractInformation>
  >([]);
  // React: Effects
  useEffect(() => {
    const interval = setInterval(() => {
      fetchJsonSimulation<SimulationEndpointSmartContracts>(
        simulationEndpoints.apiV1.smartContracts
      )
        .then(data =>
          Promise.all(
            data.smartContracts.map(smartContractId =>
              fetchJsonSimulation<SimulationEndpointSmartContractInformation>(
                simulationEndpoints.apiV1.smartContract(smartContractId)
              )
            )
          )
        )
        .then(data => {
          setStateSmartContracts(data);
        })
        .catch(err => stateShowError('Fetch simulation smart contracts', err));
    }, stateSettingsBlockchainUpdateRateInMs);
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
          />
        ))}
      </List>
    </Box>
  );
}
