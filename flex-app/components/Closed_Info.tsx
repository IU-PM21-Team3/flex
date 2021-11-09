import React, { useState, useEffect } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import { stringify } from "querystring";
import axios, { AxiosResponse } from "axios";

let business_status: any = "";

export async function fetch_all_place_data(/* placeID: string*/) {
  return await axios
    .get(
      "https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJCewJkL2LGGAR3Qmk0vCTGkg&fields=geometry%2Cformatted_address%2Cname%2Crating%2Cformatted_phone_number%2Cbusiness_status&key=AIzaSyD5hEtmrnaidWTm_VEVo0Qq6lmgV4WyWKQ"
    )
    .then(function(response: any) {
      const result = response.data;
      if (result == null) return null;
      else return result;
    })
    .catch(function(error: any) {
      console.log(error);
    });
}

export async function Fetch_Lat(/* placeID: string*/) {
  return await axios
    .get(
      "https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJCewJkL2LGGAR3Qmk0vCTGkg&fields=geometry%2Cformatted_address%2Cname%2Crating%2Cformatted_phone_number%2Cbusiness_status&key=AIzaSyD5hEtmrnaidWTm_VEVo0Qq6lmgV4WyWKQ"
    )
    .then(function(response: any) {
      const result = response.data;
      let lat: number;
      if (result == null) return null;
      else lat = result.result.geometry.location.lat;
      return lat;
    })
    .catch(function(error: any) {
      console.log(error);
    });
}

export async function Fetch_Lng(/* placeID: string*/) {
  return await axios
    .get(
      "https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJCewJkL2LGGAR3Qmk0vCTGkg&fields=geometry%2Cformatted_address%2Cname%2Crating%2Cformatted_phone_number%2Cbusiness_status&key=AIzaSyD5hEtmrnaidWTm_VEVo0Qq6lmgV4WyWKQ"
    )
    .then(function(response: any) {
      const result = response.data;
      let lng: number;
      if (result == null) return null;
      else lng = result.result.geometry.location.lng;
      return lng;
    })
    .catch(function(error: any) {
      console.log(error);
    });
}

export async function Get_buisiness_stats(placeID: string) {
  return await axios
    .get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&fields=name%2Crating%2Cformatted_phone_number%2Cbusiness_status&key=AIzaSyD5hEtmrnaidWTm_VEVo0Qq6lmgV4WyWKQ`
    )
    .then(function(response: any) {
      const result = response.data;
      if (result == null) return null;
      else business_status = result.result.business_status;
      return business_status;
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch(function(error: any) {
      console.log(error);
    });
}

function num1() {
  return 35.6585805;
}

function num2() {
  return 139.7454329;
}

// ****************************************
// ***** 開発中 ***************************
// 地図上にマーカーをつけて表示するためのもの

export function ClosedInfo() {
  const [selected, setSelected] = useState(null);

  const x = Fetch_Lat();
  const y = Fetch_Lng();

  const b = { lat: 35.6585805, lng: 139.7454329 };

  return (

    <Marker position={b} />

  );
}
