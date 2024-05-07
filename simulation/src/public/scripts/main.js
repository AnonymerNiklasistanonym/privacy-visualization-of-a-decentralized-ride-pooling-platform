/* eslint-disable no-console */

/* global fetch:readonly, document:readonly */
/* global L:readonly */
/* global globalStartPos:readonly, globalBaseUrlSimulation:readonly, globalSimulationEndpoints:readonly */

const options = {
  showAs: false,
  showMs: false,
};

/**
 * Fetch JSON data from endpoint
 * @param {string} endpoint
 */
const fetchJsonSimulation = async endpoint =>
  fetch(`${globalBaseUrlSimulation}${endpoint}`).then(data => data.json());
const fetchTextSimulation = async endpoint =>
  fetch(`${globalBaseUrlSimulation}${endpoint}`).then(data => data.text());

const iconCustomer = L.icon({
  iconUrl: '/icons/directions_walk_FILL0_wght400_GRAD0_opsz24.svg',
});
const iconRideProvider = L.icon({
  iconUrl: '/icons/directions_car_FILL0_wght400_GRAD0_opsz24.svg',
});

const main = async () => {
  // Add click listeners to existing elements

  const addButtonClick = (buttonId, toggleFunc) =>
    document
      .getElementById(buttonId)
      .addEventListener('click', () => toggleFunc());
  const addButtonClickEndpoint = (buttonId, endpoint) =>
    addButtonClick(buttonId, () => {
      fetchTextSimulation(endpoint).catch(err => console.error(err));
    });

  for (const [id, endpoint] of [
    ['buttonState', globalSimulationEndpoints.simulation.state],
    ['buttonPause', globalSimulationEndpoints.simulation.pause],
    ['buttonRun', globalSimulationEndpoints.simulation.run],
  ]) {
    addButtonClickEndpoint(id, endpoint);
  }

  addButtonClick('buttonToggleAS', () => {
    options.showAs = !options.showAs;
  });
  addButtonClick('buttonToggleMS', () => {
    options.showMs = !options.showMs;
  });

  // Add map and map rendering

  const map = L.map('map', {
    fullscreenControl: true,
  }).setView([globalStartPos.lat, globalStartPos.long], globalStartPos.zoom);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);
  map.on('popupopen', e => {
    const marker = e.popup._source;
    console.log('A popup was opened', marker, e);
  });

  /** @type {Array<import("leaflet").Circle|import("leaflet").Marker>} */
  const currentElements = [];
  let errorWasThrown = false;
  do {
    errorWasThrown = await renderMapElements(map, currentElements);
    // Wait for a little before updating the map information
    await new Promise(resolve => {
      setTimeout(resolve, 1000 / 2);
    });
  } while (!errorWasThrown);
};

/** @param {Array<any>} obj */
const renderArrayToHtml = obj => {
  if (!Array.isArray(obj)) {
    throw Error('Element was not an array!');
  }
  if (obj.length === 0) {
    return '[]';
  }
  return `<ul class="scrolling">${obj
    .map(a => {
      let value = a;
      if (
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value === 'string'
      ) {
        value = `${value}`;
      } else if (Array.isArray(value)) {
        value = renderArrayToHtml(value);
      } else if (typeof value === 'object') {
        value = renderObjectToHtml(value);
      } else {
        throw Error(`Encountered unknown type: ${typeof value}`);
      }
      return `<li>${value}</li>`;
    })
    .join('')}</ul>`;
};

/** @param {Array<any>} obj */
const renderObjectToHtml = obj => {
  if (typeof obj !== 'object') {
    throw Error('Element was not an object!');
  }
  const ignoreKeys = ['type', 'id', 'currentLocation', 'currentRoutes'];
  const content = [];
  for (const key in obj) {
    // Ignore keys used in the header
    if (ignoreKeys.includes(key)) {
      continue;
    }
    if (Object.hasOwn(obj, key)) {
      let value = obj[key];
      if (
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value === 'string' ||
        value === undefined ||
        value === null
      ) {
        value = `${value}`;
      } else if (Array.isArray(value)) {
        value = renderArrayToHtml(value);
      } else if (typeof value === 'object') {
        value = renderObjectToHtml(value);
      } else {
        throw Error(`Encountered unknown type: ${typeof value}`);
      }
      content.push(
        `<p style="font-size: 1em; margin-top: 0.2em; margin-bottom: 0.2em"><strong>${key}</strong>: ${value}</p>`
      );
    }
  }
  return `<ul class="scrolling">${content
    .map(a => `<li>${a}</li>`)
    .join('')}</ul>`;
};

