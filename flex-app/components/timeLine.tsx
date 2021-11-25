import styles from "../styles/timeline.module.css";
import React, { useEffect, useState } from "react";
import PLACE from "./Place";
import { DBTravelPlanSummary, DBActionData } from "../firebase/DBTypes";
import { travelPlanSampleID } from "../pages/timeLine";
import { useRouter, NextRouter } from "next/router";
import moment from "moment";
import { TravelPlanController } from "../firebase/TravelPlanController";
import { Button } from "@material-ui/core";

// #region Prepare
const time: Array<string> = [];
for (let i = 0; i <= 24; i++) {
  time.push(`${i}:00`.padStart(5, "0"));
}
// #endregion

// #region Functions
/**
 * 日付文字列から表示日設定値を取得する
 * @param summary 旅程の概要データ (開始日と終了日データを使用する)
 * @param dateStr 入力日付文字列
 * @returns 使用する日付文字列
 */
function getShowingDate(summary: DBTravelPlanSummary, dateStr?: string | string[]): Date {
  const beginDate = getYYYYMMDD(summary.beginDate);
  const endDate = getYYYYMMDD(summary.endDate);

  if (dateStr == null) {
    return beginDate;
  } else if (Array.isArray(dateStr)) {
    dateStr = dateStr[0];
  }

  const date = getYYYYMMDD(new Date(dateStr));
  const endDateP1 = addDate(endDate, 1);
  if (beginDate <= date && date < endDateP1) {
    return date;
  } else if (beginDate > date) {
    return beginDate;
  } else {
    return endDate;
  }
}

function addDate(src: Date, daysToAdd: number): Date {
  return new Date(new Date(src).setDate(src.getDate() + daysToAdd));
}

function getYYYYMMDD(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getPlanSummaryByID(ctrler: TravelPlanController, id: string): Promise<DBTravelPlanSummary> {
  return ctrler.getPlanSummary(id).then((v) => {
    const ret = v.data();
    if (ret == null) {
      throw new Error("TravelPlanSummary is NULL");
    } else {
      return ret;
    }
  });
}

function getPlanActionsByIDAndDate(ctrler: TravelPlanController, id: string, date: Date): Promise<Map<string, DBActionData>> {
  return ctrler.getDailyPlanActionCollection(id, date).then((v) => {
    const retVal:Map<string, DBActionData> = new Map();

    v.docs.forEach((d) => retVal.set(d.id, d.data()));

    return retVal;
  });
}

function changeTLShowing(router: NextRouter, planid: string, showingdate: Date) {
  router.push({ pathname: window.location.origin + window.location.pathname, query: { planid: planid, showingdate: moment(showingdate).format("YYYY-MM-DD") } });
}

function nextPrevClick(router:NextRouter, planID:string, beginDate:Date, currentDate:Date, endDate:Date, direction:number) {
  const newDate = addDate(currentDate, direction);
  if (beginDate<=newDate && newDate <= endDate) {
    changeTLShowing(router, planID, newDate);
  }
}
// #endregion

// #region React (NextJS) Element
const TimeLine = (props: { travelPlanCtrler: TravelPlanController; }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [beginDate, setBeginDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [placeElems, setPlaceElems] = useState<JSX.Element[]>();

  // ref : https://maku.blog/p/r7fou3a/
  // URLクエリパラメータから「旅程ID」と「タイムラインの表示日程」を取得する
  const router = useRouter();
  const { planid, showingdate } = router.query;

  // クエリ入力が配列であればその最初の要素を採用し, そうでなければ(undefinedでない限り)入力値を使用する
  const planID = Array.isArray(planid) ? planid[0] : planid == null || planid.length <= 0 ? travelPlanSampleID : planid;

  // ボタン「>」をクリックしたら日付進める
  const nextclick = () => nextPrevClick(router, planID, beginDate, currentDate, endDate, 1);

  // ボタン「＜」クリックしたら日付戻す
  const prevclick = () => nextPrevClick(router, planID, beginDate, currentDate, endDate, -1);

  const onSaveClicked = () => {
    // 処理
  };

  useEffect(() => {
    getPlanSummaryByID(props.travelPlanCtrler, planID).then((planSummary) => {
      setCurrentDate(getShowingDate(planSummary, showingdate));

      // プランの開始日/終了日のキャッシュ (年月日だけを抽出したものを使用するため)
      setBeginDate(getYYYYMMDD(planSummary.beginDate));
      setEndDate(getYYYYMMDD(planSummary.endDate));

      getPlanActionsByIDAndDate(props.travelPlanCtrler, planID, currentDate).then((v) => {
        const elemArr: JSX.Element[] = [];
        v.forEach((value, key) => elemArr.push(
          <PLACE key={key} actionData={value} />
        ));

        setPlaceElems(elemArr);
      });
    });
  });

  return (
    <div>
      <div className={styles.daytable}>
        <div id={styles.day}>
          <h1>{currentDate.toDateString()}</h1>
        </div>
        <div className={styles.button}>
          <button id={styles.previous} onClick={prevclick}>＜</button>
          <button id={styles.next} onClick={nextclick}>＞</button>
        </div>
        <big id={styles.dayN}>Day{new Date(currentDate.getTime() - beginDate.getTime()).getDate()}</big>
        <div className={styles.saveButton}>
          <Button id={styles.matBtn} onClick={onSaveClicked} variant="contained">保存</Button>
        </div>
      </div>
      <div className={styles.timetable}>
        <div id={styles.time}>
          <ul>
            {time.map( ( time, i ) => <li key={i}>{time}</li> )}
          </ul>
        </div>
        <div className={styles.area}>
          <div style={{ visibility: "visible", position: "relative" }}>
            {placeElems}
          </div>
        </div>
      </div>
    </div>
  );
};
// #endregion

export default TimeLine;
