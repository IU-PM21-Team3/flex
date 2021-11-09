import styles from "../styles/timeline.module.css";
import { formatDate } from "../utils/utils";
import React, { useState } from "react";
import PLACE from "./Place";

//スケジュールの初期値
const Places = [
  {
    id: 0,//Dateのindexと同義
    starttime: "8:30",
    endtime: "12:00",
    name: "大内宿"
  },
  {
    id: 0,
    starttime: "13:00",
    endtime: "17:00",
    name: "会津若松"
  },
  {
    id: 0,
    starttime: "20:00",
    endtime: "24:00",
    name: "旅館"
  },
  {
    id: 1,
    starttime: "12:00",
    endtime: "15:00",
    name: "あぶくま洞"
  },
  {
    id: 2,
    starttime: "11:00",
    endtime: "14:00",
    name: "アクアマリンふくしま"
  },
  {
    id: 2,
    starttime: "15:00",
    endtime: "19:00",
    name: "小名浜イオン"
  },
];

const TimeLine = ( props: { beginDate: Date, endDate: Date; } ) => {
  const time: Array<string> = new Array( 21 );
  for ( let i = 0; i < 21; i++ ) {
    time[ i ] = String( "00" + ( i + 4 ) ).slice( -2 ) + ":00";
  }

  // beginDateとendDateの差分を求める
  const date1: Date = props.beginDate;
  const date2: Date = props.endDate;
  const getDiff: number = date2.getTime() - date1.getTime();
  const termDay: number = getDiff / ( 1000 * 60 * 60 * 24 );

  const planDate: Date[] = [ props.beginDate ];

  for ( let d: Date = props.beginDate, i = 0; i < termDay; i++ ) {
    d = new Date( d.getFullYear(), d.getMonth(), d.getDate() + 1 );
    planDate.push( d );
  }

  const [ index, setIndex ] = useState( 0 );

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
    <body>
      <div className={styles.daytable}>
        <div className={styles.button}>
          <button id={styles.previous} onClick={prevclick}>＜</button>
          <button id={styles.next} onClick={nextclick}>＞</button>
        </div>
        <div id={styles.day}>
          <h1>{formatDate( planDate[ index ], "yyyy-MM-dd" )}</h1>
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
            {Places.map( ( Places, i ) => {
              if ( Places.id === index ) {
                return (
                  <div style={{ visibility: "visible" }}>
                    <PLACE id={Places.id} index={index} name={Places.name} starttime={Places.starttime} endtime={Places.endtime} />
                  </div>
                );
              } else {
                return (
                  <div style={{ visibility: "hidden" }}>
                    <PLACE id={Places.id} index={index} name={Places.name} starttime={Places.starttime} endtime={Places.endtime} />
                  </div>
                );
              }
            } )}
          </div>
        </div>
      </div>
    </body>
  );
};
export default TimeLine;
