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
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
} from '@misc/props/global';
import type {
  SimulationEndpointSmartContractInformation,
  SimulationEndpointSmartContracts,
} from '@globals/types/simulation';
import type {SettingsBlockchainProps} from '@misc/props/settings';

export interface TableBlockchainProps
  extends SettingsBlockchainProps,
    GlobalPropsFetch,
    GlobalPropsShowError,
    GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorSelectedElementsSet {}

export default function TableBlockchain(props: TableBlockchainProps) {
  const {
    stateSettingsBlockchainUpdateRateInMs,
    showError: stateShowError,
    fetchJsonSimulation,
  } = props;

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
            {...props}
            key={smartContract.walletId}
            stateSmartContract={smartContract}
          />
        ))}
      </List>
    </Box>
  );
}
