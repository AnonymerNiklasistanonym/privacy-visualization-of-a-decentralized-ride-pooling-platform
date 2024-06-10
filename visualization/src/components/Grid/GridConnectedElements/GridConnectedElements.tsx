// Package imports
import {useIntl} from 'react-intl';
// > Components
import {Card, CardContent, Grid} from '@mui/material';
// Local imports
// > Components
import CardParticipant from '@components/Card/CardParticipant';
import CardRideRequest from '@components/Card/CardRideRequest';
// Type imports
import type {
  GlobalPropsFetch,
  GlobalPropsParticipantSelectedElements,
  GlobalPropsParticipantSelectedElementsSet,
  GlobalPropsSearch,
  GlobalPropsShowError,
  GlobalPropsSpectatorMap,
  GlobalPropsSpectatorSelectedElements,
  GlobalPropsSpectatorSelectedElementsSet,
  GlobalPropsSpectatorsSet,
} from '@misc/props/global';
import type {MapProps} from '@components/Map';
import type {ReactNode} from 'react';
import type {ReactSetState} from '@misc/react';
import type {SettingsMapProps} from '@misc/props/settings';

export interface GridConnectedElementsProps
  extends GlobalPropsSpectatorSelectedElements,
    GlobalPropsSpectatorSelectedElementsSet,
    GlobalPropsParticipantSelectedElements,
    GlobalPropsParticipantSelectedElementsSet,
    SettingsMapProps,
    MapProps,
    GlobalPropsSpectatorsSet,
    GlobalPropsSpectatorMap,
    GlobalPropsSearch,
    GlobalPropsShowError,
    GlobalPropsFetch {
  setStateSelectedElementCount: ReactSetState<number>;
}

export default function GridConnectedElements(
  props: GridConnectedElementsProps
) {
  const {
    stateSelectedParticipantTypeGlobal,
    stateSelectedParticipantCustomerInformationGlobal,
    setStateSelectedParticipantTypeGlobal,
    setStateSelectedParticipantCustomerInformationGlobal,
    setStateSelectedParticipantRideRequestInformationGlobal,
    setStateSelectedParticipantRideProviderInformationGlobal,
    stateSelectedParticipantRideProviderInformationGlobal,
    stateSelectedParticipantRideRequestInformationGlobal,
    setStateSelectedElementCount,
  } = props;
  const intl = useIntl();

  const onDelete = () => {
    setStateSelectedParticipantTypeGlobal(undefined);
    setStateSelectedParticipantCustomerInformationGlobal(undefined);
    setStateSelectedParticipantRideRequestInformationGlobal(undefined);
    setStateSelectedParticipantRideProviderInformationGlobal(undefined);
  };

  const selectedElements: Array<ReactNode> = [];
  if (
    stateSelectedParticipantTypeGlobal === 'customer' &&
    stateSelectedParticipantCustomerInformationGlobal !== undefined
  ) {
    selectedElements.push(
      <CardParticipant
        {...props}
        participantType={stateSelectedParticipantTypeGlobal}
        stateCustomerInformation={
          stateSelectedParticipantCustomerInformationGlobal
        }
        stateRideProviderInformation={null}
        stateParticipantId={
          stateSelectedParticipantCustomerInformationGlobal.id
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
        onDelete={onDelete}
      />
    );
  }
  if (
    stateSelectedParticipantTypeGlobal === 'ride_provider' &&
    stateSelectedParticipantRideProviderInformationGlobal !== undefined
  ) {
    selectedElements.push(
      <CardParticipant
        {...props}
        participantType={stateSelectedParticipantTypeGlobal}
        stateCustomerInformation={null}
        stateRideProviderInformation={
          stateSelectedParticipantRideProviderInformationGlobal
        }
        stateParticipantId={
          stateSelectedParticipantRideProviderInformationGlobal.id
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
        onDelete={onDelete}
      />
    );
  }
  if (stateSelectedParticipantRideRequestInformationGlobal !== undefined) {
    selectedElements.push(
      <CardRideRequest
        {...props}
        stateRideRequestInformation={
          stateSelectedParticipantRideRequestInformationGlobal
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
    stateSelectedParticipantTypeGlobal !== 'ride_provider' &&
    stateSelectedParticipantRideProviderInformationGlobal !== undefined
  ) {
    selectedElements.push(
      <CardParticipant
        {...props}
        participantType={
          stateSelectedParticipantRideProviderInformationGlobal.type
        }
        stateCustomerInformation={null}
        stateRideProviderInformation={
          stateSelectedParticipantRideProviderInformationGlobal
        }
        stateParticipantId={
          stateSelectedParticipantRideProviderInformationGlobal.id
        }
        label={intl.formatMessage({
          id: 'getacar.spectator.message.driver',
        })}
      />
    );
  }
  if (
    stateSelectedParticipantTypeGlobal !== 'customer' &&
    stateSelectedParticipantCustomerInformationGlobal !== undefined
  ) {
    selectedElements.push(
      <CardParticipant
        {...props}
        participantType={stateSelectedParticipantCustomerInformationGlobal.type}
        stateCustomerInformation={
          stateSelectedParticipantCustomerInformationGlobal
        }
        stateRideProviderInformation={null}
        stateParticipantId={
          stateSelectedParticipantCustomerInformationGlobal.id
        }
        label={intl.formatMessage({
          id: 'getacar.spectator.message.passenger',
        })}
      />
    );
  }
  setStateSelectedElementCount(selectedElements.length);

  return (
    <Grid
      item
      xs={12}
      sm={12}
      md={selectedElements.length === 0 ? 0 : 6}
      xl={
        selectedElements.length === 0
          ? 0
          : selectedElements.length === 1
            ? 3
            : 6
      }
    >
      <Grid container spacing={2} justifyContent="left">
        {selectedElements.map((a, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={12}
            xl={selectedElements.length === 1 ? 12 : 6}
            key={index}
          >
            <Card>
              <CardContent>{a}</CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
