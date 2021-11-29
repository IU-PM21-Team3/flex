import React, { Component } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  ImageList,
  ImageListItem,
} from "@material-ui/core";
import PlaceImage from "./PlaceImage";

// interface GMapWindow extends Window {
//   google: any;
// }
// declare const window: GMapWindow;
// interface GMapWindow extends Window {
//   google: any;
// }
// declare const google: GMapWindow;

type Pos = {
  lat: number;
  lng: number;
};

interface LocateState {
  locationName: string;
  center: google.maps.LatLngLiteral;
  // center: Pos;
  isShowMarker: boolean;
  searchType: string;
  results: any;
  positions: Pos[] | undefined;
  placeIDs: any;
  isShowMarkers: boolean;
  isShowImage: boolean;
}

export async function nearbysearch(center: any, type: string) {
  return await axios
    .get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${center.lat}%2C${center.lng}&radius=1500&type=${type}&key=AIzaSyD5hEtmrnaidWTm_VEVo0Qq6lmgV4WyWKQ`
    )
    .then(function (response: any) {
      const result = response.data;
      // console.log(result);
      if (result == null) return null;
      else return result;
    })
    .catch(function (error: any) {
      console.log(error);
    });
}

class PlaceMap extends Component<{}, LocateState> {
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
      searchType: "restaurant",
      results: {},
      positions: Array<Pos>(),
      isShowMarkers: false,
      placeIDs: Array(),
      isShowImage: false,
    };
  }

  changeLocationName(e: any) {
    console.log("this called");
    if (e.key === "Enter") {
      this.geocode();
      this.setState({
        // positions: Array<Pos>(),
        // placeIDs: Array(),
        isShowMarkers: true,
        isShowImage: true,
      });
      nearbysearch(this.state.center, this.state.searchType).then((res) => {
        // this.setState({
        //   positions: res.results.geometry.location,
        //   placeIDs: res.results.place_id,
        // });
        let positions: any = [];
        let placeIDs: any = [];
        for (const element of res.results) {
          // this.state.positions.push(element.geometry.location);
          // this.state.placeIDs.push(element.place_id);
          positions.push(element.geometry.location);
          placeIDs.push(element.place_id);
        }
        this.setState({
          positions: positions,
          placeIDs: placeIDs,
        });
      });
      // return;
    }
    this.setState({
      locationName: e.target.value,
    });
  }

  changeSearchType(e: any) {
    this.setState({
      // positions: Array<Pos>(),
      // placeIDs: Array(),
      isShowMarkers: true,
      isShowImage: true,
    });
    nearbysearch(this.state.center, this.state.searchType).then((res) => {
      // this.setState({
      //   positions: res.results.geometry.location,
      //   placeIDs: res.results.place_id,
      // });
      let positions: any = [];
      let placeIDs: any = [];
      for (const element of res.results) {
        // this.state.positions.push(element.geometry.location);
        // this.state.placeIDs.push(element.place_id);
        positions.push(element.geometry.location);
        placeIDs.push(element.place_id);
      }
      this.setState({
        positions: positions,
        placeIDs: placeIDs,
      });
    });

    this.setState({
      isShowMarkers: true,
    });
  }

  geocode() {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { address: this.state.locationName },
      (results: any, status: any) => {
        if (status === "OK") {
          let cent = Object.assign({}, this.state.center);
          cent = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          this.setState({
            center: cent,
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
      height: "93vh",
    };
    const box = {
      width: "280px",
      height: "420px",
      border: "1px solid #000",
      overflowY: "scroll",
    };

    // console.log(nearbysearch(this.state.center, "restaurant"));

    return (
      <div>
        <Grid container>
          <Grid item xs={4}>
            <Grid container direction="row">
              <Grid item xs={12}>
                <label style={labelStyle}>
                  <input
                    type="text"
                    value={this.state.locationName}
                    onChange={(e) => this.changeLocationName(e)}
                    placeholder={"検索する"}
                    onKeyPress={(e) => this.changeLocationName(e)}
                  />
                </label>
              </Grid>
              <Grid item xs={11}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label"></InputLabel>
                  <Select
                    labelId="select-searchtype-label"
                    id="select-searchtype"
                    value={this.state.searchType}
                    label="SearchType"
                    onChange={(e) => this.changeSearchType(e)}
                  >
                    <MenuItem value={"restaurant"}>レストラン</MenuItem>
                    <MenuItem value={"amusement_park"}>遊園地</MenuItem>
                    <MenuItem value={"cafe"}>カフェ</MenuItem>
                    <MenuItem value={"bar"}>バー</MenuItem>
                    <MenuItem value={"aquarium"}>水族館</MenuItem>
                    <MenuItem value={"art_gallery"}>美術館</MenuItem>
                    <MenuItem value={"museum"}>博物館</MenuItem>
                    <MenuItem value={"shopping_mall"}>
                      ショッピングモール
                    </MenuItem>
                    <MenuItem value={"zoo"}>動物園</MenuItem>
                    <MenuItem value={"tourist_attraction"}>観光名所</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* {this.state.isShowImage &&
              this.state.placeIDs.map((ID: any, i: any) => (
                <A placeID={ ID }/>
              ))} */}
              {/* <GridList cellHeight={200} cors={2}>
              {this.state.isShowImage &&
                this.state.placeIDs.map((ID: any, i: any) => (
                  <GridListTile key={i} cors="1">
                    <A placeID={ ID }/>
                  </GridListTile>
                ))}
            </GridList> */}
              <Grid item>
                <Box sx={box}>
                  <ImageList cols={2} rowHeight={170} spacing={1}>
                    {this.state.isShowImage &&
                      this.state.placeIDs.map((ID: any, i: any) => (
                        <ImageListItem>
                          <PlaceImage placeID={ID} />
                        </ImageListItem>
                      ))}
                  </ImageList>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <LoadScript googleMapsApiKey="AIzaSyD5hEtmrnaidWTm_VEVo0Qq6lmgV4WyWKQ">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={this.state.center}
                zoom={12}
              >
                {this.state.isShowMarker && (
                  <Marker key={"center"} position={this.state.center} />
                )}
                {this.state.isShowMarkers &&
                  this.state.positions &&
                  this.state.positions.map((pos: Pos, i: any) => (
                    <Marker key={i} position={pos} />
                  ))}
              </GoogleMap>
            </LoadScript>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default PlaceMap;
