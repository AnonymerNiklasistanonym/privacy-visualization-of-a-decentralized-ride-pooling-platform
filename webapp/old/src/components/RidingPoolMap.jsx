import React from 'react';
import Map, { Layer, Source, Marker } from "react-map-gl";
import { cellToBoundary, latLngToCell, gridDisk } from "h3-js";
import { Box, Divider, Modal, Typography } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import GpsNotFixedIcon from '@mui/icons-material/GpsNotFixed';
import { fetchDummyData } from "../dummyData"

import 'mapbox-gl/dist/mapbox-gl.css';

const RidingPoolMap = () => {
  const style = {
    position: 'absolute',
    top: '50%',
    right: '5%',
    transform: 'translate(0%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    maxHeight: '75vh',
    overflow: 'auto',
    boxShadow: 24,
    p: 4,
  };
  const resolution = 8;

  const [currentZoomValue, setCurrentZoomValue] = React.useState(13);
  const [currentCoordinateLng, setCurrentCoordinateLng] = React.useState(48.7758);
  const [currentCoordinateLat, setCurrentCoordinateLat] = React.useState(9.1829);
  const [currentCoordinate, setCurrentCoordinate] = React.useState([currentCoordinateLng, currentCoordinateLat]);
  const [currentClickedHexagon, setCurrentClickedHexagon] = React.useState(null);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
  }, [
    currentZoomValue,
    currentCoordinateLng,
    currentCoordinateLat,
    currentCoordinate,
    currentClickedHexagon,
  ]);

  function getClickableIndexes() {
    const getHexIndexWithDataDrop = fetchDummyData()
      .map((data) => latLngToCell(data.pickupLocation.coordinates[0], data.pickupLocation.coordinates[1], resolution));
    const getHexIndexWithDataPickup = fetchDummyData()
      .map((data) => latLngToCell(data.dropoffLocation.coordinates[0], data.dropoffLocation.coordinates[1], resolution));
    // merge and remove duplicates
    return new Set(getHexIndexWithDataDrop.concat(getHexIndexWithDataPickup));
  }

  function getHexagonIndexes() {
    const merged = getClickableIndexes();
    return getPolygonIndexes().map((polyIndex) => {
      return {
        type: "Feature",
        properties: {
          color: merged.has(polyIndex) ? "green" : "transparent",
          opacity: merged.has(polyIndex) ? 0.25 : 1.0,
          id: polyIndex,
        },
        geometry: {
          type: "Polygon",
          coordinates: [cellToBoundary(polyIndex, true)],
        }
      };
    });
  }

  function getPolygonIndexes() {
    if (currentZoomValue < 11) {
      return [];
    }
    return gridDisk(latLngToCell(currentCoordinateLng, currentCoordinateLat, resolution), 30);
  }

  function onMapClick(event) {
    // get polygon id
    const { lng, lat } = event.lngLat;
    const ply = latLngToCell(lat, lng, resolution);
    setCurrentClickedHexagon(ply);
    if (getClickableIndexes().has(ply)) {
      handleOpen();
    }
  }

  function getDataByPolygon(polygon) {
    return fetchDummyData().filter((data) => {
      const pickupLocation = latLngToCell(data.pickupLocation.coordinates[0],
        data.pickupLocation.coordinates[1], resolution);
      const dropoffLocation = latLngToCell(data.dropoffLocation.coordinates[0],
        data.dropoffLocation.coordinates[1], resolution);
      return pickupLocation === polygon || dropoffLocation === polygon;
    });
  }

  function renderMarkers() {
    const markersPickup = fetchDummyData()
      .map((data) => (
        <Marker
          longitude={data.pickupLocation.coordinates[1]}
          latitude={data.pickupLocation.coordinates[0]}
        >
          {
            data.role === "user" ? <EmojiPeopleIcon /> : <DirectionsCarIcon />
          }
        </Marker>
      ));
    const markersDropoff = fetchDummyData()
      .map((data) => (
        <Marker
          longitude={data.dropoffLocation.coordinates[1]}
          latitude={data.dropoffLocation.coordinates[0]}
        >
          {
            data.role === "user" ? <EmojiPeopleIcon /> : <DirectionsCarIcon />
          }
        </Marker>
      ));
    // merge and remove duplicates
    return markersPickup.concat(markersDropoff);
  }

  function onPropertyChange(event) {
    setCurrentCoordinateLng(event.viewState.latitude);
    setCurrentCoordinateLat(event.viewState.longitude);
    setCurrentCoordinate([event.viewState.longitude, event.viewState.latitude]);
    setCurrentZoomValue(event.viewState.zoom)
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Hexagon: {currentClickedHexagon}
          </Typography>
          <Box id="modal-modal-description" sx={{ mt: 2 }}>
            {getDataByPolygon(currentClickedHexagon).map((data, index) => {
              return (
                <div>
                  {
                    index > 0 ? <Divider /> : null
                  }
                  <div>
                    {
                      data.role === "user" ? <EmojiPeopleIcon /> : <DirectionsCarIcon />
                    }
                  </div>
                  <div>Ride {index + 1}</div>

                  <Typography variant="h6" component="p">
                    UserID: {data.userId}
                  </Typography>
                  <Typography variant="h6" component="p">
                    Rating: {data.rating}/5
                  </Typography>
                  <Typography variant="h6" component="p">
                    Max Passenger: {data.maxPassengers}
                  </Typography>
                  <Typography variant="h6" component="p">
                    Max Waiting Time: {data.maxWaitingTime}min
                  </Typography>
                  <Typography variant="h6" component="p">
                    Min Passenger Rating: {data.minPassengerRating}/5
                  </Typography>

                  <Typography variant="h6" component="p">
                    Pickup Location: <GpsNotFixedIcon style={{ fontSize: "14px" }}></GpsNotFixedIcon> {data.pickupLocation.coordinates[0]}, {data.pickupLocation.coordinates[1]}
                  </Typography>

                  <Typography variant='h6' component="p">
                    Dropoff Location: <GpsNotFixedIcon style={{ fontSize: "14px" }}></GpsNotFixedIcon> {data.dropoffLocation.coordinates[0]}, {data.dropoffLocation.coordinates[1]}
                  </Typography>

                  <Typography variant="h6"
                    component="p" style={{ wordBreak: "break-word", display: "inline" }} >
                    User Public Key:
                  </Typography>
                  <Typography variant="h6"
                    component="p" style={{ wordBreak: "break-word", fontSize: "0.8rem" }} >
                    {data.userPublicKey}
                  </Typography>
                </div>

              )
            }
            )}

          </Box>
        </Box>
      </Modal>

      <div className="map">
        <Map
          initialViewState={{
            latitude: 48.7758,
            longitude: 9.1829,
            zoom: 13,
            bearing: 0,
            pitch: 45,
          }}
          //onMouseUp={update}
          onClick={onMapClick}
          onDrag={onPropertyChange}
          onZoomChanged={onPropertyChange}
          onMove={onPropertyChange}
          mapStyle="mapbox://styles/mapbox/light-v9"
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
          style={{
            height: "100vh",
            width: "100vw",
            maxHeight: "100vh",
            overflow: "hidden",
          }}
        >
          {
            renderMarkers()
          }

          <Source
            type="geojson"
            data={{
              "type": "FeatureCollection",
              "features": getHexagonIndexes(),
            }}
          >
            <Layer
              {...{
                type: "fill",
                paint: {
                  'fill-outline-color': 'green',
                  "fill-color": ["get", "color"],
                  "fill-opacity": ["get", "opacity"],
                },
              }}
            />
          </Source>

        </Map>
      </div>
    </div>
  );
};

export default RidingPoolMap
