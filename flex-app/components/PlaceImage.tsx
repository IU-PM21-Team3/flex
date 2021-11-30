import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  CardMedia,
  Card,
  CardContent,
  Typography,
  Popover,
} from "@material-ui/core";
import { fetch_all_place_data } from "./Closed_Info";

function PlaceImage({ placeID }: { placeID: string }) {
  const CheckOpen = (open: boolean) => {
    if (open) return "営業中";
    else return "営業時間外";
  };

  const [result, setResult] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const divRef = useRef(null);
  const GMAP_API_KEY = "AIzaSyD5hEtmrnaidWTm_VEVo0Qq6lmgV4WyWKQ";

  useEffect(() => {
    const result: any = fetch_all_place_data(placeID).then((res: any) => {
      setResult(res.result);
      console.log(res);
      if (Array.isArray(res.result?.photos) && res.result.photos.length > 0) {
        setImgUrl(
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${res.result?.photos[0]?.photo_reference}&key=${GMAP_API_KEY}`
        );
      }
    });
  }, []);

  return (
    <div>
      <Box>
        <img
          src={imgUrl}
          ref={divRef}
          onClick={() => setOpen(!open)}
          style={{
            borderRadius: 20,
            width: 130,
            height: 165,
          }}
        />
      </Box>
      <Popover
        open={open}
        anchorEl={divRef.current}
        onClose={() => setOpen(!open)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Card>
          <CardMedia
            component="img"
            src={imgUrl}
            style={{ height: 150, paddingTop: "0" }}
          />
          <CardContent>
            <Typography component="p" variant="h4">
              {result?.name}
            </Typography>
            <Typography component="p" variant="h6">
              {CheckOpen(result?.opening_hours?.open_now)}
            </Typography>
            <Typography component="p" variant="h6">
              {"住所："}
              {result?.formatted_address}
            </Typography>
            <Typography component="p" variant="h6">
              {"電話番号："}
              {result?.formatted_phone_number}
            </Typography>
            <Typography component="p" variant="h6">
              {"営業時間："}
              {String(
                result?.opening_hours?.periods[0]?.open?.time ?? 0
              ).substr(0, 2)}
              {":"}
              {String(
                result?.opening_hours?.periods[0]?.open?.time ?? 0
              ).substr(2)}
              {"~"}
              {String(
                result?.opening_hours?.periods[0]?.close?.time ?? 0
              ).substr(0, 2)}
              {":"}
              {String(
                result?.opening_hours?.periods[0]?.close?.time ?? 0
              ).substr(2)}
            </Typography>
            <Typography component="p" variant="h6">
              {"営業日"}
            </Typography>
            {result?.opening_hours?.weekday_text?.map((v: any) => {
              return (
                <Typography key={v} component="p" variant="h6">
                  {v}
                </Typography>
              );
            })}
          </CardContent>
        </Card>
      </Popover>
    </div>
  );
}
export default PlaceImage;
