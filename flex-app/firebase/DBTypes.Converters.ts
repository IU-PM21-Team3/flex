import { DocumentReference, FirestoreDataConverter, DocumentData, doc } from "firebase/firestore";
import { DBTravelPlanSummary, DBActionData, DBUser, DBDailyPlan, DBTravelPlan } from "./DBTypes";

// #region Firebaseとのデータ型変換用便利関数群

/**
 * Firebaseから返された日付データをJavaScriptのDate型に変換する
 * @param d Firebaseから取得したデータ
 * @returns JavaScriptのDate型に変換したデータ
 */
function FromFirebaseDateToJSDate(d: any): Date {
  return d?.toDate();
}

/**
 * Firebaseから返されたDocumentReference型に含まれるパスのOffset (/travelPlans/... だったのが /projects/tr-dev-flex/databases/(default)/documents/travelPlans/...) などを修正する
 * @param d Firebaseから取得したDocumentReference
 * @returns Offset分を削除したDocumentReference
 */
function RemoveFirestorePathOffset(d: DocumentReference): DocumentReference {
  return doc(d.firestore, d.path);
}

/**
 * Firebaseから返されたDocumentDataをDBTravelPlanSummaryに変換する
 * @param d 入力データ
 * @returns DBTravelPlanSummary型に変換した結果のデータ
 */
function ToDBTravelPlanSummary(d: DocumentData): DBTravelPlanSummary {
  return {
    planName: d.planName,
    description: d.description,
    beginDate: FromFirebaseDateToJSDate(d.beginDate),
    endDate: FromFirebaseDateToJSDate(d.endDate),
    lastUpdate: FromFirebaseDateToJSDate(d.lastUpdate),
  };
}

/**
 * DocumentReference型の配列入力について, 各要素のパスオフセットを除去する
 * @param gotArr 入力配列
 * @returns 出力配列
 */
function ToDocRefArr<T>(gotArr: DocumentReference[]): T[] {
  const retArr: T[] = [];

  if (Array.isArray(gotArr)) {
    gotArr.map((v) => RemoveFirestorePathOffset(v));
  }

  return retArr;
}

/**
 * Firebaseからの入力データをDBActionDataに変換する
 * @param v 入力データ
 * @returns 出力データ
 */
function ToDBActionData(v: any): DBActionData {
  const retD = v as DBActionData;

  retD.arriveDate = FromFirebaseDateToJSDate(v.arriveDate);
  retD.leaveDate = FromFirebaseDateToJSDate(v.leaveDate);

  return retD;
}

// #endregion

// #region FirestoreDataConverter
/** Firestoreとのデータ変換を実装する */
export const DBUserConverter: FirestoreDataConverter<DBUser> = {
  toFirestore: (ts) => ts,

  fromFirestore: (ss, opts) => {
    const gotData: DocumentData = ss.data(opts);
    const retD: DBUser = gotData as DBUser;

    if (Array.isArray(gotData.planSummaries)) {
      retD.planSummaries = gotData.planSummaries.map((v) => RemoveFirestorePathOffset(v).withConverter(DBTravelPlanSummaryConverter));
    }

    retD.createdDate = FromFirebaseDateToJSDate(gotData.createdDate);

    return retD;
  }
};

/** Firestoreとのデータ変換を実装する */
export const DBActionDataConverter: FirestoreDataConverter<DBActionData> = {
  toFirestore: (ts) => ts,

  fromFirestore: (ss, opts) => {
    const gotD: DocumentData = ss.data(opts);
    const retD: DBActionData = gotD as DBActionData;

    retD.arriveDate = FromFirebaseDateToJSDate(gotD.arriveDate);
    retD.leaveDate = FromFirebaseDateToJSDate(gotD.leaveDate);

    return retD;
  }
};

/** Firestoreとのデータ変換を実装する */
export const DBTravelPlanConverter: FirestoreDataConverter<DBTravelPlan> = {
  toFirestore: (ts) => ts,

  fromFirestore: (ss, opts) => {
    const gotD: DocumentData = ss.data(opts);
    const retD: DBTravelPlan = gotD as DBTravelPlan;

    retD.readableUsers = ToDocRefArr(gotD.readableUsers);
    retD.writableUsers = ToDocRefArr(gotD.writableUsers);

    return retD;
  }
};

export const DBTravelPlanSummaryConverter: FirestoreDataConverter<DBTravelPlanSummary> = {
  toFirestore: (ts) => ts,

  fromFirestore: (ss, opts) => ToDBTravelPlanSummary(ss.data(opts))
};

/** Firestoreとのデータ変換を実装する */
export const DBDailyPlanConverter: FirestoreDataConverter<DBDailyPlan> = {
  toFirestore: (ts) => ts,

  fromFirestore: (ss, opts) => {
    const gotD: DocumentData = ss.data(opts);
    const retD: DBDailyPlan = { actions: [] };

    if (Array.isArray(gotD.actions)) {
      retD.actions = gotD.actions.map((v) => ToDBActionData(v));
    }

    return retD;
  }
};
// #endregion
