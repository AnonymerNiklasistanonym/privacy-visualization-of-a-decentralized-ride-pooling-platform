'use client';

// Package imports
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
// > Icons
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';

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
  iconAnchor: [participantIconSize / 3, participantIconSize / 3],
  iconSize: new L.Point(participantIconSize * 2, participantIconSize * 2),
  popupAnchor: [0, -participantIconSize / 2],
  tooltipAnchor: [0, 0],
});
export const iconRideProvider = L.divIcon({
  html: iconRideProviderHTML,
  iconAnchor: [participantIconSize / 3, participantIconSize / 3],
  iconSize: new L.Point(participantIconSize * 2, participantIconSize * 2),
  popupAnchor: [0, -participantIconSize / 2],
});

// Different color icons
export const iconCustomerGray = L.divIcon({
  className: '',
  html: iconCustomerHTMLGray,
  iconAnchor: [participantIconSize / 2, participantIconSize / 2],
  iconSize: new L.Point(participantIconSize, participantIconSize),
});
export const iconRideProviderGray = L.divIcon({
  className: '',
  html: iconRideProviderHTMLGray,
  iconAnchor: [participantIconSize / 2, participantIconSize / 2],
  iconSize: new L.Point(participantIconSize, participantIconSize),
});
