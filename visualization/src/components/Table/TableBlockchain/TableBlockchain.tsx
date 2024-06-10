// Package imports
import {useEffect, useState} from 'react';
// > Components
import {Box} from '@mui/material';
// Local imports
// > Components
import RideRequestModal from '@components/Modal/RideRequestModal';
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
  RideRequestModalInformation,
  RideRequestModalProps,
} from '@components/Modal/RideRequestModal';
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
    stateSettingsGlobalDebug,
    showError: stateShowError,
    fetchJsonSimulation,
  } = props;

  // React: States
  const [stateSmartContracts, setStateSmartContracts] = useState<
    Array<SimulationEndpointSmartContractInformation>
  >([]);
  const [stateRideRequestModalOpen, setStateRideRequestModalOpen] =
    useState(false);
  const [stateRideRequestModalContent, setStateRideRequestModalContent] =
    useState<RideRequestModalInformation | undefined>(undefined);
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

  const propsInput: RideRequestModalProps = {
    ...props,
    setStateRideRequestModalOpen,
    stateRideRequestModalContent,
    stateRideRequestModalOpen,
  };

  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <TableDebugData
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
            setStateRideRequestModalContent({smartContract});
            setStateRideRequestModalOpen(true);
          }
        }}
      />
      <RideRequestModal {...propsInput} />
      {/*<List
        sx={{bgcolor: 'transparent', maxWidth: 800, width: '100%'}}
        component="nav"
      >
        {stateSmartContracts.map(smartContract => (
          <TableBlockchainElement
            {...props}
            key={smartContract.walletId}
            stateSmartContract={smartContract}
          />
        ))}
      </List>*/}
    </Box>
  );
}
