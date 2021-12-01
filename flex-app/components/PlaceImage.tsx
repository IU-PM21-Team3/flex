import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Box,
  CardMedia,
  Card,
  CardContent,
  Typography,
  Popover,
} from "@material-ui/core";

function PlaceImage({ placesService, _placeInfo }: { placesService?: google.maps.places.PlacesService, _placeInfo: google.maps.places.PlaceResult; }) {
  const CheckOpen = (open?: boolean) => {
    return open == undefined ? "不明" :
      (open ? "営業中" : "営業時間外");
  };

  const MAX_HEIGHT = 130;
  const MAX_WIDTH = 165;
  const imageOpts: google.maps.places.PhotoOptions = {
    maxHeight: MAX_HEIGHT,
    maxWidth: MAX_WIDTH
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState(_placeInfo?.photos?.at(0)?.getUrl(imageOpts) ?? "");
  const [placeInfo, setPlaceInfo] = useState<google.maps.places.PlaceResult>();
  const imgRef = useRef(null);

  useEffect(() => {
    // その場所の詳細な情報は「getDetails」で取得しないといけないため
    // 必要なインスタンス等がそろっている場合のみ取得をする
    if (placesService != undefined && _placeInfo?.place_id != undefined) {
      placesService.getDetails({ placeId: _placeInfo?.place_id }, (placeResult: google.maps.places.PlaceResult | null) => {
        if (placeResult != null) {
          console.log("getDetails:", placeResult);
          setPlaceInfo(placeResult);

          const tmpImgUrl = placeResult.photos?.at(0)?.getUrl(imageOpts);
          if (tmpImgUrl != null && tmpImgUrl != "") {
            setImgUrl(tmpImgUrl);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placesService, _placeInfo]);

  return (
    <div>
      <Box>
        <div ref={imgRef}>
          <Image
            alt={placeInfo?.name ?? "Unknown Name Place Image"}
            src={imgUrl}
            onClick={() => setIsPopupOpen(true)}
            layout="fill"
          />
        </div>

      </Box>
      <Popover
        open={isPopupOpen}
        anchorEl={imgRef.current}
        onClose={() => setIsPopupOpen(false)}
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
              {placeInfo?.name}
            </Typography>
            <Typography component="p" variant="h6">
              {"営業状態："}
              {CheckOpen(placeInfo?.opening_hours?.isOpen(new Date()))}
            </Typography>
            <Typography component="p" variant="h6">
              {"住所："}
              {placeInfo?.formatted_address ?? placeInfo?.vicinity ?? "未登録"}
            </Typography>
            <Typography component="p" variant="h6">
              {"電話番号："}
              {placeInfo?.formatted_phone_number ?? "未登録"}
            </Typography>
            <Typography component="p" variant="h6">
              {"営業時間："}
              {String(
                placeInfo?.opening_hours?.periods?.at(0)?.open?.time ?? 0
              ).substr(0, 2)}
              {":"}
              {String(
                placeInfo?.opening_hours?.periods?.at(0)?.open?.time ?? 0
              ).substr(2)}
              {"~"}
              {String(
                placeInfo?.opening_hours?.periods?.at(0)?.close?.time ?? 0
              ).substr(0, 2)}
              {":"}
              {String(
                placeInfo?.opening_hours?.periods?.at(0)?.close?.time ?? 0
              ).substr(2)}
            </Typography>
            <Typography component="p" variant="h6">
              {"営業日"}
            </Typography>
            {placeInfo?.opening_hours?.weekday_text?.map((v: any) => {
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
