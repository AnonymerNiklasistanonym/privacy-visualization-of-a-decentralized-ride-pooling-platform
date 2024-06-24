// Package imports
import {useEffect, useState} from 'react';
// > Components
import {Box} from '@mui/material';
// Local imports
// > Components
import TableDebugData from '../TableDebugData';
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

export interface TableBlockchainPropsInput extends TableBlockchainProps {
  onRowSelect: (
    customerPseudonym: string,
    rideProviderPseudonym: string
  ) => void;
}

export default function TableBlockchain(props: TableBlockchainPropsInput) {
  const {
    stateSettingsBlockchainUpdateRateInMs,
    showError: stateShowError,
    fetchJsonSimulation,
    onRowSelect,
  } = props;

  // React: States
  const [stateSmartContracts, setStateSmartContracts] = useState<
    Array<SimulationEndpointSmartContractInformation>
  >([]);

  const fetchSmartContracts = () =>
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
        console.log(data);
        setStateSmartContracts(data);
      })
      .catch(err => stateShowError('Fetch simulation smart contracts', err));

  // React: Effects
  useEffect(() => {
    const interval = setInterval(
      () => fetchSmartContracts(),
      stateSettingsBlockchainUpdateRateInMs
    );
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <TableDebugData
        height={'calc(100vh - 14rem)'}
        stateDebugData={{
          customers: [],
          rideProviders: [],
          rideRequests: [],
          smartContracts: stateSmartContracts,
        }}
        debugDataType="smart_contract"
        onRowClick={(type, id) => {
          console.log(type, id);
          const smartContract = stateSmartContracts.find(
            a => a.walletId === id
          );
          if (smartContract) {
            onRowSelect(smartContract.customerId, smartContract.rideProviderId);
          }
        }}
      />
    </Box>
  );
}
