/* eslint-disable camelcase */
import { DocumentReference } from "firebase/firestore";

/** データベースに保存する, 旅行プランの概要 */
export interface DBTravelPlanSummary {
  /** 旅行プランの表示名 */
  planName: string;

  /** 旅行プランの説明 */
  description: string;

  /** 旅行プランの開始日 */
  beginDate: Date;

  /** 旅行プランの終了日 */
  endDate: Date;

  /** 旅行プランの最終更新日時 */
  lastUpdate: Date;

  /** 旅行プランDocumentへのリンク */
  planDoc: DocumentReference
}

// #region UserData
/** ユーザのプラン種類 (無料プラン / 有料プラン 等々) */
export type DBUserPlanTypes = "free" | "pro" | "biz" | "admin";

/** データベースに保存するユーザ情報 */
export interface DBUser {
  /** ユーザの表示名 */
  displayName: string;

  /** ユーザの種類 */
  planType: DBUserPlanTypes;

  /** 自身が保有する旅行プラン概要の配列 */
  planSummaries: DBTravelPlanSummary[];

  /** ユーザの作成日 */
  createdDate: Date;
}
// #endregion

// #region PlanData
/** 旅程中に存在する行動情報の種類 */
export type DBActionTypes = "unknown" | "visit" | "move";

/** 旅程中に存在する訪問先の営業情報 */
export type DBBusinessStates = "unknown" | "normal" | "temporaryClosing" | "shortTimeBiz";

/** 旅程中に存在する行動 (移動 / 訪問 等々) のデータ */
export interface DBActionData {
  /** 行動の種類 */
  actionType: DBActionTypes;

  /** 行動先の名前 (場所の名前 / 移動手段の名前 など) */
  placeName: string;

  /** Google MapのPlace ID */
  placeID?: string;

  /** 到着予定日時 */
  arriveDate: Date;

  /** 離脱予定日時 */
  leaveDate: Date;

  /** 営業情報 */
  buzinessState: DBBusinessStates;

  /** メモ */
  memo: string;
}

/** 旅行プランデータ */
export interface DBTravelPlan {
  /** 閲覧可能なユーザのリスト */
  readableUsers: DocumentReference[];

  /** 書き込み可能なユーザのリスト */
  writableUsers: DocumentReference[];

  /** この旅行プランの概要情報 */
  planSummary: DBTravelPlanSummary;
}

/** 1日ごとの旅行プラン (プラン中に存在する行動データの配列) */
export interface DBDailyPlan {
  /** その日の行動データ配列 */
  actions: DBActionData[];
}
// #endregion
