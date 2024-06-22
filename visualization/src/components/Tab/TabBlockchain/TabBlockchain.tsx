'use client';

// Package imports
import {useIntl} from 'react-intl';
import {useMemo} from 'react';
// > Components
import {Box, Grid} from '@mui/material';
// Local imports
// > Components
import CardParticipant from '@components/Card/CardParticipant';
import CardRideRequest from '@components/Card/CardRideRequest';
import {ConnectedElementsIcon} from '@components/Icons';
import GridConnectedElementsLayout from '@components/Grid/GridConnectedElementsLayout';
import SearchBar from '@components/TextInput/SearchBar';
import SectionChangeSpectator from '@components/Tab/TabMap/SectionChangeSpectator';
import TabContainer from '@components/Tab/TabContainer';
import TableBlockchain from '@components/Table/TableBlockchain';
// Type imports
import type {
  ConnectedElementSection,
  InfoElement,
} from '@components/Grid/GridConnectedElementsLayout';
import type {
  GlobalPropsParticipantSelectedElements,
  GlobalPropsSearch,
  GlobalPropsSpectatorMap,
} from '@misc/props/global';
import type {ReactElement} from 'react';
import type {SettingsUiProps} from '@misc/props/settings';
import type {TableBlockchainProps} from '@components/Table/TableBlockchain';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TabBlockchainProps
  extends TableBlockchainProps,
    SettingsUiProps,
    GlobalPropsParticipantSelectedElements,
    GlobalPropsSpectatorMap,
    GlobalPropsSearch {}

// eslint-disable-next-line no-empty-pattern
export default function TabBlockchain(props: TabBlockchainProps) {
  const {stateSettingsUiGridSpacing} = props;
  const intl = useIntl();

  const stateConnectedElements = useMemo<Array<ConnectedElementSection>>(() => {
    const selectedElements: Array<ReactElement> = [];
    if (
      props.stateSelectedParticipantTypeGlobal === 'customer' &&
      props.stateSelectedParticipantCustomerInformationGlobal !== undefined
    ) {
      selectedElements.push(
        <CardParticipant
          {...props}
          participantType={props.stateSelectedParticipantTypeGlobal}
          stateCustomerInformation={
            props.stateSelectedParticipantCustomerInformationGlobal
          }
          stateRideProviderInformation={null}
          stateParticipantId={
            props.stateSelectedParticipantCustomerInformationGlobal.id
          }
          label={intl.formatMessage(
            {
              id: 'getacar.spectator.message.lastSelected',
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
    if (
      props.stateSelectedParticipantTypeGlobal === 'ride_provider' &&
      props.stateSelectedParticipantRideProviderInformationGlobal !== undefined
    ) {
      selectedElements.push(
        <CardParticipant
          {...props}
          participantType={props.stateSelectedParticipantTypeGlobal}
          stateCustomerInformation={null}
          stateRideProviderInformation={
            props.stateSelectedParticipantRideProviderInformationGlobal
          }
          stateParticipantId={
            props.stateSelectedParticipantRideProviderInformationGlobal.id
          }
          label={intl.formatMessage(
            {
              id: 'getacar.spectator.message.lastSelected',
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
    if (
      props.stateSelectedParticipantRideRequestInformationGlobal !== undefined
    ) {
      selectedElements.push(
        <CardRideRequest
          {...props}
          stateRideRequestInformation={
            props.stateSelectedParticipantRideRequestInformationGlobal
          }
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
        />
      );
    }
    if (
      props.stateSelectedParticipantTypeGlobal !== 'ride_provider' &&
      props.stateSelectedParticipantRideProviderInformationGlobal !== undefined
    ) {
      selectedElements.push(
        <CardParticipant
          {...props}
          participantType={
            props.stateSelectedParticipantRideProviderInformationGlobal.type
          }
          stateCustomerInformation={null}
          stateRideProviderInformation={
            props.stateSelectedParticipantRideProviderInformationGlobal
          }
          stateParticipantId={
            props.stateSelectedParticipantRideProviderInformationGlobal.id
          }
          label={intl.formatMessage({
            id: 'getacar.spectator.message.driver',
          })}
        />
      );
    }
    if (
      props.stateSelectedParticipantTypeGlobal !== 'customer' &&
      props.stateSelectedParticipantCustomerInformationGlobal !== undefined
    ) {
      selectedElements.push(
        <CardParticipant
          {...props}
          participantType={
            props.stateSelectedParticipantCustomerInformationGlobal.type
          }
          stateCustomerInformation={
            props.stateSelectedParticipantCustomerInformationGlobal
          }
          stateRideProviderInformation={null}
          stateParticipantId={
            props.stateSelectedParticipantCustomerInformationGlobal.id
          }
          label={intl.formatMessage({
            id: 'getacar.spectator.message.passenger',
          })}
        />
      );
    }
    return [
      {
        elements: selectedElements,
        icon: <ConnectedElementsIcon fontSize="large" />,
        title: 'Connected Elements',
      },
    ];
  }, [intl, props]);

  const stateInfoElements = useMemo<Array<InfoElement>>(
    () => [
      {
        description: intl.formatMessage({
          id: 'page.home.tab.blockchain.section.smartContracts.content',
        }),
        title: intl.formatMessage({
          id: 'page.home.tab.blockchain.section.smartContracts.title',
        }),
      },
      {
        description:
          'Include real ID/Names in the table or is it enough in the modal (if available to spectator?)',
        title: 'TODO',
      },
    ],
    [intl]
  );

  return (
    <TabContainer fullPage={true}>
      <Box
        sx={{
          '& > *': {m: 1},
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          marginBottom: `${stateSettingsUiGridSpacing / 2}rem`,
          marginTop: `${stateSettingsUiGridSpacing / 2}rem`,
        }}
      >
        <SectionChangeSpectator {...props} />
      </Box>
      <GridConnectedElementsLayout
        stateSettingsUiGridSpacing={stateSettingsUiGridSpacing}
        stateConnectedElements={stateConnectedElements}
        stateInfoElements={stateInfoElements}
      >
        <Grid container spacing={stateSettingsUiGridSpacing}>
          <Grid item xs={12}>
            <SearchBar placeholder="TODO: Search map" {...props} />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                height: `calc(100vh - 13rem - ${
                  (stateSettingsUiGridSpacing / 2) * 3
                }rem)`,
              }}
            >
              <TableBlockchain {...props} />
            </Box>
          </Grid>
        </Grid>
      </GridConnectedElementsLayout>
    </TabContainer>
  );
}
