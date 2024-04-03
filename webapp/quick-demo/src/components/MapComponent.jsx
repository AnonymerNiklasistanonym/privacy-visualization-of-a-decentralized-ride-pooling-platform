
import Map from '@components/Map';
import styles from '@styles/Home.module.scss';

import PopupContentActor from "./PopupContentActor"


//import "react-leaflet-fullscreen/styles.css";
//import { FullscreenControl } from "react-leaflet-fullscreen";


export default function MapComponent ({customersState, customersSignal, rideProvidersState, rideProvidersSignal, startPos, spectatorState, spectatorSignal, setStateSpectator}) {
    console.log("Update MapComponent")

    return (
<Map className={styles.homeMap} width="800" height="400" center={[startPos.lat, startPos.long]} zoom={startPos.zoom}>
{({ TileLayer, Marker, Popup }) => {
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
      return (
        <Marker key={`customer_${customer.id}`} position={[customer.currentLocation.lat, customer.currentLocation.long]} icon={iconCustomer}>
        <Popup><PopupContentActor actor={customer} spectatorState={spectatorState} setStateSpectator={setStateSpectator}/></Popup>
        </Marker>
      )
    })}
    {rideProvidersState.map((rideProvider) => {
      return (
        <Marker key={`rideProvider_${rideProvider.id}`} position={[rideProvider.currentLocation.lat, rideProvider.currentLocation.long]} icon={iconRideProvider}>
          <Popup><PopupContentActor actor={rideProvider} spectatorState={spectatorState} setStateSpectator={setStateSpectator}/></Popup>
        </Marker>
      )
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
