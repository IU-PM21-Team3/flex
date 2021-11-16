import {
  QuerySnapshot,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  collection,
  deleteDoc,
  DocumentReference,
  CollectionReference,
  Firestore,
  arrayUnion,
  doc
} from "firebase/firestore";
import { DBActionData, DBTravelPlan, DBTravelPlanSummary } from "./DBTypes";
import { DBActionDataConverter, DBTravelPlanConverter, DBTravelPlanSummaryConverter } from "./DBTypes.Converters";
import { UserController } from "./UsersController";
import moment from "moment";

const PATH_TRAVEL_PLANS = "travelPlans";
const PATH_DAILY_PLANS = "dailyPlans";
const PATH_PLAN_SUMARY = "travelPlanSummaries";
const PATH_ACTIONS = "actions";
const DATE_FORMAT = "YYYY-MM-DD";

export class TravelPlanController {
  private db: Firestore;
  private userCtrler: UserController;

  // #region ref generators
  public _getTravelPlanDocRef(planID: string): DocumentReference<DBTravelPlan> {
    return doc(this.db, `/${PATH_TRAVEL_PLANS}/${planID}`).withConverter(DBTravelPlanConverter);
  }

  public _getTravelPlanSummaryCollectionRef(): CollectionReference<DBTravelPlanSummary> {
    return collection(this.db, `/${PATH_PLAN_SUMARY}`).withConverter(DBTravelPlanSummaryConverter);
  }
  public _getTravelPlanSummaryDocRef(planID: string): DocumentReference<DBTravelPlanSummary> {
    return doc(this.db, `/${PATH_PLAN_SUMARY}/${planID}`).withConverter(DBTravelPlanSummaryConverter);
  }

  public _getDailyPlanActionCollectionRef(planID: string, date: Date): CollectionReference<DBActionData> {
    return collection(this.db, `${PATH_TRAVEL_PLANS}/${planID}/${PATH_DAILY_PLANS}/${moment(date).format(DATE_FORMAT)}/${PATH_ACTIONS}`).withConverter(DBActionDataConverter);
  }
  public _getDailyPlanActionDocRef(planID: string, date: Date, actionKey:string): DocumentReference<DBActionData> {
    return doc(this.db, `${PATH_TRAVEL_PLANS}/${planID}/${PATH_DAILY_PLANS}/${moment(date).format(DATE_FORMAT)}/${PATH_ACTIONS}/${actionKey}`).withConverter(DBActionDataConverter);
  }
  // #endregion

  constructor(db:Firestore, userCtrler:UserController) {
    this.db = db;
    this.userCtrler = userCtrler;
  }

  // #region TravelPlan
  /**
   * 旅行プランを新規作成する
   * Summary, TravelPlan, およびuserIDに指定された全ユーザのplanSummariesに追加します
   * userIDに指定されたユーザにはRW権限が与えられます
   * @param userID RW権限を与える (= planSummariesに書き込む)ユーザ (または ユーザの配列)
   * @param summary 旅行プランの概要
   * @returns 旅行プランの概要データへのリンク
   */
  public async createNewTravelPlan(userID: string | string[], summary: DBTravelPlanSummary): Promise<DocumentReference<DBTravelPlanSummary>> {
    const userDocRefArr = (Array.isArray(userID) ? userID : [userID]).map((v) => this.userCtrler._getUserDocRef(v));
    const travelPlanData: DBTravelPlan = {
      readableUsers: userDocRefArr,
      writableUsers: userDocRefArr,
    };

    // SummaryDataを追加
    const addSummaryDocResult = await addDoc(this._getTravelPlanSummaryCollectionRef(), summary);

    // Summaryに割り振られたIDを使ってTravelPlanを追加
    await setDoc(this._getTravelPlanDocRef(addSummaryDocResult.id), travelPlanData);

    // 各ユーザの旅行プラン概要リンク集にリンクを追加する
    userDocRefArr.forEach((userDoc) => updateDoc(userDoc, { planSummaries: arrayUnion(addSummaryDocResult) }));

    return addSummaryDocResult;
  }

  /**
   * 旅行プランの概要を更新する
   * @param travelPlanID 旅行プランID
   * @param summary 書き込むデータ
   * @returns Promiseオブジェクト
   */
  public updatePlanSummary(travelPlanID: string, summary: DBTravelPlanSummary) : Promise<void> {
    const summaryDocRef = this._getTravelPlanSummaryDocRef(travelPlanID);

    return updateDoc(summaryDocRef, summary);
  }
  // #endregion

  // #region DailyPlan / Action
  /**
   * 行動データを新規に追加する
   * @param planID 旅行プランID
   * @param date 行動日
   * @param action 行動データ
   * @returns 書き込んだデータへの参照 およびPromiseオブジェクト
   */
  public addNewDailyPlanAction(planID: string, date: Date, action: DBActionData): Promise<DocumentReference<DBActionData>> {
    const ref = this._getDailyPlanActionCollectionRef(planID, date);

    // (データ重複チェックは省略)
    return addDoc(ref, action);
  }

  /**
   * 行動データ記録を更新する
   * @param planID 旅行プランID
   * @param date 行動日
   * @param actionKey 行動データID
   * @param action 行動データ
   * @returns Promiseオブジェクト
   */
  public updateDailyPlanAction(planID: string, date: Date, actionKey: string, action: DBActionData): Promise<void> {
    const ref = this._getDailyPlanActionDocRef(planID, date, actionKey);

    // 本当は「更新したい項目だけundefined」が適切だが, すべてupdateでも大きな問題はないため省略
    return updateDoc(ref, action);
  }

  /**
   * 行動データ記録を削除する
   * @param planID 旅行プランID
   * @param date 行動日
   * @param actionKey 行動データID
   * @returns Promiseオブジェクト
   */
  public deleteDailyPlanAction(planID: string, date: Date, actionKey: string): Promise<void> {
    const ref = this._getDailyPlanActionDocRef(planID, date, actionKey);

    return deleteDoc(ref);
  }

  /**
   * 指定の行動日に記録された行動データを全て取得する
   * @param planID 旅行プランID
   * @param date 行動日
   * @returns 取得したスナップショット および Promiseオブジェクト
   */
  public getDailyPlanActionCollection(planID: string, date: Date): Promise<QuerySnapshot<DBActionData>> {
    const ref = this._getDailyPlanActionCollectionRef(planID, date);

    return getDocs(ref);
  }
  // #endregion
}