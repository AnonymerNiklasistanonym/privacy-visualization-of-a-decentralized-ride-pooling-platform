'use client';

// Package imports
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {Box, ButtonGroup, Grid, Paper} from '@mui/material';
import {Clear as DeleteIcon} from '@mui/icons-material';
// Local imports
import {simulationEndpoints} from '@globals/defaults/endpoints';
// > Components
import {
  ConnectedElementsIcon,
  ParticipantCustomerIcon,
  ParticipantRideRequestIcon,
} from '@components/Icons';
import CardGeneric from '@components/Card/CardGeneric';
import CardRefresh from '@components/Card/CardRefresh';
import GenericButton from '@components/Button/GenericButton';
import GridConnectedElementsLayout from '@components/Grid/GridConnectedElementsLayout';
import InputChangeSpectator from '@components/Input/InputChangeSpectator';
import InputSearchBar from '@components/Input/InputSearchBar';
import TabContainer from '@components/Tab/TabContainer';
import TableDebugData from '@components/Table/TableDebugData';
// > Misc
import {SearchBarId} from '@misc/searchBarIds';
import {SpectatorId} from '@misc/spectatorIds';
// Type imports
import type {
  ConnectedElementSection,
  InfoElement,
} from '@components/Grid/GridConnectedElementsLayout';
import type {
  GlobalPropsFetch,
  GlobalPropsIntlValues,
  GlobalPropsSearch,
  GlobalPropsShowError,
  GlobalPropsSpectatorMap,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
} from '@misc/props/global';
import type {
  SettingsBlockchainProps,
  SettingsConnectedElementsProps,
  SettingsUiProps,
} from '@misc/props/settings';
import type {
  SimulationEndpointParticipantIdFromPseudonym,
  SimulationEndpointParticipantPseudonymsFromId,
  SimulationEndpointSmartContractInformation,
  SimulationEndpointSmartContracts,
} from '@globals/types/simulation';
import type {ReactElement} from 'react';

export interface TabBlockchainProps
  extends SettingsBlockchainProps,
    GlobalPropsFetch,
    GlobalPropsShowError,
    GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorSelectedElementsSet,
    SettingsUiProps,
    GlobalPropsSpectatorMap,
    GlobalPropsIntlValues,
    SettingsConnectedElementsProps,
    GlobalPropsSearch {}

