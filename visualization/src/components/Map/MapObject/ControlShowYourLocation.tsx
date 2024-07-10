// Package imports
import {memo} from 'react';
import {useIntl} from 'react-intl';
import {useMap} from 'react-leaflet';
// > Components
import Control from 'react-leaflet-custom-control';
import {Tooltip} from '@mui/material';
// Local imports
// > Components
import {FindLocationIcon} from '@components/Icons';
// > Misc
import {debugComponentRender} from '@misc/debug';
// Type imports
import type {ReactSetState} from '@misc/react';

export default memo(ControlShowYourLocation);

export interface ControlShowYourLocationProps {
  setStateCurrentPosLat: ReactSetState<undefined | number>;
  setStateCurrentPosLong: ReactSetState<undefined | number>;
}

export function ControlShowYourLocation({
  setStateCurrentPosLat,
  setStateCurrentPosLong,
}: ControlShowYourLocationProps) {
  debugComponentRender('ControlShowYourLocation');

  const map = useMap();
  const intl = useIntl();

  return (
    <Control prepend position="bottomright">
      <Tooltip title={intl.formatMessage({id: 'location.showYour'})}>
        <div className="leaflet-bar">
          <a
            onClick={() => {
              map
                .locate({setView: true})
                .on('locationerror', () => {
                  alert(intl.formatMessage({id: 'location.accessDenied'}));
                })
                .on('locationfound', a => {
                  setStateCurrentPosLat(a.latlng.lat);
                  setStateCurrentPosLong(a.latlng.lng);
                });
            }}
          >
            <FindLocationIcon style={{marginTop: '3px'}} />
          </a>
        </div>
      </Tooltip>
    </Control>
  );
}
