import React, { Component } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";

// interface GMapWindow extends Window {
//   google: any;
// }
// declare const window: GMapWindow;
// interface GMapWindow extends Window {
//   google: any;
// }
// declare const google: GMapWindow;

interface LocateState {
  locationName: string;
  center: google.maps.LatLngLiteral;
  isShowMarker: boolean;
}

// let places: {};

export async function nearbysearch(center: any, type: string) {
  return await axios
    .get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${center.lat}%2C${center.lng}&radius=1500&type=${type}&key=AIzaSyD5hEtmrnaidWTm_VEVo0Qq6lmgV4WyWKQ`
    )
    .then(function(response: any) {
      const result = response.data;
      console.log(result);
      if (result == null) return null;
      else return result;
    })
    .catch(function(error: any) {
      console.log(error);
    });
}

class Sample extends Component<any, LocateState> {
  googleGeocoder: any = null;
  constructor(props: any) {
    super(props);
    this.state = {
      locationName: "",
      center: {
        lat: 35.69575,
        lng: 139.77521,
      },
      isShowMarker: false,
    };
  }
  changeLocationName(e: any) {
    if (e.key === "Enter") {
      this.geocode();
      return;
    }
    this.setState({
      locationName: e.target.value,
    });
  }
  geocode() {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { address: this.state.locationName },
      (results: any, status: any) => {
        if (status === "OK") {
          let center = Object.assign({}, this.state.center);
          center = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          this.setState({
            center,
            isShowMarker: true,
          });
        }
      }
    );
  }
  // nearbysearch() {
  //   let map
  //   const service = new window.google.maps.places.PlacesService(map);
  //   let request = {
  //     location: this.state.center,
  //     radius: '500',
  //     type: ['restaurant']
  //   };
  //   service.nearbySearch(request,
  //     (places: any, status: any) => {
  //       if (status === "OK") {
  //         for (var i = 0; i < places.length; i++) {
  //           console.log(places[i]);
  //         }
  //       }
  //     }
  //   );
  // }
  render() {
    const labelStyle = {
      margin: "20px",
      display: "block",
    };
    const containerStyle = {
      width: "100%",
      height: "60vh",
    };

    return (
      <div>
        <label style={labelStyle}>
          Input LocationName:
          <input
            type="text"
            onChange={(e) => this.changeLocationName(e)}
            value={this.state.locationName}
            onKeyPress={(e) => this.changeLocationName(e)}
          />
        </label>
        <LoadScript googleMapsApiKey="AIzaSyD5hEtmrnaidWTm_VEVo0Qq6lmgV4WyWKQ">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={this.state.center}
            zoom={18}
          >
            {this.state.isShowMarker && <Marker position={this.state.center} />}
          </GoogleMap>
        </LoadScript>
      </div>
    );
  }
}

export default Sample;
