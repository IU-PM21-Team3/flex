import styles from "../styles/timeline.module.css";
import { formatDate } from "../utils/utils";
import React, { useState } from "react";
import PLACE from "./Place";
import { DBTravelPlanSummary, DBActionData } from "../firebase/DBTypes";

// スケジュールの初期値
const Places: { [date: string]: DBActionData[]; } = {};
Places[new Date(2021, 11, 30).toDateString()] = [
  {
    actionType: "visit",
    arriveDate: new Date(2021, 11, 30, 8, 30),
    leaveDate: new Date(2021, 11, 30, 12, 0),
    placeName: "大内宿",
    buzinessState: "normal",
    memo: "",
  },
  {
    actionType: "visit",
    arriveDate: new Date(2021, 11, 30, 13, 0),
    leaveDate: new Date(2021, 11, 30, 17, 0),
    placeName: "会津若松",
    buzinessState: "normal",
    memo: "",
  },
  {
    actionType: "visit",
    arriveDate: new Date(2021, 11, 30, 20, 0),
    leaveDate: new Date(2021, 11, 30, 24, 0),
    placeName: "旅館",
    buzinessState: "normal",
    memo: "",
  },
];
Places[new Date(2021, 11, 31).toDateString()] = [
  {
    actionType: "visit",
    arriveDate: new Date(2021, 11, 31, 12, 0),
    leaveDate: new Date(2021, 11, 31, 15, 0),
    placeName: "あぶくま洞",
    buzinessState: "normal",
    memo: "",
  },
];
Places[new Date(2022, 0, 1).toDateString()] = [
  {
    actionType: "visit",
    arriveDate: new Date(2022, 0, 1, 11, 0),
    leaveDate: new Date(2022, 0, 1, 14, 0),
    placeName: "アクアマリンふくしま",
    buzinessState: "normal",
    memo: "",
  },
  {
    actionType: "visit",
    arriveDate: new Date(2022, 0, 1, 15, 0),
    leaveDate: new Date(2022, 0, 1, 19, 0),
    placeName: "小名浜イオン",
    buzinessState: "normal",
    memo: "",
  },
];

const TimeLine = (props: { summary: DBTravelPlanSummary; }) => {
  const time: Array<string> = new Array( 21 );
  for ( let i = 0; i < 21; i++ ) {
    time[i] = String( "00" + ( i + 4 ) ).slice( -2 ) + ":00";
  }

  // beginDateとendDateの差分を求める
  const date1: Date = props.summary.beginDate;
  const date2: Date = props.summary.endDate;
  const getDiff: number = date2.getTime() - date1.getTime();
  // 最大31日までの対応とする
  const termDay: number = new Date(getDiff).getDate();
  console.log("termDay:", termDay);

  const planDate: Date[] = [];

  for (let i = 0; i < termDay; i++) {
    const d: Date = new Date(props.summary.beginDate);
    planDate.push(new Date(d.setDate(d.getDate() + i)));
  }

  const [index, setIndex] = useState( 0 );

  // ボタン「>」をクリックしたら日付進める
  const nextclick = () => {
    if ( index < planDate.length - 1 ) {
      setIndex( index + 1 );
    }
  };

  // ボタン「＜」クリックしたら日付戻す
  const prevclick = () => {
    if ( index > 0 ) {
      setIndex( index - 1 );
    }
  };

  return (
    <div>
      <div className={styles.daytable}>
        <div className={styles.button}>
          <button id={styles.previous} onClick={prevclick}>＜</button>
          <button id={styles.next} onClick={nextclick}>＞</button>
        </div>
        <div id={styles.day}>
          <h1>{formatDate( planDate[index], "yyyy-MM-dd" )}</h1>
        </div>
        <big>Day{index + 1}</big>
      </div>
      <div className={styles.timetable}>
        <div id={styles.time}>
          <ul>
            {time.map( ( time, i ) => <li key={i}>{time}</li> )}
          </ul>
        </div>
        <div className={styles.area}>
          <div style={{ visibility: "visible" }}>
            {Places[planDate[index].toDateString()]?.map( ( place ) => {
              return (
                <PLACE key={place.placeName} actionData={place} />
              );
            } )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TimeLine;
