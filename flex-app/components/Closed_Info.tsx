import React from "react";
import { Marker } from "@react-google-maps/api";
import axios from "axios";

// const example = "ChIJCewJkL2LGGAR3Qmk0vCTGkg";

export function fetch_all_place_data(placeID: string): any;

export async function fetch_all_place_data(placeID: string) {
  return await axios
    .get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&fields=geometry%2Cformatted_address%2Cname%2Crating%2Cformatted_phone_number%2Cbusiness_status&key=AIzaSyD5hEtmrnaidWTm_VEVo0Qq6lmgV4WyWKQ`
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

export function fetch_position(placeID: string): any;

export async function fetch_position(placeID: string) {
  return await axios
    .get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&fields=geometry%2Cformatted_address%2Cname%2Crating%2Cformatted_phone_number%2Cbusiness_status&key=AIzaSyD5hEtmrnaidWTm_VEVo0Qq6lmgV4WyWKQ`
    )
    .then(function(response: any) {
      const result = response.data;
      if (result == null) return null;
      else return result.result.geometry.location;
    })
    .catch(function(error: any) {
      console.log(error);
    });
}

export function fetch_buisiness_stats(placeID: string): any;

export async function fetch_buisiness_stats(placeID: string) {
  return await axios
    .get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&fields=name%2Crating%2Cformatted_phone_number%2Cbusiness_status&key=AIzaSyD5hEtmrnaidWTm_VEVo0Qq6lmgV4WyWKQ`
    )
    .then(function(response: any) {
      let business_status: any = "";
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

// ****************************************
// ***** 開発中 ***************************
// 地図上にマーカーをつけて表示するためのもの

export function ClosedInfo({ placeID }: { placeID: string }) {
  // const [selected, setSelected] = useState(null);

  return <Marker position={fetch_position(placeID)} />;
}
