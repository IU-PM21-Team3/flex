import { UserController } from "../firebase/UsersController";
import { DBTravelPlanSummary, DBUser } from "../firebase/DBTypes";
import flexFirebase from "./FirebaseEmulatorConnection";
// import flexFirebase from "../firebase/clientApp";
import { doc, Firestore, setDoc } from "firebase/firestore";
import { TravelPlanController } from "../firebase/TravelPlanController";
import { DBUserConverter } from "../firebase/DBTypes.Converters";
import { testUserID_1, testUserID_2, testUserData_1, travelPlanSummary_1, travelPlanSummary_2 } from "./TestDataSources";

// CompatFirestore ref : https://github.com/firebase/firebase-js-sdk/issues/5550
import { FirebaseFirestore as CompatFirestore } from "@firebase/firestore-types";


export const setUserData = (db: Firestore | CompatFirestore, userData: DBUser, userid: string) => {
  return setDoc(doc(db as Firestore, "/users", userid).withConverter(DBUserConverter), userData);
};

test("getUserData Test", async () => {
  const ctrler = new UserController(flexFirebase.store);

  const testUserID: string = testUserID_1;
  const testUserData: DBUser = testUserData_1;

  // ユーザデータの作成はサーバ側で行われるものであるため
  await setUserData(flexFirebase.store, testUserData, testUserID);

  const actual = await ctrler.getUserData(testUserID);

  expect(actual.data()).toStrictEqual(testUserData);
});

test("Delete User Test 1", () => (new UserController(flexFirebase.store)).deleteUserData(testUserID_1));

test("Create User Test With 2 PlanSummaries", async () => {
  const ctrler = new UserController(flexFirebase.store);
  const travelCtrler = new TravelPlanController(ctrler);

  // #region データを準備
  const testUserID: string = testUserID_2;
  const testUserData: DBUser = testUserData_1;

  const summary1: DBTravelPlanSummary = travelPlanSummary_1;
  const summary2: DBTravelPlanSummary = travelPlanSummary_2;
  // #endregion

  // ユーザデータをセット
  await setUserData(flexFirebase.store, testUserData, testUserID);

  const summary1Result = await travelCtrler.createNewTravelPlan(testUserID, summary1);
  const summary2Result = await travelCtrler.createNewTravelPlan(testUserID, summary2);

  testUserData.planSummaries.push(summary1Result);
  testUserData.planSummaries.push(summary2Result);

  const actual = await ctrler.getUserData(testUserID);

  expect(actual.data()).toStrictEqual(testUserData);
});

afterAll(() => flexFirebase.Dispose());
