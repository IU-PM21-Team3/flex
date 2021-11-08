import React from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "600px",
  height: "400px",
};

const center = {
  lat: 35.69575,
  lng: 139.77521,
};

function G_Map() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyD5hEtmrnaidWTm_VEVo0Qq6lmgV4WyWKQ">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
      ></GoogleMap>
    </LoadScript>
  );
}

export default G_Map;
