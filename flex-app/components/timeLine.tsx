import styles from "../styles/timeline.module.css";
import React, { useEffect, useState } from "react";
import PLACE from "./Place";
import { DBTravelPlanSummary, DBActionData } from "../firebase/DBTypes";
import { useRouter, NextRouter } from "next/router";
import moment from "moment";
import { TravelPlanController } from "../firebase/TravelPlanController";
import { Button, LinearProgress } from "@material-ui/core";
import { DBActionDataCtrler } from "../firebase/DBActionDataCtrler";

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

function nextPrevClick(setIsBusy: React.Dispatch<React.SetStateAction<VisibilityState>>, router:NextRouter, planID:string, beginDate:Date, currentDate:Date, endDate:Date, direction:number) {
  const newDate = addDate(currentDate, direction);
  if (beginDate <= newDate && newDate <= endDate) {
    setIsBusy("visible");
    changeTLShowing(router, planID, newDate);
  }
}

// #endregion

type TNewPlacesArrElem = [DBActionDataCtrler, JSX.Element];

// #region React (NextJS) Element
const TimeLine = (props: { travelPlanCtrler: TravelPlanController; planSummary: DBTravelPlanSummary }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [beginDate, setBeginDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dbActionDataCtrlerArr, setDBActionDataCtrlerArr] = useState<DBActionDataCtrler[]>([]);
  const [newPlacesArr, setNewPlacesArr] = useState<TNewPlacesArrElem[]>([]);
  const [isBusy, setIsBusy] = useState<VisibilityState>("visible");

  // ref : https://maku.blog/p/r7fou3a/
  // URLクエリパラメータから「旅程ID」と「タイムラインの表示日程」を取得する
  const router = useRouter();
  const { planid, showingdate } = router.query;

  // クエリ入力が配列であればその最初の要素を採用し, そうでなければ(undefinedでない限り)入力値を使用する
  const planID = Array.isArray(planid) ? planid[0] : planid == null || planid.length <= 0 ? "" : planid;

  // ボタン「>」をクリックしたら日付進める
  const nextclick = () => nextPrevClick(setIsBusy, router, planID, beginDate, currentDate, endDate, 1);

  // ボタン「＜」クリックしたら日付戻す
  const prevclick = () => nextPrevClick(setIsBusy, router, planID, beginDate, currentDate, endDate, -1);

  // 保存ボタンが押下された際の処理
  const onSaveClicked = () => {
    setIsBusy("visible");

    // 削除済み要素を配列から削除する
    console.log(dbActionDataCtrlerArr);
    const tmpDBActionDataCtrlerArr = dbActionDataCtrlerArr.filter((v) => !v.isDeleted);
    setDBActionDataCtrlerArr(tmpDBActionDataCtrlerArr);
    console.log(tmpDBActionDataCtrlerArr);

    const tmpNewPlacesArr = newPlacesArr.filter(([v]) => !v.isDeleted);
    setNewPlacesArr(tmpNewPlacesArr);

    // データ更新を実行する
    Promise.all(
      [
        Promise.all(tmpDBActionDataCtrlerArr.map((v) => v.addOrUpdateDailyPlanAction())),
        Promise.all(tmpNewPlacesArr.map(([v]) => v.addOrUpdateDailyPlanAction())),
      ]
    )
      .then(() => setIsBusy("hidden"));
  };

  // 追加ボタンが押下された際の処理
  const onAddClicked = () => {
    const newActionData: DBActionData = {
      actionType: "unknown",
      arriveDate: new Date(currentDate),
      leaveDate: new Date(currentDate),
      businessState: "unknown",
      memo: "",
      placeName: "",
      placeID: ""
    };
    console.log("created:", newActionData);

    const newCtrler = new DBActionDataCtrler(props.travelPlanCtrler, planID, currentDate, newActionData);

    const newTuple: TNewPlacesArrElem = [newCtrler, <PLACE key={Math.random().toString()} ctrler={newCtrler} isStartWithDialogOpen />];

    setNewPlacesArr([...newPlacesArr.filter(([v]) => !v.isDeleted), newTuple]);
  };

  useEffect(() => {
    const currentDate = getShowingDate(props.planSummary, showingdate);
    setCurrentDate(currentDate);

    // プランの開始日/終了日のキャッシュ (年月日だけを抽出したものを使用するため)
    setBeginDate(getYYYYMMDD(props.planSummary.beginDate));
    setEndDate(getYYYYMMDD(props.planSummary.endDate));

    getPlanActionsByIDAndDate(props.travelPlanCtrler, planID, currentDate).then((v) => {
      const ctrlerArr: DBActionDataCtrler[] = [];
      v.forEach((value, key) => ctrlerArr.push(new DBActionDataCtrler(props.travelPlanCtrler, planID, currentDate, value, key)));

      setDBActionDataCtrlerArr(ctrlerArr);
    }).finally(() => setIsBusy("hidden"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.planSummary, showingdate, planid]);

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
        <div className={styles.addButton}>
          <Button id={styles.matBtn} onClick={onAddClicked} variant="contained">追加</Button>
        </div>
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
            {dbActionDataCtrlerArr.map((v) => v.isDeleted ? (<></>) : (<PLACE key={v.DBActionDataID ?? Math.random().toString()} ctrler={v} />))}
            {newPlacesArr.map(([, v])=>v)}
          </div>
        </div>
      </div>

      <LinearProgress id={styles.loadingProgressBar} style={{ visibility: isBusy }} />
    </div>
  );
};
// #endregion

export default TimeLine;
