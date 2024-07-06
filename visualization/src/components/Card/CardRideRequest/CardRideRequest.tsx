// Package imports
import {useIntl} from 'react-intl';
import {useMemo} from 'react';
// > Components
import {List, Typography} from '@mui/material';
// Local imports
// > Components
import {
  ParticipantCustomerIcon,
  ParticipantRideRequestIcon,
  SettingsDebugIcon,
} from '@components/Icons';
import CardGeneric from '@components/Card/CardGeneric';
// Type imports
import type {
  CardGenericProps,
  CardGenericPropsContentElement,
} from '@components/Card/CardGeneric';
import type {
  GlobalPropsIntlValues,
  GlobalPropsSpectatorSelectedElementsSet,
} from '@misc/props/global';
import type {ChangeViewButtonProps} from '@components/Button/ChangeSpectatorButton';
import type {ReactState} from '@misc/react';
import type {SimulationEndpointRideRequestInformation} from '@globals/types/simulation';
// A
import {
  type DataElement,
  RenderDataElement,
} from '../CardParticipant/PopupContentGeneric';
import {ParticipantsCustomer} from '@components/Tab/TabOverview/Elements';
import {SettingsGlobalProps} from '@misc/props/settings';

export interface CardRideRequestProps
  extends ChangeViewButtonProps,
    SettingsGlobalProps,
    CardGenericProps,
    GlobalPropsIntlValues {
  stateRideRequestInformation: ReactState<SimulationEndpointRideRequestInformation | null>;
  stateRideRequestId: ReactState<string>;
}

export default function CardRideRequest(props: CardRideRequestProps) {
  const {
    stateRideRequestInformation,
    stateRideRequestId,
    stateSettingsGlobalDebug,
  } = props;

  const intl = useIntl();

  const content = useMemo<Array<CardGenericPropsContentElement>>(() => {
    const contentList: Array<CardGenericPropsContentElement> = [];
    contentList.push({
      content: (
        <Typography variant="body1" gutterBottom>
          TODO: Add ride request information
        </Typography>
      ),
    });
    if (stateSettingsGlobalDebug === true) {
      contentList.push({
        content: (
          <List key={`debug-list-ride-request-${stateRideRequestId}`}>
            {Object.entries(stateRideRequestInformation ?? {}).map(
              ([key, value]) => (
                <RenderDataElement
                  {...props}
                  key={`debug-data-element-ride-provider-${stateRideRequestId}-${key}`}
                  element={{
                    content:
                      typeof value === 'string' ? value : JSON.stringify(value),
                    dataAccessInformation: [],
                    label: key,
                    showContentSpectator: [],
                  }}
                  id={stateRideRequestId}
                  dataOriginName={`Debug Ride Request (${stateRideRequestId})`}
                  dataOriginId={stateRideRequestId}
                  dataOriginIcon={<ParticipantRideRequestIcon />}
                  dataAccessInformation={[]}
                />
              )
            )}
          </List>
        ),
        label: intl.formatMessage({
          id: 'page.home.tab.settings.card.debug.title',
        }),
        labelIcon: <SettingsDebugIcon />,
      });
    }
    return contentList;
  }, [
    intl,
    props,
    stateRideRequestId,
    stateRideRequestInformation,
    stateSettingsGlobalDebug,
  ]);

  return (
    <CardGeneric
      {...props}
      icon={<ParticipantRideRequestIcon />}
      name={'Ride Request'}
      id={stateRideRequestId}
      status={stateRideRequestInformation?.auctionStatus}
      content={content}
    />
  );
}
