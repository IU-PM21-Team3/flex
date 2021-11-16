import styles from "../styles/timeline.module.css";
import React from "react";
import PLACE from "./Place";
import { DBTravelPlanSummary, DBActionData } from "../firebase/DBTypes";
import { travelPlanProps, travelPlanSampleID } from "../pages/timeLine";
import { useRouter, NextRouter } from "next/router";
import moment from "moment";

// #region Prepare
export type PlacesDic = { [date: string]: DBActionData[]; };

// スケジュールの初期値
const Places: PlacesDic = {};
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

const time: Array<string> = new Array(21);
for (let i = 0; i < 21; i++) {
  time[i] = String("00" + (i + 4)).slice(-2) + ":00";
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

function getPlanSummaryByID(id: string): DBTravelPlanSummary {
  if (travelPlanProps.planDoc.path === "travelPlans/" + id) {
    return travelPlanProps;
  } else {
    console.error("TravelPlanID is invalid\n", "expected:", "tralvelPlans/" + id, "actual:", travelPlanProps.planDoc.path);
    // throw new Error("TravelPlanID不一致");
    return travelPlanProps;
  }
}

function getPlanActionsByIDAndDate(id: string, date: Date): DBActionData[] {
  if (travelPlanProps.planDoc.path === "travelPlans/" + id) {
    return Places[date.toDateString()];
  } else {
    console.error("TravelPlanID is invalid\n", "expected:", "tralvelPlans/" + id, "actual:", travelPlanProps.planDoc.path);
    // throw new Error("TravelPlanID不一致");
    return Places[date.toDateString()];
  }
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
const TimeLine = () => {
  // ref : https://maku.blog/p/r7fou3a/
  // URLクエリパラメータから「旅程ID」と「タイムラインの表示日程」を取得する
  const router = useRouter();
  const { planid, showingdate } = router.query;

  // クエリ入力が配列であればその最初の要素を採用し, そうでなければ(undefinedでない限り)入力値を使用する
  const planID = Array.isArray(planid) ? planid[0] : planid == null || planid.length <= 0 ? travelPlanSampleID : planid;

  const planSummary = getPlanSummaryByID(planID);
  const currentDate = getShowingDate(planSummary, showingdate);

  // プランの開始日/終了日のキャッシュ (年月日だけを抽出したものを使用するため)
  const beginDate = getYYYYMMDD(planSummary.beginDate);
  const endDate = getYYYYMMDD(planSummary.endDate);

  // ボタン「>」をクリックしたら日付進める
  const nextclick = () => nextPrevClick(router, planID, beginDate, currentDate, endDate, 1);

  // ボタン「＜」クリックしたら日付戻す
  const prevclick = () => nextPrevClick(router, planID, beginDate, currentDate, endDate, -1);

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
      </div>
      <div className={styles.timetable}>
        <div id={styles.time}>
          <ul>
            {time.map( ( time, i ) => <li key={i}>{time}</li> )}
          </ul>
        </div>
        <div className={styles.area}>
          <div style={{ visibility: "visible" }}>
            {getPlanActionsByIDAndDate(planID, currentDate)?.map( ( place ) => {
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
// #endregion

export default TimeLine;
