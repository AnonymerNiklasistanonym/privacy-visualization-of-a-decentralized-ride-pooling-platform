
import Map from '@components/Map';
import styles from '@styles/Home.module.scss';

import PopupContentActor from "./PopupContentActor"

import {latLngToCell,cellsToMultiPolygon} from "h3-js";


//import "react-leaflet-fullscreen/styles.css";
//import { FullscreenControl } from "react-leaflet-fullscreen";


export default function MapComponent ({customersState, customersSignal, rideProvidersState, rideProvidersSignal, startPos, spectatorState, spectatorSignal, setStateSpectator}) {
    console.log("Update MapComponent")

    return (
<Map className={styles.homeMap} width="800" height="400" center={[startPos.lat, startPos.long]} zoom={startPos.zoom}>
{({ TileLayer, Marker, Popup, Circle, Polygon }) => {
    const L = require('leaflet');

    const iconCustomer = L.icon({
        iconUrl: "/icons/directions_walk_FILL0_wght400_GRAD0_opsz24.svg",
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: new L.Point(32, 32),
    });

    const iconRideProvider = L.icon({
        iconUrl: "/icons/directions_car_FILL0_wght400_GRAD0_opsz24.svg",
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: new L.Point(32, 32),
    });

  return (
  <>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
    />
    <Marker key="test" position={[startPos.lat, startPos.long]}>
      <Popup>{spectatorState} (signal={spectatorSignal.value})</Popup>
    </Marker>
    {customersState.map((customer) => {
      const marker = (
        <Marker key={`customer_${customer.id}`} position={[customer.currentLocation.lat, customer.currentLocation.long]} icon={iconCustomer}>
        <Popup><PopupContentActor actor={customer} spectatorState={spectatorState} setStateSpectator={setStateSpectator}/></Popup>
        </Marker>
      );
      if (customer.rideRequest) {
        const circle = <Circle
        center={{lat: customer.rideRequest.coordinates.lat, lng: customer.rideRequest.coordinates.long}}
        color={spectatorState === customer.id ? "blue" : "red"}
        fillColor={spectatorState === customer.id ? "blue" : "red"}
        radius={spectatorState === customer.id ? 400 : 50}>
            <Popup>Ride request of {customer.id} ({customer.rideRequest.address}) {spectatorState} === {customer.id} = {spectatorState === customer.id ? "true" : "false"}</Popup>
        </Circle>
        const h3Index = latLngToCell(customer.rideRequest.coordinates.lat, customer.rideRequest.coordinates.long, 7);
        const polygonData = cellsToMultiPolygon([h3Index])[0][0];
        //console.debug(JSON.stringify(polygonData.map(a => ({ lat: a[0], long: a[1] }))))
        const polygon = <Polygon positions={polygonData} />
        return <>{polygon}{circle}{marker}</>
      }
      return marker;
    })}
    {rideProvidersState.map((rideProvider) => {
      const marker = (
        <Marker key={`rideProvider_${rideProvider.id}`} position={[rideProvider.currentLocation.lat, rideProvider.currentLocation.long]} icon={iconRideProvider}>
          <Popup><PopupContentActor actor={rideProvider} spectatorState={spectatorState} setStateSpectator={setStateSpectator}/></Popup>
        </Marker>
      );
      return marker;
    })}
    {
    //<FullscreenControl />
    }
  </>
  )
}
}
</Map>
)
}
