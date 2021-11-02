import { DocumentReference, FirestoreDataConverter } from "firebase/firestore";

export interface DBTravelPlanSummary {
  planName: string;
  description: string;
  beginDate: Date;
  endDate: Date;
  lastUpdate: Date;
  planDoc: DocumentReference
}

//#region UserData
export type DBPlanTypes = "free" | "pro" | "biz" | "admin";

export const DBPlanTypes_Free: DBPlanTypes = "free";
export const DBPlanTypes_Pro: DBPlanTypes = "pro";
export const DBPlanTypes_Biz: DBPlanTypes = "biz";
export const DBPlanTypes_Admin: DBPlanTypes = "admin";

export interface DBUser {
  displayName: string;
  planType: DBPlanTypes;
  planSummaries: DBTravelPlanSummary[];
}

//#region FirestoreDataConverter
export const DBUserConverter: FirestoreDataConverter<DBUser> = {
  toFirestore: (ts) => ts,

  fromFirestore: (ss, opts) => {
    return ss.data(opts) as DBUser;
  }
}
//#endregion
//#endregion

//#region PlanData
export type DBActionTypes = "unknown" | "visit" | "move";
export const DBPlanTypes_Unknown: DBActionTypes = "unknown";
export const DBPlanTypes_Visit: DBActionTypes = "visit";
export const DBPlanTypes_Move: DBActionTypes = "move";

export type DBBusinessStates = "unknown" | "normal" | "temporaryClosing" | "shortTimeBiz";
export const DBBusinessStates_Unknown: DBBusinessStates = "unknown";
export const DBBusinessStates_Normal: DBBusinessStates = "unknown";
export const DBBusinessStates_TemporaryClosing: DBBusinessStates = "temporaryClosing";
export const DBBusinessStates_ShortTimeBiz: DBBusinessStates = "shortTimeBiz";

export interface DBActionData {
  actionType: DBActionTypes;
  placeName: string;
  placeID?: string;
  arriveDate: Date;
  leaveDate: Date;
  buzinessState: DBBusinessStates;
  memo: string;
}

export interface DBTravelPlan {
  readableUsers: DocumentReference[];
  writableUsers: DocumentReference[];
  planSummary: DBTravelPlanSummary;
}

export interface DBDailyPlan {
  actions: DBActionData[];
}
//#region FirestoreDataConverter
export const DBActionDataConverter: FirestoreDataConverter<DBActionData> = {
  toFirestore: (ts) => ts,

  fromFirestore: (ss, opts) => {
    return ss.data(opts) as DBActionData;
  }
}
export const DBTravelPlanConverter: FirestoreDataConverter<DBTravelPlan> = {
  toFirestore: (ts) => ts,

  fromFirestore: (ss, opts) => {
    return ss.data(opts) as DBTravelPlan;
  }
}
export const DBDailyPlanConverter: FirestoreDataConverter<DBDailyPlan> = {
  toFirestore: (ts) => ts,

  fromFirestore: (ss, opts) => {
    return ss.data(opts) as DBDailyPlan;
  }
}
//#endregion

//#endregion
