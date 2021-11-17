import { UserController } from "../firebase/UsersController";
import { DBTravelPlanSummary, DBUser } from "../firebase/DBTypes";
import flexFirebase from "./FirebaseEmulatorConnection";
// import flexFirebase from "../firebase/clientApp";
import { doc, Firestore, setDoc } from "firebase/firestore";
import { TravelPlanController } from "../firebase/TravelPlanController";
import { DBUserConverter } from "../firebase/DBTypes.Converters";

const testUserID_1 = "niocbqnwio";
const testUserID_2 = "nibewocji0f";

const setUserData = (db:Firestore, userData: DBUser, userid: string) => {
  return setDoc(doc(db, "/users", userid).withConverter(DBUserConverter), userData);
};

test("Create User Test With Empty PlanSummaries", async () => {
  const ctrler = new UserController(flexFirebase.store);

  const testUserID: string = testUserID_1;
  const testUserData: DBUser = {
    displayName: "DispName",
    planType: "admin",
    planSummaries: [],
    createdDate: new Date()
  };

  await setUserData(flexFirebase.store, testUserData, testUserID);

  const actual = await ctrler.getUserData(testUserID);

  expect(actual.data()).toStrictEqual(testUserData);
});

test("Delete User Test 1", () => (new UserController(flexFirebase.store)).deleteUserData(testUserID_1));

test("Create User Test With 2 PlanSummaries", async () => {
  const ctrler = new UserController(flexFirebase.store);
  const travelCtrler = new TravelPlanController(flexFirebase.store, ctrler);

  // #region データを準備
  const testUserID: string = testUserID_2;
  const testUserData: DBUser = {
    displayName: "DispName",
    planType: "admin",
    planSummaries: [],
    createdDate: new Date()
  };

  const summary1: DBTravelPlanSummary = {
    planName: "Plan01",
    description: "Plan01Description",
    beginDate: new Date(2021, 10, 10),
    endDate: new Date(2021, 12, 31),
    lastUpdate: new Date()
  };
  const summary2: DBTravelPlanSummary = {
    planName: "Plan02",
    description: "Plan02Description",
    beginDate: new Date(2022, 10, 10),
    endDate: new Date(2022, 12, 31),
    lastUpdate: new Date()
  };
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

test("Add Action Data", async () => {
  const ctrler = new UserController(flexFirebase.store);
  const travelCtrler = new TravelPlanController(flexFirebase.store, ctrler);

  // #region データを準備
  const planID = "BNEJm24DYfFvdjq8wubR";
  const date = new Date("2021-12-30");
  // #endregion

  const result = await travelCtrler.addNewDailyPlanAction(planID, date, {
    actionType: "visit",
    arriveDate: new Date(2021, 12, 30, 11, 30),
    leaveDate: new Date(2021, 12, 30, 15, 0),
    buzinessState: "normal",
    memo: "SAMPLE MEMO",
    placeName: "サンプル観光地",
    placeID: "N/A"
  }).then((v) => {
    travelCtrler.getDailyPlanActionCollection(planID, date).then(console.log).catch(console.error);
    console.log(v);
  }).catch(console.error);

  expect(result).toBeNull();
});

afterAll(() => flexFirebase.Dispose());