// eslint-disable-next-line no-empty-pattern
export default function TabBlockchain(props: TabBlockchainProps) {
  const {
    fetchJsonSimulation,
    showError,
    stateSettingsUiGridSpacing,
    stateSelectedSmartContractId,
    setStateSelectedSmartContractId,
    stateSelectedSpectator,
    setStateSelectedSpectator,
    stateSettingsBlockchainUpdateRateInMs,
    setStateSpectator,
    stateSpectators,
    stateSpectator,
  } = props;
  const intl = useIntl();

  const [stateSelectedCustomerPseudonym, setStateSelectedCustomerPseudonym] =
    useState<string | undefined>(undefined);
  const [
    stateSelectedRideProviderPseudonym,
    setStateSelectedRideProviderPseudonym,
  ] = useState<string | undefined>(undefined);

  const [stateSelectedCustomerResolved, setStateSelectedCustomerResolved] =
    useState<string | undefined>(undefined);
  const [
    stateSelectedRideProviderResolved,
    setStateSelectedRideProviderResolved,
  ] = useState<string | undefined>(undefined);

  const [stateConnectedRideRequests, setStateConnectedRideRequests] = useState<
    Array<string>
  >([]);

  useEffect(() => {
    if (stateSelectedSmartContractId !== undefined) {
      console.warn(
        'Fetch connected ride requests of smart contract...',
        stateSelectedSmartContractId
      );
      fetchJsonSimulation<any>(
        simulationEndpoints.apiV1.smartContractConnectedRideRequests(
          stateSelectedSmartContractId
        )
      )
        .then(data => {
          // TODO Not working
          console.warn(
            'Fetched connected ride requests of smart contract',
            data
          );
          setStateConnectedRideRequests(data.connectedRideRequests);
        })
        .catch(err =>
          showError('Simulation fetch customer ID from pseudonym', err)
        );
    } else {
      setStateConnectedRideRequests([]);
    }
  }, [fetchJsonSimulation, stateSelectedSmartContractId, showError]);

  useEffect(() => {
    if (stateSelectedCustomerPseudonym !== undefined) {
      fetchJsonSimulation<SimulationEndpointParticipantIdFromPseudonym>(
        simulationEndpoints.apiV1.participantIdFromPseudonym(
          stateSelectedCustomerPseudonym
        )
      )
        .then(data => setStateSelectedCustomerResolved(data.id))
        .catch(err =>
          showError('Simulation fetch customer ID from pseudonym', err)
        );
    }
  }, [
    fetchJsonSimulation,
    setStateSelectedCustomerResolved,
    showError,
    stateSelectedCustomerPseudonym,
  ]);

  useEffect(() => {
    if (stateSelectedRideProviderPseudonym !== undefined) {
      fetchJsonSimulation<SimulationEndpointParticipantIdFromPseudonym>(
        simulationEndpoints.apiV1.participantIdFromPseudonym(
          stateSelectedRideProviderPseudonym
        )
      )
        .then(data => setStateSelectedRideProviderResolved(data.id))
        .catch(err =>
          showError('Simulation fetch ride provider ID from pseudonym', err)
        );
    }
  }, [
    fetchJsonSimulation,
    setStateSelectedRideProviderResolved,
    showError,
    stateSelectedRideProviderPseudonym,
  ]);

  useEffect(() => {
    if (stateSelectedRideProviderPseudonym === undefined) {
      setStateSelectedRideProviderResolved(undefined);
    }
  }, [stateSelectedRideProviderPseudonym]);

  useEffect(() => {
    if (stateSelectedCustomerPseudonym === undefined) {
      setStateSelectedCustomerResolved(undefined);
    }
  }, [stateSelectedCustomerPseudonym]);

  const stateConnectedElements = useMemo<Array<ConnectedElementSection>>(() => {
    const selectedParticipants: Array<ReactElement> = [];
    const selectedRideRequests: Array<ReactElement> = [];
    if (stateSelectedCustomerResolved !== undefined) {
      selectedParticipants.push(
        <CardRefresh
          {...props}
          cardType={'customer'}
          id={stateSelectedCustomerResolved}
          label={intl.formatMessage(
            {
              id: 'getacar.spectator.message.connected',
            },
            {
              name: intl.formatMessage({
                id: 'getacar.participant.customer',
              }),
            }
          )}
        />
      );
    }
    if (stateSelectedRideProviderResolved !== undefined) {
      selectedParticipants.push(
        <CardRefresh
          {...props}
          cardType={'ride_provider'}
          id={stateSelectedRideProviderResolved}
          label={intl.formatMessage(
            {
              id: 'getacar.spectator.message.connected',
            },
            {
              name: intl.formatMessage({
                id: 'getacar.participant.rideProvider',
              }),
            }
          )}
        />
      );
    }
    for (const stateConnectedRideRequest of stateConnectedRideRequests) {
      selectedRideRequests.push(
        <CardRefresh
          {...props}
          id={stateConnectedRideRequest}
          cardType={'ride_request'}
        />
      );
    }
    return [
      {
        elements: selectedParticipants,
        icon: <ConnectedElementsIcon fontSize="large" />,
        title: intl.formatMessage(
          {id: 'getacar.spectator.message.connected'},
          {
            name: intl.formatMessage({id: 'getacar.participant.plural'}),
          }
        ),
      },
      {
        elements: selectedRideRequests,
        icon: <ConnectedElementsIcon fontSize="large" />,
        title: intl.formatMessage(
          {id: 'getacar.spectator.message.connected'},
          {
            name: intl.formatMessage({id: 'getacar.rideRequest.plural'}),
          }
        ),
      },
    ];
  }, [
    intl,
    props,
    stateConnectedRideRequests,
    stateSelectedCustomerResolved,
    stateSelectedRideProviderResolved,
  ]);

  const stateInfoElements = useMemo<Array<InfoElement>>(() => {
    const buttonCurrentSpectatorClear = (
      <GenericButton
        disabled={stateSpectator === SpectatorId.EVERYTHING}
        icon={<DeleteIcon />}
        onClick={() => setStateSpectator(SpectatorId.EVERYTHING)}
        secondaryColor={true}
      >
        {intl.formatMessage(
          {
            id: 'reset',
          },
          {
            name: intl.formatMessage(
              {
                id: 'current',
              },
              {
                name: intl.formatMessage({
                  id: 'getacar.spectator',
                }),
              }
            ),
          }
        )}
      </GenericButton>
    );
    const buttonSelectedSmartContractClear = (
      <GenericButton
        disabled={stateSelectedSmartContractId === undefined}
        icon={<DeleteIcon />}
        onClick={() => setStateSelectedSmartContractId(undefined)}
      >
        {intl.formatMessage(
          {
            id: 'reset',
          },
          {
            name: intl.formatMessage(
              {
                id: 'selected',
              },
              {
                name: intl.formatMessage({
                  id: 'getacar.smartContract',
                }),
              }
            ),
          }
        )}
      </GenericButton>
    );
    const buttonSelectedSpectatorClear = (
      <GenericButton
        disabled={stateSelectedSpectator === undefined}
        icon={<DeleteIcon />}
        onClick={() => setStateSelectedSpectator(undefined)}
      >
        {intl.formatMessage(
          {
            id: 'reset',
          },
          {
            name: intl.formatMessage(
              {
                id: 'selected',
              },
              {
                name: intl.formatMessage({
                  id: 'getacar.spectator',
                }),
              }
            ),
          }
        )}
      </GenericButton>
    );
    return [
      {
        content: (
          <>
            <InputChangeSpectator key="change-spectator" {...props} />
            <ButtonGroup
              sx={{
                marginTop: `${stateSettingsUiGridSpacing / 2}rem`,
              }}
            >
              {buttonCurrentSpectatorClear}
              {buttonSelectedSmartContractClear}
            </ButtonGroup>
            <ButtonGroup
              sx={{
                marginTop: `${stateSettingsUiGridSpacing / 2}rem`,
              }}
            >
              {buttonSelectedSpectatorClear}
            </ButtonGroup>
          </>
        ),
      },
      {
        content: intl.formatMessage({
          id: 'page.home.tab.blockchain.section.info.content',
        }),
        title: intl.formatMessage({
          id: 'page.home.tab.blockchain.section.info.title',
        }),
      },
    ];
  }, [
    intl,
    props,
    setStateSelectedSmartContractId,
    setStateSelectedSpectator,
    setStateSpectator,
    stateSelectedSmartContractId,
    stateSelectedSpectator,
    stateSettingsUiGridSpacing,
    stateSpectator,
  ]);

  const [stateFilterPseudonyms, setStateFilterPseudonyms] = useState<
    Array<string>
  >([]);

  useEffect(() => {
    if (stateSelectedSpectator !== undefined) {
      fetchJsonSimulation<SimulationEndpointParticipantPseudonymsFromId>(
        simulationEndpoints.apiV1.participantPseudonymsFromId(
          stateSelectedSpectator
        )
      )
        .then(data => {
          console.warn(
            'Update pseudonyms to look for:',
            stateSelectedSpectator,
            data.pseudonyms
          );
          setStateFilterPseudonyms(data.pseudonyms);
        })
        .catch(err =>
          showError('Simulation fetch pseudonyms from participant ID', err)
        );
    }
    setStateFilterPseudonyms([]);
  }, [fetchJsonSimulation, showError, stateSelectedSpectator]);

  const [stateSmartContracts, setStateSmartContracts] = useState<
    Array<SimulationEndpointSmartContractInformation>
  >([]);

  const stateSmartContractsFinal = useMemo<
    Array<SimulationEndpointSmartContractInformation>
  >(() => {
    if (stateSelectedSpectator !== undefined) {
      const spectator = stateSpectators.get(stateSelectedSpectator);
      if (spectator !== undefined) {
        const categoryCustomer = intl.formatMessage({
          id: 'getacar.participant.customer',
        });
        const categoryRideProvider = intl.formatMessage({
          id: 'getacar.participant.rideProvider',
        });
        return stateSmartContracts.filter(a =>
          spectator.category === categoryCustomer
            ? a.customerIdResolved === stateSelectedSpectator
            : spectator.category === categoryRideProvider
              ? a.rideProviderIdResolved === stateSelectedSpectator
              : true
        );
      }
    }
    return stateSmartContracts;
  }, [stateSelectedSpectator, stateSmartContracts, stateSpectators, intl]);

  const pseudoCache = useRef<Map<string, string>>(new Map());

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
        // TODO Fetch for all current participating participants and add their entries to the global search
        // TODO Give their entries special IDs so that they are not overriding map entries
        console.log(data);
        setStateSmartContracts(data);
      })
      .catch(err => showError('Fetch simulation smart contracts', err));

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

  const onRowSelect = useCallback(
    (
      smartContractId: string,
      customerPseudonym: string,
      rideProviderPseudonym: string
    ) => {
      setStateSelectedSmartContractId(smartContractId);
      setStateSelectedCustomerPseudonym(customerPseudonym);
      setStateSelectedRideProviderPseudonym(rideProviderPseudonym);
    },
    [setStateSelectedSmartContractId]
  );

  useEffect(() => {
    if (stateSelectedSmartContractId === undefined) {
      setStateSelectedCustomerPseudonym(undefined);
      setStateSelectedRideProviderPseudonym(undefined);
    }
  }, [stateSelectedSmartContractId]);

  return (
    <TabContainer fullPage={true}>
      <GridConnectedElementsLayout
        stateSettingsUiGridSpacing={stateSettingsUiGridSpacing}
        stateConnectedElements={stateConnectedElements}
        stateInfoElements={stateInfoElements}
      >
        <Grid container spacing={stateSettingsUiGridSpacing}>
          <Grid item xs={12}>
            <InputSearchBar
              {...props}
              key={'search-bar-blockchain'}
              placeholder={intl.formatMessage({
                id: 'page.home.tab.blockchain.search',
              })}
              primaryFilter={SearchBarId.FILTER_SMART_CONTRACT_PARTICIPANT}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                height: `calc(100vh - 10rem - ${
                  (stateSettingsUiGridSpacing / 2) * 2
                }rem)`,
              }}
            >
              <Paper
                sx={{
                  height: '100%',
                  width: '100%',
                }}
                elevation={2}
              >
                <TableDebugData
                  height={'100%'}
                  stateDebugData={{
                    customers: [],
                    rideProviders: [],
                    rideRequests: [],
                    smartContracts: stateSmartContractsFinal,
                  }}
                  debugDataType="smart_contract"
                  onRowClick={(type, id) => {
                    console.log(type, id);
                    const smartContract = stateSmartContracts.find(
                      a => a.walletId === id
                    );
                    if (smartContract) {
                      onRowSelect(
                        smartContract.walletId,
                        smartContract.customerId,
                        smartContract.rideProviderId
                      );
                    }
                  }}
                />
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </GridConnectedElementsLayout>
    </TabContainer>
  );
}
