'use client';

// Package imports
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
// > Icons
import {
  DirectionsCar as DirectionsCarIcon,
  DirectionsWalk as DirectionsWalkIcon,
} from '@mui/icons-material';
// Local imports
// > Styles
import styles from '@styles/Map.module.scss';

export const participantIconSize = 32;

const iconCustomerHTML = ReactDOMServer.renderToString(<DirectionsWalkIcon />);
const iconRideProviderHTML = ReactDOMServer.renderToString(
  <DirectionsCarIcon />
);
const iconCustomerHTMLGray = ReactDOMServer.renderToString(
  <DirectionsWalkIcon fill="gray" />
);
const iconRideProviderHTMLGray = ReactDOMServer.renderToString(
  <DirectionsCarIcon fill="gray" />
);

export const iconCustomer = L.divIcon({
  className: styles['leaflet-div-icon-clean-bg'],
  html: iconCustomerHTML,
  iconAnchor: [participantIconSize / 3, participantIconSize / 3],
  iconSize: new L.Point(participantIconSize * 2, participantIconSize * 2),
  popupAnchor: [0, -participantIconSize / 2],
  tooltipAnchor: [0, 0],
});
export const iconRideProvider = L.divIcon({
  className: styles['leaflet-div-icon-clean-bg'],
  html: iconRideProviderHTML,
  iconAnchor: [participantIconSize / 3, participantIconSize / 3],
  iconSize: new L.Point(participantIconSize * 2, participantIconSize * 2),
  popupAnchor: [0, -participantIconSize / 2],
});

// Different color icons
export const iconCustomerGray = L.divIcon({
  className: styles['leaflet-div-icon-clean-bg-gray'],
  html: iconCustomerHTMLGray,
  iconAnchor: [participantIconSize / 2, participantIconSize / 2],
  iconSize: new L.Point(participantIconSize, participantIconSize),
});
export const iconRideProviderGray = L.divIcon({
  className: styles['leaflet-div-icon-clean-bg-gray'],
  html: iconRideProviderHTMLGray,
  iconAnchor: [participantIconSize / 2, participantIconSize / 2],
  iconSize: new L.Point(participantIconSize, participantIconSize),
});
