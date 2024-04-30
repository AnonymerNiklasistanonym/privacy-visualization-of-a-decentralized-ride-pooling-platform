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
import type {GlobalStates, GlobalStatesShowError} from '@misc/globalStates';
import type {
  SimulationEndpointSmartContractInformation,
  SimulationEndpointSmartContracts,
} from '@globals/types/simulation';
import type {SettingsBlockchainPropsStates} from '@misc/settings';

export interface TableBlockchainProps
  extends SettingsBlockchainPropsStates,
    GlobalStatesShowError,
    GlobalStates {}

export default function TableBlockchain({
  stateSettingsMapBaseUrlSimulation,
  stateSettingsMapUpdateRateInMs,
  stateShowError,
  setStateSelectedParticipant,
  setStateSpectator,
  stateSelectedParticipant,
  stateSpectator,
  setStateSelectedRideRequest,
  stateSelectedRideRequest,
}: TableBlockchainProps) {
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
        .catch(err => stateShowError('Fetch simulation smart contracts', err));
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
            setStateSelectedRideRequest={setStateSelectedRideRequest}
            stateSelectedRideRequest={stateSelectedRideRequest}
          />
        ))}
      </List>
    </Box>
  );
}
