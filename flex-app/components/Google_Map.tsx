import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

type Pos = {
  lat: number;
  lng: number;
};

type GMapProps = {
  isMarkerShown?: boolean;
  containerSize?: {
    width: string;
    height: string;
  };
  center?: Pos;
  setLatLng?: React.Dispatch<React.SetStateAction<Pos | undefined>>;
};

const defaultContainerSize = {
  width: "600px",
  height: "400px",
};

// 東京駅
const defaultCenter = {
  lat: 35.6812362,
  lng: 139.7649361,
};


const GMap = (props: GMapProps) => {
  const [center, setCenter] = useState<Pos>();
  const [containerSize, setContainerSize] = useState<any>();

  useEffect(() => {
    if (props.containerSize) {
      setContainerSize(props.containerSize);
    } else {
      setContainerSize(defaultContainerSize);
    }

    if (props.center) {
      setCenter(props.center);
    } else {
      setCenter(defaultCenter);
    }
  }, []);

  // 地図をクリックしたときの座標を取得する
  const getLatLngByClick = (event: google.maps.MapMouseEvent) => {
    // const resLatLng = event.latLng?.toString();
    const resLat = event.latLng?.lat();
    const resLng = event.latLng?.lng();
    if (resLat && resLng && props.setLatLng) {
      props.setLatLng({
        lat: resLat,
        lng: resLng
      });
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyD5hEtmrnaidWTm_VEVo0Qq6lmgV4WyWKQ">
      <GoogleMap
        mapContainerStyle={{ ...containerSize }}
        center={center}
        zoom={13}
        onClick={getLatLngByClick}
      >
        {props.isMarkerShown && <Marker position={center ? center : defaultCenter} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default GMap;
