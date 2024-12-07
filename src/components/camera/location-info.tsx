import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

function LocationInfo() {
  const mapRef = useRef();
  const mapContainerRef = useRef();

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiaHlleWVhaCIsImEiOiJjbDUzcHl3YWgwOHc2M2twb3V2bnBhbmZrIn0.THwmy8ODR-5qavK87Nwv6w";
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);
  return (
    <div className="rounded overflow-hidden">
      <div
        id="map-container"
        ref={mapContainerRef}
        className="w-full h-[200px]"
      />
    </div>
  );
}

export default LocationInfo;
