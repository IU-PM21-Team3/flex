import React, { useState, useEffect } from "react";
import { DirectionsRenderer, DirectionsService, GoogleMap, InfoWindow, LoadScript, Marker } from "@react-google-maps/api";

type Pos = {
  lat: number;
  lng: number;
};

type GMapProps = {
  isMarkerShown?: boolean;
  zoom?: number;
  containerSize?: {
    width: string;
    height: string;
  };
  center?: Pos;
  positions?: Pos[] | undefined;
  setLatLng?: React.Dispatch<React.SetStateAction<Pos | undefined>>;
  oridesMode?: boolean;
  origin?: string,
  destination?: string;
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
  const [infoWindowSize, setInfoWindowSize] = useState<google.maps.Size | undefined>();
  const [containerSize, setContainerSize] = useState<any>();
  const [center, setCenter] = useState<Pos>();
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [response, setResponse] = useState();
  const [positions, setPositions] = useState<Pos[]>([]);

  // 吹き出し（infoWindow）の設定
  // いらなければ消す
  const infoWindowOptions = {
    pixelOffset: infoWindowSize,
  };
  const createOffsetSize = () => {
    return setInfoWindowSize(new window.google.maps.Size(0, -45));
  };
  useEffect(() => {
    if (props.containerSize) {
      setContainerSize(props.containerSize);
    } else {
      setContainerSize(defaultContainerSize);
    }
    if (props.center) {
      setCenter(props.center);
    }
    if (props.origin) {
      setOrigin(props.origin);
      console.log("G origin", origin);
    }
    if (props.destination) {
      setDestination(props.destination);
      console.log("G destination", destination);
    }
    if (props.positions) {
      setPositions(props.positions);
      console.log("G pos", positions);
    }
  }, [props.positions, props.origin, props.destination]);

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
    console.log(resLat, resLng);
  };

  // 経路表示に関するコールバック
  const directionsCallback = (response: any) => {
    console.log("response 1", response);
    if (response !== null) {
      if (response.status === "OK") {
        console.log("response ok", response);
        setResponse(response);
      } else {
        console.log("response err", response);
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyD5hEtmrnaidWTm_VEVo0Qq6lmgV4WyWKQ">
      <GoogleMap
        mapContainerStyle={{ ...containerSize }}
        zoom={props.zoom ? props.zoom : 13}
        onClick={getLatLngByClick}
        center={center}
        onLoad={() => createOffsetSize()}
      >
        {
          props.isMarkerShown && positions &&
          positions.map((pos, i) => (<Marker key={i} position={pos} />))
        }

        {
          props.isMarkerShown && center &&
          <Marker position={center} />
        }

        {/* 吹き出しをなんとなくで実装したがいらなければ消す */}
        {
          props.isMarkerShown && center &&
          <InfoWindow
            position={center}
            options={infoWindowOptions}
          >
            <div style={{ fontSize: "16px" }}>
              <h4>現在地</h4>
              {/* <p>lat: {center.lat}</p>
              <p>lng: {center.lng}</p> */}
            </div>
          </InfoWindow>
        }
        {
          props.isMarkerShown && props.oridesMode &&
          positions[0] &&
          <InfoWindow
            position={positions[0]}
            options={infoWindowOptions}
          >
            <div style={{ fontSize: "14px" }}>
              <h4>出発地: {origin}</h4>
            </div>
          </InfoWindow>

        }
        {
          props.isMarkerShown && props.oridesMode &&
          positions[1] &&
          <InfoWindow
            position={positions[1]}
            options={infoWindowOptions}
          >
            <div style={{ fontSize: "14px" }}>
              <h4>目的地: {destination}</h4>
            </div>

          </InfoWindow>
        }

        {/* 経路表示に関する部分 */}
        {/* {
          origin &&
          destination &&
          <DirectionsService
            options={{
              destination: destination,
              origin: origin,
            }}
            callback={directionsCallback}
          />
        }
        {
          response && (
            <DirectionsRenderer
              options={{
                directions: response
              }}
            />
          )
        } */}
      </GoogleMap>
    </LoadScript>
  );
};

export default GMap;
