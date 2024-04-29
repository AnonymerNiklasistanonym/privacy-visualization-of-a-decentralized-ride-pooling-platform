/* global window:readonly, fetch:readonly, document:readonly */
/* global L:readonly */
/* global globalPort:readonly, globalStartPos:readonly */

let showAs = false;
let showMs = false;

window.addEventListener('load', async () => {
  const baseUrl = `http://localhost:${globalPort}`;
  const fetchElement = async endpoint => {
    const result = await fetch(`${baseUrl}/json/${endpoint}`).then(data =>
      data.json()
    );
    //console.debug(`requested endpoint '${endpoint}':`, result);
    return result;
  };
  const buttonSimulation = async endpoint => {
    const result = await fetch(`${baseUrl}/simulation/${endpoint}`).then(data =>
      data.text()
    );
    console.debug(`requested simulation endpoint '${endpoint}':`, result);
  };

  document
    .getElementById('buttonState')
    .addEventListener('click', () =>
      buttonSimulation('state').catch(err => console.error(err))
    );
  document
    .getElementById('buttonPause')
    .addEventListener('click', () =>
      buttonSimulation('pause').catch(err => console.error(err))
    );
  document
    .getElementById('buttonRun')
    .addEventListener('click', () =>
      buttonSimulation('run').catch(err => console.error(err))
    );
  document.getElementById('buttonToggleAS').addEventListener('click', () => {
    showAs = !showAs;
  });
  document.getElementById('buttonToggleMS').addEventListener('click', () => {
    showMs = !showMs;
  });

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
  const iconCustomer = L.icon({
    iconUrl: '/icons/directions_walk_FILL0_wght400_GRAD0_opsz24.svg',
  });
  const iconRideProvider = L.icon({
    iconUrl: '/icons/directions_car_FILL0_wght400_GRAD0_opsz24.svg',
  });
  const createPopupContent = obj => {
    const header = `<h2>${obj.type} (${obj.id})</h2>`;
    const content = [];
    for (const key in obj) {
      if (['id', 'type', 'currentLocation', 'currentArea'].includes(key)) {
        continue;
      }
      if (Object.hasOwn(obj, key)) {
        let value = obj[key];
        if (key === 'passengers') {
          value = `<ul class="scrolling">${obj[key]
            .map(a => `<li>${a}</li>`)
            .join('')}</ul>`;
        }
        if (key === 'rideRequestOld') {
          value = `<ul class="scrolling"><li>state: ${obj[key]['state']}</li><li>destination: ${obj[key]['address']}</li></ul>`;
        }
        if (key === 'participantDb') {
          value = `<ul class="scrolling">${obj[key]
            .map(
              a =>
                `<li>${a.contactDetails.id}<ul>${a.pseudonyms
                  .map(b => `<li>${b}</li>`)
                  .join('')}</ul></li>`
            )
            .join('')}</ul>`;
        }
        if (key === 'auctionsDb') {
          value = `<ul class="scrolling">${obj[key]
            .map(a => `<li>${JSON.stringify(a)}</li>`)
            .join('')}</ul>`;
        }
        content.push(
          `<p style="font-size: 1em; margin-top: 0.2em; margin-bottom: 0.2em"><strong>${key}</strong>: ${value}</p>`
        );
      }
    }
    return header + content.join('');
  };
  let currentElements = [];
  let errorWasThrown = false;
  do {
    const currentDate = new Date();
    for (const element of currentElements) {
      if (element._custom_date === undefined) {
        map.removeLayer(element);
      }
      if (
        !showAs &&
        element._custom_id !== undefined &&
        element._custom_id.startsWith('as')
      ) {
        map.removeLayer(element);
      }
      if (
        !showMs &&
        element._custom_id !== undefined &&
        element._custom_id.startsWith('ms')
      ) {
        map.removeLayer(element);
      }
    }
    // Fetch current actors and draw them on the map
    if (showAs) {
      for (const authenticationService of (
        await fetchElement('authentication_services')
      ).authenticationServices) {
        const element = currentElements.find(
          a => a._custom_id === authenticationService.id
        );
        if (element !== undefined) {
          element.setLatLng(
            new L.LatLng(
              authenticationService.currentArea.lat,
              authenticationService.currentArea.long
            )
          );
          element.setPopupContent(createPopupContent(authenticationService));
          element._custom_date = currentDate;
          continue;
        }
        const circle = L.circle(
          [
            authenticationService.currentArea.lat,
            authenticationService.currentArea.long,
          ],
          {
            fillColor: '#f03',
            fillOpacity: 0.2,
            radius: authenticationService.currentArea.radius,
          }
        );
        circle.addTo(map);
        circle.bindPopup(createPopupContent(authenticationService));
        circle._custom_id = authenticationService.id;
        circle._custom_date = currentDate;
        currentElements.push(circle);
      }
    }
    if (showMs) {
      let matchingServices = [];
      try {
        matchingServices = (await fetchElement('matching_services'))
          .matchingServices;
      } catch (err) {
        console.error(err);
        errorWasThrown = true;
      }
      for (const matchingService of matchingServices) {
        const element = currentElements.find(
          a => a._custom_id === matchingService.id
        );
        if (element !== undefined) {
          element.setLatLng(
            new L.LatLng(
              matchingService.currentArea.lat,
              matchingService.currentArea.long
            )
          );
          element.setPopupContent(createPopupContent(matchingService));
          element._custom_date = currentDate;
          continue;
        }
        const circle = L.circle(
          [matchingService.currentArea.lat, matchingService.currentArea.long],
          {
            fillColor: '#03f',
            fillOpacity: 0.2,
            radius: matchingService.currentArea.radius,
          }
        );
        circle.addTo(map);
        circle.bindPopup(createPopupContent(matchingService));
        circle._custom_id = matchingService.id;
        circle._custom_date = currentDate;
        currentElements.push(circle);
      }
    }
    let customers = [];
    try {
      customers = (await fetchElement('customers')).customers;
    } catch (err) {
      console.error(err);
      errorWasThrown = true;
    }
    for (const customer of customers) {
      const element = currentElements.find(a => a._custom_id === customer.id);
      if (element !== undefined) {
        element.setLatLng(
          new L.LatLng(
            customer.currentLocation.lat,
            customer.currentLocation.long
          )
        );
        element.setPopupContent(createPopupContent(customer));
        element._custom_date = currentDate;
        continue;
      }
      const marker = L.marker(
        [customer.currentLocation.lat, customer.currentLocation.long],
        {icon: iconCustomer}
      );
      marker.addTo(map);
      const popup = L.popup();
      popup.setContent(createPopupContent(customer));
      marker.bindPopup(popup);
      marker._custom_id = customer.id;
      marker._custom_date = currentDate;
      currentElements.push(marker);
    }
    for (const rideProvider of (await fetchElement('ride_providers'))
      .rideProviders) {
      const element = currentElements.find(
        a => a._custom_id === rideProvider.id
      );
      if (element !== undefined) {
        element.setLatLng(
          new L.LatLng(
            rideProvider.currentLocation.lat,
            rideProvider.currentLocation.long
          )
        );
        element.setPopupContent(createPopupContent(rideProvider));
        element._custom_date = currentDate;
        continue;
      }
      const marker = L.marker(
        [rideProvider.currentLocation.lat, rideProvider.currentLocation.long],
        {icon: iconRideProvider}
      );
      marker.addTo(map);
      marker.bindPopup(createPopupContent(rideProvider));
      marker._custom_id = rideProvider.id;
      marker._custom_date = currentDate;
      currentElements.push(marker);
    }
    currentElements = currentElements.filter(element => {
      if (
        element._custom_date !== undefined &&
        element._custom_date !== currentDate
      ) {
        console.log(
          'Remove',
          element,
          element._custom_date !== currentDate,
          element._custom_date,
          currentDate
        );
        map.removeLayer(element);
        return false;
      }
      return true;
    });
    // Wait for a little
    await new Promise(resolve => {
      setTimeout(resolve, 1000 / 2);
    });
  } while (!errorWasThrown);
});