const createPopupContent = obj => {
  const header = `<h4>${obj.type} (${obj.id})</h4>`;
  return header + renderObjectToHtml(obj);
};

/**
 * @param {Array<import("leaflet").Circle|import("leaflet").Marker>} currentElements
 * @param {import("leaflet").Map} map
 * @param {Date} currentDate
 * @param {import("../../../src/actors/participant").Participant|import("../../../src/actors/services").Service} jsonObj
 * @param {() => import("leaflet").Circle|import("leaflet").Marker} createElement
 */
const updateOrRenderElement = async (
  map,
  currentElements,
  currentDate,
  jsonObj,
  createElement
) => {
  if (jsonObj.rideRequest !== undefined) {
    jsonObj.rideRequestObj = (
      await fetchJsonSimulation(
        `${globalSimulationEndpoints.internal.rideRequest}${jsonObj.rideRequest}`
      )
    ).rideRequest;
  }

  let element = currentElements.find(a => a._custom_id === jsonObj.id);
  if (element !== undefined) {
    element.setLatLng(
      'currentLocation' in jsonObj
        ? new L.LatLng(
            jsonObj.currentLocation.lat,
            jsonObj.currentLocation.long
          )
        : 'currentArea' in jsonObj
          ? new L.LatLng(jsonObj.currentArea.lat, jsonObj.currentArea.long)
          : undefined
    );
  } else {
    element = createElement();
    element.addTo(map);
    const popup = L.popup();
    element.bindPopup(popup);
    element._custom_id = jsonObj.id;
    currentElements.push(element);
  }
  if (!element.isPopupOpen()) {
    element.setPopupContent(createPopupContent(jsonObj));
  }
  element._custom_date = currentDate;
};

/**
 * @param {Array<import("leaflet").Circle|import("leaflet").Marker>} currentElements
 * @param {import("leaflet").Map} map
 * @returns {Promise<boolean>}
 */
const renderMapElements = async (map, currentElements) => {
  const currentDate = new Date();
  for (const element of currentElements) {
    if (element._custom_date === undefined) {
      map.removeLayer(element);
    }
    if (
      !options.showAs &&
      element._custom_id !== undefined &&
      element._custom_id.startsWith('as')
    ) {
      map.removeLayer(element);
    }
    if (
      !options.showMs &&
      element._custom_id !== undefined &&
      element._custom_id.startsWith('ms')
    ) {
      map.removeLayer(element);
    }
  }
  // Fetch current actors and draw them on the map
  if (options.showAs) {
    for (const authenticationService of (
      await fetchJsonSimulation(
        globalSimulationEndpoints.internal.authenticationServices
      )
    ).authenticationServices) {
      await updateOrRenderElement(
        map,
        currentElements,
        currentDate,
        authenticationService,
        () =>
          L.circle(
            [
              authenticationService.currentArea.lat,
              authenticationService.currentArea.long,
            ],
            {
              fillColor: '#f03',
              fillOpacity: 0.2,
              radius: authenticationService.currentArea.radius,
            }
          )
      );
    }
  }
  if (options.showMs) {
    for (const matchingService of (
      await fetchJsonSimulation(
        globalSimulationEndpoints.internal.matchingServices
      )
    ).matchingServices) {
      await updateOrRenderElement(
        map,
        currentElements,
        currentDate,
        matchingService,
        () =>
          L.circle(
            [matchingService.currentArea.lat, matchingService.currentArea.long],
            {
              fillColor: '#03f',
              fillOpacity: 0.2,
              radius: matchingService.currentArea.radius,
            }
          )
      );
    }
  }
  for (const customer of (
    await fetchJsonSimulation(globalSimulationEndpoints.internal.customers)
  ).customers) {
    await updateOrRenderElement(
      map,
      currentElements,
      currentDate,
      customer,
      () =>
        L.marker(
          [customer.currentLocation.lat, customer.currentLocation.long],
          {
            icon: iconCustomer,
          }
        )
    );
  }
  for (const rideProvider of (
    await fetchJsonSimulation(globalSimulationEndpoints.internal.rideProviders)
  ).rideProviders) {
    await updateOrRenderElement(
      map,
      currentElements,
      currentDate,
      rideProvider,
      () =>
        L.marker(
          [rideProvider.currentLocation.lat, rideProvider.currentLocation.long],
          {
            icon: iconRideProvider,
          }
        )
    );
  }
  currentElements = currentElements.filter(element => {
    if (
      element._custom_date !== undefined &&
      element._custom_date !== currentDate
    ) {
      console.log('Remove element that doesn`t exist any more', element);
      map.removeLayer(element);
      return false;
    }
    return true;
  });
  return false;
};

main().catch(err => console.error(err));
