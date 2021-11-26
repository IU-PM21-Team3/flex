import styles from "../styles/timeline.module.css";
import React, { useEffect, useState } from "react";
import PLACE from "./Place";
import { DBTravelPlanSummary, DBActionData } from "../firebase/DBTypes";
import { travelPlanSampleID } from "../pages/timeLine";
import { useRouter, NextRouter } from "next/router";
import moment from "moment";
import { TravelPlanController } from "../firebase/TravelPlanController";
import { Button, LinearProgress } from "@material-ui/core";
import { cloneDeep, isEqual } from "lodash";
import { updatedDiff } from "deep-object-diff";

// #region Prepare
const time: Array<string> = [];
for (let i = 0; i <= 24; i++) {
  time.push(`${i}:00`.padStart(5, "0"));
}
// #endregion

interface KeyValuePair<TKey, TValue>{
  key: TKey;
  value: TValue;
}

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

function nextPrevClick(setIsBusy: React.Dispatch<React.SetStateAction<VisibilityState>>, router:NextRouter, planID:string, beginDate:Date, currentDate:Date, endDate:Date, direction:number) {
  const newDate = addDate(currentDate, direction);
  if (beginDate <= newDate && newDate <= endDate) {
    setIsBusy("visible");
    changeTLShowing(router, planID, newDate);
  }
}

// #endregion

// #region React (NextJS) Element
const TimeLine = (props: { travelPlanCtrler: TravelPlanController; }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [beginDate, setBeginDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [placesKVPArr, setPlacesKVPArr] = useState<KeyValuePair<string, DBActionData | null>[]>([]);
  const [placesOrigDic, setPlacesOrigDic] = useState<Map<string, DBActionData>>(new Map<string, DBActionData>());
  const [isBusy, setIsBusy] = useState<VisibilityState>("visible");

  // ref : https://maku.blog/p/r7fou3a/
  // URLクエリパラメータから「旅程ID」と「タイムラインの表示日程」を取得する
  const router = useRouter();
  const { planid, showingdate } = router.query;

  // クエリ入力が配列であればその最初の要素を採用し, そうでなければ(undefinedでない限り)入力値を使用する
  const planID = Array.isArray(planid) ? planid[0] : planid == null || planid.length <= 0 ? travelPlanSampleID : planid;

  // ボタン「>」をクリックしたら日付進める
  const nextclick = () => nextPrevClick(setIsBusy, router, planID, beginDate, currentDate, endDate, 1);

  // ボタン「＜」クリックしたら日付戻す
  const prevclick = () => nextPrevClick(setIsBusy, router, planID, beginDate, currentDate, endDate, -1);

  // 保存ボタンが押下された際の処理
  const onSaveClicked = () => {
    setIsBusy("visible");

    const addTasks: Promise<Map<string, DBActionData>>[] = [];
    const updateTasks: Promise<void>[] = [];
    const deleteTasks: Promise<void>[] = [];
    const deletedKeys: string[] = [];

    placesKVPArr.forEach((v) => {
      const key = v.key;
      const orig = placesOrigDic.get(v.key);
      const changed = v.value;

      // keyがFirestore側に存在するかどうかチェック
      if (orig != undefined) {
        // 要素が手元で削除されたかどうか確認
        if (changed == null) {
          // 受信したActions内にKeyが存在し, かつ現在TLに表示していない場合は, Firestore側のデータを削除する
          deleteTasks.push(props.travelPlanCtrler.deleteDailyPlanAction(planID, currentDate, key));
          // 表示中要素から削除するために, keyを記憶しておく
          deletedKeys.push(key);

          // 削除に成功したものとして, 手元のキャッシュから削除する
          placesOrigDic.delete(key);
        } else if (!isEqual(changed, orig)) {
          // Firestore側に存在し, かつ「Valueが存在する = 削除されていない」場合はupdateを行う
          updateTasks.push(props.travelPlanCtrler.updateDailyPlanAction(planID, currentDate, key, updatedDiff(orig, changed)));

          // 手元のキャッシュを更新する
          placesOrigDic.set(key, cloneDeep(changed));
        }
      } else if (changed != null) {
        // keyが存在せず, かつvalueがnullでないなら新規追加要素
        addTasks.push(props.travelPlanCtrler.addNewDailyPlanAction(planID, currentDate, changed)
          .then((v) => placesOrigDic.set(v.id, cloneDeep(changed)))
        );
      } else {
        // Firestore側に存在せず, かつ手元でも削除済みのもとは「placesKVPArr」から削除する
        deletedKeys.push(key);
      }
    });

    // タスクをまとめて実行 -> 終了したらProgressBarを非表示にする
    Promise.all([
      Promise.all(addTasks),
      Promise.all(updateTasks),
      Promise.all(deleteTasks)
    ]).then(() => {
      if (deletedKeys.length > 0) {
        setPlacesKVPArr(placesKVPArr.filter((v) => !deletedKeys.includes(v.key)));
      }

      setIsBusy("hidden");
    });
  };

  useEffect(() => {
    getPlanSummaryByID(props.travelPlanCtrler, planID).then((planSummary) => {
      const currentDate = getShowingDate(planSummary, showingdate);
      setCurrentDate(currentDate);

      // プランの開始日/終了日のキャッシュ (年月日だけを抽出したものを使用するため)
      setBeginDate(getYYYYMMDD(planSummary.beginDate));
      setEndDate(getYYYYMMDD(planSummary.endDate));

      getPlanActionsByIDAndDate(props.travelPlanCtrler, planID, currentDate).then((v) => {
        const placesArr: KeyValuePair<string, DBActionData>[] = [];

        v.forEach((value, key) => placesArr.push({ key: key, value: cloneDeep(value) }));

        setPlacesKVPArr(placesArr);
        setPlacesOrigDic(v);
      });
    }).finally(() => setIsBusy("hidden"));
  }, [showingdate, planid]);

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
            {placesKVPArr.map((v) => v.value == null ? (<></>) : (<PLACE key={v.key} actionData={v.value}/>))}
          </div>
        </div>
      </div>

      <LinearProgress id={styles.loadingProgressBar} style={{ visibility: isBusy }} />
    </div>
  );
};
// #endregion

export default TimeLine;
