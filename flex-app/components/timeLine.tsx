import styles from '../styles/timeline.module.css';
import { formatDate } from '../utils/utils'
import React, { useState } from 'react';
import PLACE from './Place';

const TimeLine = (props: { beginDate: Date, endDate: Date }) => {

  const time: Array<string> = new Array(21)
  for (var i = 0; i < 21; i++) {
    time[i] = String('00' + (i + 4)).slice(-2) + ':00';
  }

  //beginDateとendDateの差分を求める
  var date1: Date = props.beginDate;
  var date2: Date = props.endDate;
  var getDiff: number = date2.getTime() - date1.getTime();
  var termDay: number = getDiff / (1000 * 60 * 60 * 24);

  const planDate: Date[] = [props.beginDate]

  for (let d: Date = props.beginDate, i: number = 0; i < termDay; i++) {
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    planDate.push(d);
  }

  const [index, setIndex] = useState(0);

  //ボタン「>」をクリックしたら日付進める
  const nextclick = () => {
    if (index < planDate.length - 1) {
      setIndex(index + 1);
    }
  }

  //ボタン「＜」クリックしたら日付戻す
  const prevclick = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  }

  // const interact = useInteractJS()
  return (
    <body>

      {/* <button onClick={places}>スケジュール</button>  */}
      <div className={styles.daytable}>
        <div className={styles.button}>
          <button id={styles.previous} onClick={prevclick}>＜</button>
          <button id={styles.next} onClick={nextclick}>＞</button>
        </div>
        <div id={styles.day}>
          <h1>{formatDate(planDate[index], "yyyy-MM-dd")}</h1>
        </div>
        <big>Day{index + 1}</big>
      </div>
      <div className={styles.timetable}>
        <div id={styles.time}>
          <ul>
            {time.map((time, i) => <li key={i}>{time}</li>)}
          </ul>
        </div>
        <PLACE index={index} />
      </div>

    </body>
  )
}

export default TimeLine;
