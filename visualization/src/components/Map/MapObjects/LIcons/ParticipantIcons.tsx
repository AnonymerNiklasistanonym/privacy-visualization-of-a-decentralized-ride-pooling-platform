'use client';

// Package imports
import L from 'leaflet';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import ReactDOMServer from 'react-dom/server';

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
  html: iconCustomerHTML,
  className: 'leaflet-div-icon2',
  iconSize: new L.Point(participantIconSize * 2, participantIconSize * 2),
  iconAnchor: [participantIconSize / 3, participantIconSize / 3],
  popupAnchor: [0, -participantIconSize / 2],
  tooltipAnchor: [0, 0],
});
export const iconRideProvider = L.divIcon({
  html: iconRideProviderHTML,
  className: 'leaflet-div-icon2',
  iconSize: new L.Point(participantIconSize, participantIconSize),
  iconAnchor: [participantIconSize / 2, participantIconSize / 2],
  popupAnchor: [0, 0],
});

// Different color icons
export const iconCustomerGray = L.divIcon({
  html: iconCustomerHTMLGray,
  className: '',
  iconSize: new L.Point(participantIconSize, participantIconSize),
  iconAnchor: [participantIconSize / 2, participantIconSize / 2],
});
export const iconRideProviderGray = L.divIcon({
  html: iconRideProviderHTMLGray,
  className: '',
  iconSize: new L.Point(participantIconSize, participantIconSize),
  iconAnchor: [participantIconSize / 2, participantIconSize / 2],
});
