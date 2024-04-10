import React, {useState, useEffect} from 'react';

function MyLocation() {
  const [position, setPosition] = useState<{
    lat: number | null;
    long: number | null;
  }>({
    lat: null,
    long: null,
  });

  //useEffect(() => {
  //  if ('geolocation' in navigator) {
  //    navigator.geolocation.getCurrentPosition(position => {
  //      setPosition({
  //        lat: position.coords.latitude,
  //        long: position.coords.longitude,
  //      });
  //    });
  //  } else {
  //    console.log('Geolocation is not available in your browser.');
  //  }
  //}, []);

  return (
    <div>
      <h3>My Current Location</h3>
      {position.lat && position.long ? (
        <p>
          Latitude: {position.lat}, Longitude: {position.long}
        </p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default MyLocation;
