import React, { useState, useEffect, useMemo } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { DBTravelPlanSummary } from "../firebase/DBTypes";
import PrivatePage from "../components/PrivatePage";
import styles from "../styles/CreatePage.module.css";
import GMap from "../components/Google_Map";
import { Grid } from "@material-ui/core";

// [TODO]
// ここのPosの型を<google.maps.LatLngLiteral>に変えた方がいいかも
// そっちのほうが座標を共通でいろいろ扱える。
// 優先度低いので後回し sedコマンドか何かでやる
type Pos = {
  lat: number;
  lng: number;
};
type TravelPlanSummaryDisplay = {
  planName: string;
  description: string;
  beginDate: Date;
  endDate: Date;

  // 以下は表示の都合
  // 現在地
  initialPlace: Pos;
  // 出発地点
  origin: string;
  // 最終地点
  destination: string;
};


// デフォルトのポジション: 東京駅
const defaultPos: Pos = {
  lat: 35.6812362,
  lng: 139.7649361,
};

const initPos: Pos = {
  lat: 0,
  lng: 0
};

const CreatePlanPage: NextPage = () => {
  const router = useRouter();
  // formの値
  const [planName, setPlanName] = useState("");
  const [desc, setDesc] = useState("");
  const [beginDate, setBeginDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");

  // 初期位置に関する値
  const [initialPlace, setInitialPlace] = useState<Pos>();
  // 以下はGoogleMap上で出発地と目的地のマーカーを立てるためのもの
  const [originPos, setOriginPos] = useState<Pos>();
  const [destinationPos, setDestinationPos] = useState<Pos>();
  const [positions, setPositions] = useState<Pos[]>([]);
  // 地図更新フラグ
  const [isFetchedCurrentPos, setIsFetchedCurrentPos] = useState<boolean>(false);

  // 現在位置の取得
  useEffect(() => {
    if (!isFetchedCurrentPos) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          // 現在地取得成功時
          (position: GeolocationPosition) => {
            const pos: Pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            console.log("fetch now position", pos);
            // 現在地をマップの中心にする
            setInitialPlace(pos);
            // setCenter(pos);
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
            setInitialPlace(defaultPos);
            alert(errorMsg[error.code]);
            // エラーが起きたらリロードする
            // location.reload();
          },
          // オプション
          {
            "enableHighAccuracy": false,
            "timeout": 5000,
            "maximumAge": 100,
          }
        );
      } else {
        // 位置情報の取得ができない場合
        // [memo] ここのelse文の中はいらないような気もしてます

        console.log("NOT fetch now position");
        alert("お使いの端末で位置情報が取得できませんでした");
        setInitialPlace(defaultPos);
        location.reload();
      }
      setIsFetchedCurrentPos(true);
    }
  }, []);

  // 住所を指定して座標を取得
  const getLatLng = (address: string) => {
    const geocoder = new google.maps.Geocoder();
    const data = geocoder.geocode({ address: address, region: "jp" })
      .then((res) => {
        const geo = res.results[0].geometry.location;
        return { lat: geo.lat(), lng: geo.lng() };
      });
    return data;
  };

  // 出発地と目的地の変更
  // [--] おそらくこの方式だと上のgetLatLngを使ったときに
  //     API呼び出しが死ぬほど走ると思うのでちょっと緊張です
  // [x] setTimeoutで対策した
  useEffect(() => {
    const timer = setTimeout(() => {
      if (origin) {
        getLatLng(origin)
          .then((pos) => {
            setOriginPos(pos);
            setPositions([pos, positions[1]]);
            console.log("get origin", origin, pos);
          });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [origin]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (destination) {
        getLatLng(destination)
          .then((pos) => {
            setDestinationPos(pos);
            setPositions([positions[0], pos]);
            console.log("get destination", destination, pos);
          });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [destination]);

  useEffect(() => {
    console.log("positions", positions);
  }, [positions]);

  // データを一つにまとめる
  const createTravelPlanSummayData = () => {
    if (origin && destination && initialPlace) {
      const travelPlanSummayData: TravelPlanSummaryDisplay = {
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

  const extractDBTravelPlanSummayData = (obj: any) => {
    const { initialPlace, origin, destination, ...res } = obj;
    return res;
  };

  // 作成ボタンを押した時の処理
  const submit = (e: any) => {
    e.preventDefault();
    const summayPlan = createTravelPlanSummayData();
    const dbSummayPlan = extractDBTravelPlanSummayData(summayPlan);

    // [x] DBに作成したSummaryPlanを保存するならここで行う
    // [x] DBに作成したSummaryPlanを保存するならここで行う
    // [x] DBに作成したSummaryPlanを保存するならここで行う
    // [x] DBに作成したSummaryPlanを保存するならここで行う
    // [x] DBに作成したSummaryPlanを保存するならここで行う

    // [TODO] 作成ボタンを押した後に編集ページ(/config)に遷移する
    console.log(dbSummayPlan);
    if (dbSummayPlan) router.push("/config");
    // [TODO] フォーム送信後フォームの値を消す
  };

  return (
    <PrivatePage>
      <h1 className="pageHeadText">旅程プランの作成</h1>
      <Grid container text-alignitems="center" style={{ marginBottom: "5%" }}>
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
              placeholder="例）東京駅、茨城県日立市弁天町1-16 等"

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
              placeholder="例）横浜駅、東京タワー 等"

              style={{ marginBottom: "20px" }}
            />
            <button className={styles.c_btn}>旅程プランを作成する</button>
          </form>
        </Grid>

        <Grid item xs={8}>
          {
            initialPlace &&
            <GMap
              isMarkerShown={true}
              zoom={10}
              containerSize={{ width: "100%", height: "100%" }}
              center={initialPlace}
              // マーカーを表示する配列を渡す
              positions={positions}
              oridesMode={true}
              origin={origin}
              destination={destination}
            />
          }
        </Grid>
      </Grid>
    </PrivatePage>
  );
};

export default CreatePlanPage;
