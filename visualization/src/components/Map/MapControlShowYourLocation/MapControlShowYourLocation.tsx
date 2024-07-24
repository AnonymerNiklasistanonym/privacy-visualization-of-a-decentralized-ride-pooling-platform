// Package imports
import {memo, useCallback} from 'react';
import {useIntl} from 'react-intl';
import {useMap} from 'react-leaflet';
// > Components
import Control from 'react-leaflet-custom-control';
// Local imports
// > Components
import {FindLocationIcon} from '@components/Icons';
// > Misc
import {debugComponentRender} from '@misc/debug';
// Type imports
import type {Coordinates} from '@globals/types/coordinates';
import type {ReactSetState} from '@misc/react';

export default memo(MapControlShowYourLocation);

export interface MapControlShowYourLocationProps {
  setStateCurrentPos: ReactSetState<undefined | Coordinates>;
}

export function MapControlShowYourLocation({
  setStateCurrentPos,
}: MapControlShowYourLocationProps) {
  debugComponentRender('ControlShowYourLocation');

  const map = useMap();
  const intl = useIntl();

  const findLocation = useCallback(() => {
    map
      .locate({setView: true})
      .on('locationerror', () => {
        alert(intl.formatMessage({id: 'location.accessDenied'}));
      })
      .on('locationfound', a => {
        setStateCurrentPos({lat: a.latlng.lat, long: a.latlng.lng});
      });
  }, [intl, map, setStateCurrentPos]);

  return (
    <Control prepend position="bottomright">
      <div className="leaflet-bar">
        <a
          onClick={findLocation}
          title={intl.formatMessage({id: 'location.showYour'})}
        >
          <FindLocationIcon style={{marginTop: '3px'}} />
        </a>
      </div>
    </Control>
  );
}
