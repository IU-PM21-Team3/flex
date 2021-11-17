import { DBTravelPlanSummary, DBUser, DBActionData } from "../firebase/DBTypes";

export const testUserID_1 = "niocbqnwio";
export const testUserID_2 = "nibewocji0f";

export const testUserData_1: DBUser = {
  displayName: "DispName",
  planType: "admin",
  planSummaries: [],
  createdDate: new Date()
};

export const travelPlanSummary_1: DBTravelPlanSummary = {
  planName: "Plan01",
  description: "Plan01Description",
  // 11月10日 ~ 翌1月3日
  beginDate: new Date(2021, 10, 10),
  endDate: new Date(2022, 1, 3),
  lastUpdate: new Date()
};

export const travelPlanSummary_2: DBTravelPlanSummary = {
  planName: "Plan02",
  description: "Plan02Description",
  // 11月10日 ~ 12月31日
  beginDate: new Date(2022, 10, 10),
  endDate: new Date(2022, 11, 31),
  lastUpdate: new Date()
};

export const actionData_1: DBActionData = {
  actionType: "visit",
  arriveDate: new Date(2021, 11, 30, 11, 30),
  leaveDate: new Date(2021, 11, 30, 15, 0),
  buzinessState: "normal",
  memo: "SAMPLE MEMO",
  placeName: "サンプル観光地 1",
  placeID: "N/A"
};
export const actionData_2: DBActionData = {
  actionType: "visit",
  arriveDate: new Date(2021, 11, 30, 18, 30),
  leaveDate: new Date(2021, 11, 30, 24, 0),
  buzinessState: "normal",
  memo: "SAMPLE MEMO",
  placeName: "サンプル観光地 2",
  placeID: "N/A"
};
