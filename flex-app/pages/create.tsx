import React, { useState } from "react";
import { NextPage } from "next";
import PrivatePage from "../components/PrivatePage";
import { formatDate, fetchTodayDate, fetchNextDate } from "../utils/utils";
import styles from "../styles/CreatePage.module.css";
import G_Map from "../components/Google_Map";
type travelPlanSummary = {
  planName: string;
  description: string;
  beginDate: Date;
  endDate: Date;
  initialPlace: {
    lat: string;
    lng: string;
  };
};


const formatDateStr = "yyyy-MM-dd";

const CreatePlanPage: NextPage = () => {
  const [planName, setPlanName] = useState("");
  const [desc, setDesc] = useState("");
  const [beginDate, setBeginDate] = useState(formatDate(fetchTodayDate(), formatDateStr));
  const [endDate, setEndDate] = useState(formatDate(fetchNextDate(fetchTodayDate()), formatDateStr));
  const [lat, setLat] = useState(0.0);
  const [lng, setLng] = useState(0.0);

  // データを一つにまとめる
  const createTravelPlanSummayData = () => {
    console.log("create!!");
    return;
  };

  const submit = (e: any) => {
    e.preventDefault();
    createTravelPlanSummayData();
    // reset
    setPlanName("");
    setDesc("");
    setBeginDate(formatDate(fetchTodayDate(), formatDateStr));
    setEndDate(formatDate(fetchNextDate(fetchTodayDate()), formatDateStr));
  };

  return (
    <PrivatePage>
      <div className={styles.c_wrap}>
        <h1>旅程プランの作成</h1>
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
            placeholder="時間ギリギリを攻める"
            rows={5}
            cols={45}
          />

          <label className="required" htmlFor="beginDate">開始日時</label>
          <input
            value={beginDate}
            onChange={(e) => setBeginDate(e.target.value)}
            type="date"
            name="beginDate"
            required
            aria-required="true"
          />

          <label className="required" htmlFor="endDate">終了日時</label>
          <input
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            type="date"
            name="endDate"
            required
            aria-required="true"
          />

          <label>目的地周辺を指定してください</label>
          <G_Map />
          <button className={styles.c_btn}>旅程プランを作成する</button>
        </form>
      </div>
    </PrivatePage>
  );
};

export default CreatePlanPage;
