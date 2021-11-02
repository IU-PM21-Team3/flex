import React, { useState, useEffect } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import { stringify } from "querystring";
import axios from "axios";

interface GMapWindow extends Window {
  google: any;
}
declare const window: GMapWindow;
interface GMapWindow extends Window {
  google: any;
}
declare const google: GMapWindow;

var business_status: any = "";

async function Get_buisiness_stats(placeID: string) {
  var config = {
    method: "get",
    url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&fields=name%2Crating%2Cformatted_phone_number%2Cbusiness_status&key=AIzaSyD5hEtmrnaidWTm_VEVo0Qq6lmgV4WyWKQ`,
    headers: {},
  };

  return await axios(config)
    .then(function (response: any) {
      business_status = /"business_status" : (.+)/.exec(JSON.stringify(response.data))[1];
      return business_status;
    })
    .catch(function (error: any) {
      console.log(error);
    });
}

export default function PlaceInfo() {
  const places = [
    { info: "あいうえお", location: { lat: 35.69575, lng: 139.77521 } },
  ];

  const [selected, setSelected] = useState(null);

  let buisiness_status: any;
  let placeID: string

  useEffect(() => {
    buisiness_status = Get_buisiness_stats(placeID)
  });

  return (
    <>
      {places.map((marker) => (
        <Marker
          key={`${marker.location.lat * marker.location.lng}`}
          position={{
            lat: marker.location.lat,
            lng: marker.location.lng,
          }}
          onMouseOver={() => {
            setSelected(marker);
            // マウスオーバーで<InfoWindow>が描画されます。
          }}
          icon={{
            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT30_Pzks-acC6IR3VZ6L3vBugTbOl_1u_wTQ&usqp=CAU",
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 15),
            scaledSize: new window.google.maps.Size(30, 30),
            // ここでアイコン表示の設定ができます。
          }}
        />
      ))}

      {selected ? (
        // MarkerにマウスオーバーされたときにInfoWindowが表示されます。
        <InfoWindow
          position={{
            lat: selected.location.lat,
            lng: selected.location.lng,
          }}
          onCloseClick={() => {
            setSelected(null);
          }}
        >
          <div>{selected.info}</div>
        </InfoWindow>
      ) : null}
    </>
  );
}
