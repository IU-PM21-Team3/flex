import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import PrivatePage from "../components/PrivatePage";
import styles from "../styles/CreatePage.module.css";
import GMap from "../components/Google_Map";
import { Grid } from "@material-ui/core";


type Pos = {
  lat: number;
  lng: number;
};
type TravelPlanSummary = {
  planName: string;
  description: string;
  beginDate: Date;
  endDate: Date;
  initialPlace: Pos;
  origin: Pos;
  destination: Pos;
};


const formatDateStr = "yyyy-MM-dd";

const CreatePlanPage: NextPage = () => {
  const [planName, setPlanName] = useState("");
  const [desc, setDesc] = useState("");
  const [beginDate, setBeginDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [center, setCenter] = useState<Pos>();
  const [origin, setOrigin] = useState<Pos>();

  useEffect(() => {
    if (origin) {
      setCenter(origin);
    }
  }, [origin]);

  // データを一つにまとめる
  const createTravelPlanSummayData = () => {
    return;
  };

  // 作成ボタンを押した時の処理
  const submit = (e: any) => {
    e.preventDefault();
    createTravelPlanSummayData();
    // reset
    setPlanName("");
    setDesc("");
    setBeginDate("");
    setEndDate("");
  };

  return (
    <PrivatePage>
      <h1 className="pageHeadText">旅程プランの作成</h1>
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

            <button className={styles.c_btn}>旅程プランを作成する</button>
          </form>
        </Grid>

        <Grid item xs={8}>
          <GMap
            isMarkerShown
            containerSize={{ width: "100%", height: "70vh" }}
            center={center}
            setLatLng={setOrigin}
          />
        </Grid>
      </Grid>
    </PrivatePage>
  );
};

export default CreatePlanPage;
