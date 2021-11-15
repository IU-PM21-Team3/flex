import React, { useState, useEffect, useLayoutEffect } from "react";
import { NextPage } from "next";
import PrivatePage from "../components/PrivatePage";
import styles from "../styles/CreatePage.module.css";
import GMap from "../components/Google_Map";
import { Grid } from "@material-ui/core";
import { formatDate } from "../utils/utils";


// [TODO]
// ここのPosの型を<google.maps.LatLngLiteral>に変えた方がいいかも
// そっちのほうが座標を共通でいろいろ扱える。
// 優先度低いので後回し sedコマンドか何かでやる
type Pos = {
  lat: number;
  lng: number;
};

type TravelPlanSummary = {
  planName: string;
  description: string;
  beginDate: Date;
  endDate: Date;
  // 現在地
  initialPlace: Pos;
  // 出発地点
  origin: string;
  // 最終地点
  destination: string;
};

// デフォルトのポジション: 東京駅
const defaultPos = {
  lat: 35.6812362,
  lng: 139.7649361,
};


const CreatePlanPage: NextPage = () => {
  const [planName, setPlanName] = useState("");
  const [desc, setDesc] = useState("");
  const [beginDate, setBeginDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [initialPlace, setInitialPlace] = useState<Pos>();
  const [origin, setOrigin] = useState<string>();
  const [destination, setDestination] = useState<string>();
  const [center, setCenter] = useState<Pos>(defaultPos);
  // これはGoogleMap上でマーカーを立てたい時にposを追加する
  const [positions, setPositions] = useState<Pos[]>();

  // 現在位置の取得
  useLayoutEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // 現在地取得成功時
        (position: GeolocationPosition) => {
          const pos: Pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          // 現在地をマップの中心にする
          setInitialPlace(pos);
          setCenter(pos);
          setPositions([pos]);
        },
        // 取得の失敗
        // ex) ユーザーが位置情報を許可してくれないなど
        (error: GeolocationPositionError) => {
          // 位置情報の取得状況に合わせてテキストを変更したい場合ここ
          // 現時点では仮にalertで警告を出している（多分邪魔なので後で消す）
          const errorMsg: string[] = [
            "原因不明のエラーが発生しました",
            "位置情報が許可されませんでした",
            "位置情報が取得できませんでした",
            "要求がタイムアウトしました"
          ];
          alert(errorMsg[error.code]);
          setInitialPlace(defaultPos);
          setPositions([defaultPos]);
        },
        // オプション
        {
          "enableHighAccuracy": false,
          "timeout": 3000,
          "maximumAge": 100,
        }
      );
    } else {
      // 位置情報の取得ができない場合
      // [memo] ここのelse文の中はいらないような気もしてます
      alert("お使いの端末で位置情報が取得できませんでした");
      setInitialPlace(defaultPos);
    }
  }, []);

  // 住所を検索して座標を取得
  const getLatLng = (address: string) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        address: address,
        region: "jp"
      },
      (results, status) => {
        if (status === "OK") {
          if (results) {
            const geometryLoc = results[0].geometry.location;
            return { lat: geometryLoc.lat, lng: geometryLoc.lng };
          }
        }
      }
    );
  };

  // 出発地と目的地の変更
  // [INFO] おそらくこの方式だと上のgetLatLngを使ったときに
  // API呼び出しが死ぬほど走ると思うのでちょっと緊張です
  useEffect(() => {
    if (origin === "") {
      setOrigin(origin);
    }
    if (destination === "") {
      setDestination(destination);
    }

    // [TODO] 緯度経度に変換してpositionsに格納する（マーカー表示のため）
  }, [origin, destination]);

  // データを一つにまとめる
  const createTravelPlanSummayData = () => {
    if (origin && destination && initialPlace) {
      const travelPlanSummayData: TravelPlanSummary = {
        planName: planName,
        description: desc,
        beginDate: new Date(beginDate),
        endDate: new Date(endDate),
        initialPlace: initialPlace,
        origin: origin,
        destination: destination
      };
      return travelPlanSummayData;
    }
    return;
  };

  // 作成ボタンを押した時の処理
  const submit = (e: any) => {
    e.preventDefault();
    const summayPlan = createTravelPlanSummayData();
    // [x] DBに作成したSummaryPlanを保存するならここ
    console.log(summayPlan);
    // [TODO] 作成ボタンを押した後に編集ページにリダイレクトする
    // reset
    setPlanName("");
    setDesc("");
    setBeginDate("");
    setEndDate("");
  };

  return (
    <PrivatePage>
      <h1 className="pageHeadText">旅程プランの作成</h1>
      {
        positions &&
        positions.map((pos: Pos) => {
          <div>
            <p>pos {pos.lat}</p>
            <p>pos {pos.lng}</p>
          </div>;
        })
      }
      <Grid container text-alignItems="center">
        <Grid item xs={4}>
          <form onSubmit={submit}>
            <label className="required" htmlFor="planName">旅程のテーマ</label>
            <input
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              type="text"
              name="planName"
              placeholder="例）限界旅行"
              required
              aria-required="true"
            />

            <label htmlFor="description">概要</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              name="description"
              placeholder="例）時間ギリギリを攻める"
              rows={5}
              cols={45}
            />

            <label className="required" htmlFor="beginDate">開始日</label>
            <input
              value={beginDate}
              onChange={(e) => setBeginDate(e.target.value)}
              type="date"
              name="beginDate"
              required
              aria-required="true"
            />

            <label className="required" htmlFor="endDate">終了日</label>
            <input
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
              name="endDate"
              required
              aria-required="true"

              style={{ marginBottom: "20px" }}
            />

            <label className="required" htmlFor="origin">出発地</label>
            <input
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              type="text"
              name="origin"
              required
              aria-required="true"

              style={{ marginBottom: "20px" }}
            />

            <label className="required" htmlFor="destination">目的地</label>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              type="text"
              name="destination"
              required
              aria-required="true"

              style={{ marginBottom: "20px" }}
            />

            <button className={styles.c_btn}>旅程プランを作成する</button>
          </form>
        </Grid>

        <Grid item xs={8}>
          <GMap
            isMarkerShown={true}
            zoom={10}
            containerSize={{ width: "100%", height: "70vh" }}
            center={center}
            // マーカーを表示する配列を渡す
            positions={positions}
          />

        </Grid>
      </Grid>
    </PrivatePage>
  );
};

export default CreatePlanPage;
