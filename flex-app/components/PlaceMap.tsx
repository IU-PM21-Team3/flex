import React, { Component } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
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
import { cloneDeep } from "lodash";
const API_KEY = "AIzaSyD5hEtmrnaidWTm_VEVo0Qq6lmgV4WyWKQ";

interface LocateState {
  locationName: string;
  center: google.maps.LatLngLiteral;
  isShowMarker: boolean;
  searchType: string;
  results: google.maps.places.PlaceResult[];
  isShowMarkers: boolean;
  isShowImage: boolean;

  placesService?: google.maps.places.PlacesService;
}
type NearbySearchResponseTuple = [google.maps.places.PlaceResult[] | null, google.maps.places.PlacesServiceStatus, google.maps.places.PlaceSearchPagination | null];

class PlaceMap extends Component<any, LocateState> {
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
      results: [],
      isShowMarkers: false,
      isShowImage: false,
      placesService: undefined,
    };

    // this.setState is not a functionと怒られるのを防ぐため
    // ref : https://shikiyura.com/2018/06/js-react_setstate-undefined-issue/
    this.onMapLoad = this.onMapLoad.bind(this);
  }

  onKeyPressedToSearchPlaces(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      this.geocode();

      this.setState({
        isShowMarkers: true,
        isShowImage: true,
      });

      this.nearbySearchAndUpdatePositionsAndPlaceIDs({
        location: this.state.center,
        type: this.state.searchType,
      });
    }
  }

  onLocationNameChanged(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      locationName: e.target.value,
    });
  }

  changeSearchType(e: React.ChangeEvent<{ name?: string, value: unknown; }>) {
    this.setState({
      searchType: e.target.value as string,
      isShowMarkers: true,
      isShowImage: true,
    });

    this.nearbySearchAndUpdatePositionsAndPlaceIDs({
      location: this.state.center,
      type: this.state.searchType,
    });

    this.setState({
      isShowMarkers: true,
    });
  }

  nearbysearch(_request: Readonly<google.maps.places.PlaceSearchRequest>): Promise<NearbySearchResponseTuple> {
    return new Promise((resolve, reject) => {
      // 使用するサービスが初期化されていないのであれば, この関数の機能も提供できないため, rejectする
      if (this.state.placesService == undefined) {
        reject(new Error("GoogleMap Places Service is not initialized"));
        return;
      }

      // 呼び出し元のデータを編集してしまわないように, ここで複製体を生成しておく
      const request: google.maps.places.PlaceSearchRequest = cloneDeep(_request);

      // Radiusは必須プロパティのため, 引数で設定されていなかったのであればここで指定しておく
      request.radius ??= 1500;

      this.state.placesService.nearbySearch(request, (resultArr: google.maps.places.PlaceResult[] | null, statusResponse: google.maps.places.PlacesServiceStatus, searchPagination: google.maps.places.PlaceSearchPagination | null) => {
        resolve([resultArr, statusResponse, searchPagination]);
      });
    });
  }

  nearbySearchAndUpdatePositionsAndPlaceIDs(_request: Readonly<google.maps.places.PlaceSearchRequest>) {
    return new Promise<NearbySearchResponseTuple>((resolve, reject) => {
      this.nearbysearch(_request)
        .then((nearbySearchResult) => {
          const [resultArr, statusResponse, searchPagination] = nearbySearchResult;

          // resultArrがnullであれば検索に失敗しているため, rejectする
          if (resultArr == null) {
            reject(new Error(`nearbySearch function: resultArr is NULL!  statusResponse: ${statusResponse}, searchPagination: ${searchPagination}`));
            return;
          }

          // コンポーネント内で使用できるように, stateに記録する
          // 参照のコピーであるため, (ないとは思うけど)この先での変更には要注意
          this.setState({ results: resultArr });

          resolve(nearbySearchResult);
        });
    });
  }


  geocode() {
    const geocoder = new window.google.maps.Geocoder();

    const request: google.maps.GeocoderRequest = {
      address: this.state.locationName,
    };

    geocoder.geocode(
      request,
      (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        if (status === "OK" && results != null) {
          this.setState({
            center: results[0].geometry.location.toJSON(),
            isShowMarker: true,
          });
        }
      }
    );
  }

  onMapLoad(map: google.maps.Map) {
    this.setState({ placesService: new window.google.maps.places.PlacesService(map) });
  }

  render() {
    const labelStyle = {
      margin: "20px",
      display: "block",
    };
    const containerStyle = {
      width: "100%",
      height: "100%",
    };
    const box = {
      width: "280px",
      height: "420px",
      border: "1px solid #000",
      overflowY: "scroll",
    };
    const H100Percent = {
      height: "100%"
    };

    return (
      <div style={H100Percent}>
        <Grid container style={H100Percent}>
          <Grid item xs={4} style={H100Percent}>
            <Grid container direction="row">
              <Grid item xs={12}>
                <label style={labelStyle}>
                  <input
                    type="text"
                    value={this.state.locationName}
                    onChange={(e) => this.onLocationNameChanged(e)}
                    placeholder={"検索する"}
                    onKeyPress={(e) => this.onKeyPressedToSearchPlaces(e)}
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
              <Grid item>
                <Box sx={box}>
                  <ImageList cols={2} rowHeight={170} gap={1}>
                    {this.state.isShowImage &&
                      this.state.results.map((placeResult: google.maps.places.PlaceResult) => (
                        <ImageListItem key={placeResult.place_id}>
                          <PlaceImage placesService={this.state.placesService} _placeInfo={placeResult} />
                        </ImageListItem>
                      ))}
                  </ImageList>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8} style={H100Percent}>
            <LoadScript
              googleMapsApiKey={API_KEY}
              libraries={["places"]}
            >
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={this.state.center}
                zoom={12}
                onLoad={this.onMapLoad}
              >
                {this.state.isShowMarker && (
                  <Marker key={"center"} position={this.state.center} />
                )}

                {this.state.isShowMarkers &&
                  this.state.results?.map((placeResult: google.maps.places.PlaceResult) => {
                    if (placeResult.geometry?.location == undefined) {
                      return <></>;
                    }
                    return (
                      <Marker key={placeResult.geometry?.location?.toString()} position={placeResult.geometry?.location} />
                    );
                  }
                  )
                }
              </GoogleMap>
            </LoadScript>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default PlaceMap;
