// Package imports
import {useIntl} from 'react-intl';
import {useMemo} from 'react';
// > Components
import {List, Typography} from '@mui/material';
// Local imports
// > Components
import {ParticipantRideRequestIcon, SettingsDebugIcon} from '@components/Icons';
import CardGeneric from '@components/Card/CardGeneric';
import {RenderDataElement} from '../CardParticipant/PopupContentGeneric';
// Type imports
import type {
  CardGenericProps,
  CardGenericPropsContentElement,
} from '@components/Card/CardGeneric';
import type {ChangeViewButtonProps} from '@components/Button/ChangeSpectatorButton';
import type {GlobalPropsIntlValues} from '@misc/props/global';
import type {ReactState} from '@misc/react';
import type {SettingsGlobalProps} from '@misc/props/settings';
import type {SimulationEndpointRideRequestInformation} from '@globals/types/simulation';

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
      name={intl.formatMessage({id: 'getacar.rideRequest'})}
      id={stateRideRequestId}
      status={stateRideRequestInformation?.auctionStatus}
      content={content}
    />
  );
}
