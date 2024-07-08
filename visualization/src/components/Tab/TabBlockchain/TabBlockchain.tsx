'use client';

// Package imports
import {useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {Box, Grid} from '@mui/material';
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
import GridConnectedElementsLayout from '@components/Grid/GridConnectedElementsLayout';
import InputChangeSpectator from '@components/Input/InputChangeSpectator';
import InputSearchBar from '@components/Input/InputSearchBar';
import TabContainer from '@components/Tab/TabContainer';
import TableBlockchain from '@components/Table/TableBlockchain';
// > Misc
import {searchBarIds} from '@misc/searchBarIds';
// Type imports
import type {
  ConnectedElementSection,
  InfoElement,
} from '@components/Grid/GridConnectedElementsLayout';
import type {
  GlobalPropsIntlValues,
  GlobalPropsSearch,
  GlobalPropsSpectatorMap,
} from '@misc/props/global';
import type {
  SettingsConnectedElementsProps,
  SettingsUiProps,
} from '@misc/props/settings';
import type {ReactElement} from 'react';
import type {SimulationEndpointParticipantIdFromPseudonym} from '@globals/types/simulation';
import type {TableBlockchainProps} from '@components/Table/TableBlockchain';

export interface TabBlockchainProps
  extends TableBlockchainProps,
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
    setStateSelectedSmartContractId,
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
    if (stateSelectedRideProviderResolved !== undefined) {
      selectedParticipants.push(
        <CardGeneric
          {...props}
          icon={<ParticipantCustomerIcon />}
          name={intl.formatMessage({
            id: 'getacar.participant.customer',
          })}
          label={intl.formatMessage(
            {
              id: 'getacar.spectator.message.connected',
            },
            {
              name: intl.formatMessage({
                id: 'getacar.spectator.message.passenger',
              }),
            }
          )}
          id={'TODO'}
          status={'TODO'}
          content={[]}
        />
      );
    }
    if (stateSelectedRideProviderResolved !== undefined) {
      selectedRideRequests.push(
        <CardGeneric
          {...props}
          icon={<ParticipantRideRequestIcon />}
          name={intl.formatMessage({
            id: 'getacar.rideRequest',
          })}
          label={intl.formatMessage(
            {
              id: 'getacar.spectator.message.connected',
            },
            {
              name: intl.formatMessage({
                id: 'getacar.rideRequest',
              }),
            }
          )}
          id={'TODO'}
          status={'TODO'}
          content={[]}
        />
      );
    }
    // TODO Show connected Ride Request
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
    stateSelectedCustomerResolved,
    stateSelectedRideProviderResolved,
  ]);

  const stateInfoElements = useMemo<Array<InfoElement>>(
    () => [
      {
        content: <InputChangeSpectator {...props} />,
      },
      {
        content: intl.formatMessage({
          id: 'page.home.tab.blockchain.section.info.content',
        }),
        title: intl.formatMessage({
          id: 'page.home.tab.blockchain.section.info.title',
        }),
      },
    ],
    [intl, props]
  );

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
              primaryFilter={searchBarIds.filter}
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
              <TableBlockchain
                {...props}
                onRowSelect={(
                  smartContractId,
                  customerPseudonym,
                  rideProviderPseudonym
                ) => {
                  setStateSelectedSmartContractId(smartContractId);
                  setStateSelectedCustomerPseudonym(customerPseudonym);
                  setStateSelectedRideProviderPseudonym(rideProviderPseudonym);
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </GridConnectedElementsLayout>
    </TabContainer>
  );
}
