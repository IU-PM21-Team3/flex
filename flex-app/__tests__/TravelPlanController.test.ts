import { UserController } from "../firebase/UsersController";
import { TravelPlanController } from "../firebase/TravelPlanController";
import {
  actionData_1,
  actionData_2,
  travelPlanSummary_1,
  userAuthTest1_TestUserData
} from "../__tests_utils__/TestDataSources";
import {
  // assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import { DocumentReference, QuerySnapshot } from "@firebase/firestore";
import { setUserData } from "./UserController.test";
import { cloneDeep } from "lodash";
import { DBActionData } from "../firebase/DBTypes";
import { testWithTestEnv } from "../__tests_utils__/getTestEnv";


testWithTestEnv("Add Action Data", async (testEnv) => {
  const ctrler = new UserController(testEnv.authenticatedContext("myID").firestore());
  const travelCtrler = new TravelPlanController(ctrler);

  // #region データを準備
  const planID = "BNEJm24DYfFvdjq8wubR";
  const date = new Date("2021-12-30");
  // #endregion

  const [result_1, result_2] = await Promise.all([
    assertSucceeds(travelCtrler.addNewDailyPlanAction(planID, date, actionData_1)),
    assertSucceeds(travelCtrler.addNewDailyPlanAction(planID, date, actionData_2)),
  ]);

  const actual = await travelCtrler.getDailyPlanActionCollection(planID, date).then((v) => v.docs);

  actual.forEach((v) => {
    expect(v.data()).toStrictEqual(
      v.id === result_1.id ? actionData_1 :
        v.id === result_2.id ? actionData_2 :
          "ERR!  Unexpected ID : " + v.id
    );
  });
});

testWithTestEnv("TravelPlanCtrler Unit Test", async (testEnv) => {
  // #region Prepare Test Data
  const userID = "userAuthTest1";
  const planSummary = travelPlanSummary_1;

  const dayCount = 3;
  const actionsPerDay = 5;

  const planDays = Array.from(Array(dayCount), (v, k) =>
    new Date(new Date(planSummary.beginDate).setDate(planSummary.beginDate.getDate() + k))
  );

  const actions = Array.from(Array(dayCount), (_, day) =>
    Array.from(Array(actionsPerDay), (_, i) => {
      const v = cloneDeep(actionData_1);

      v.arriveDate = new Date(new Date(planDays[day]).setHours(i * 3, i * 2));
      v.leaveDate = new Date(new Date(planDays[day]).setHours(i * 3 + 1, i * 5));
      v.placeName = `SamplePlace Day${day} - ${i}`;

      return v;
    })
  );
  // #endregion

  const userAuth1 = testEnv.authenticatedContext(userID);

  const userCtrler: UserController = new UserController(userAuth1.firestore());
  const travelPlanCtrler: TravelPlanController = new TravelPlanController(userCtrler);

  // ユーザ作成はCloud Function経由で行われるため, 一時的にセキュリティルールを無効化してユーザ作成を行う
  await testEnv.withSecurityRulesDisabled((v) => setUserData(v.firestore(), userAuthTest1_TestUserData, userID));

  // ユーザ作成に成功したかを確認する
  const getUserDataResult = await assertSucceeds(userCtrler.getUserData(userID));
  expect(getUserDataResult.data()).toStrictEqual(userAuthTest1_TestUserData);

  // 旅行プランを作成する
  const createNewTravelPlanResult = await assertSucceeds(travelPlanCtrler.createNewTravelPlan(userID, planSummary));
  const travelPlanID = createNewTravelPlanResult.id;

  // #region 作成した旅行プラン(の概要)を取得する
  const getPlanSummaryResult = await assertSucceeds(travelPlanCtrler.getPlanSummary(travelPlanID));

  // 送信したものと一致するか確認する
  expect(getPlanSummaryResult.exists()).toBe(true);
  expect(getPlanSummaryResult.data()).toStrictEqual(planSummary);
  // #endregion


  // #region 旅行プランに行動データを追加する
  const addNewDailyPlanActionResultsArr: DocumentReference<DBActionData>[][] = [];
  await Promise.all(
    actions.map(async (arr, i) =>
      addNewDailyPlanActionResultsArr.push(await Promise.all(arr.map((v) =>
        travelPlanCtrler.addNewDailyPlanAction(travelPlanID, planDays[i], v)))
      )
    )
  );

  const dailyPlanActionsMap = new Map<Date, Map<string, DBActionData>>();
  planDays.forEach((v) => dailyPlanActionsMap.set(v, new Map<string, DBActionData>()));

  // あとで使用するためにMapに記録する
  addNewDailyPlanActionResultsArr.forEach((v, day) =>
    v?.forEach((res, i) =>
      dailyPlanActionsMap.get(planDays[day])?.set(res.id, actions[day][i])
    )
  );
  // #endregion

  // #region 追加した行動データを取得する
  const getDailyPlanActionCollectionResultsArr: QuerySnapshot<DBActionData>[] = [];
  planDays.forEach(async (v) =>
    getDailyPlanActionCollectionResultsArr.push(
      await assertSucceeds(
        travelPlanCtrler.getDailyPlanActionCollection(travelPlanID, v)
      )
    )
  );

  // 送信したものと一致するかどうかを確認する
  getDailyPlanActionCollectionResultsArr.forEach((v, day) =>
    v?.docs?.forEach((doc) => {
      expect(doc.exists()).toBe(true);
      expect(doc.data()).toStrictEqual(dailyPlanActionsMap.get(planDays[day])?.get(doc.id));
    })
  );
  // #endregion

  // #region 行動データを修正する
  const actionFixTargetDateNum = 1;
  const actionFixTargetActionNum = 0;
  const actionFixTargetDate = planDays[actionFixTargetDateNum];
  const actionFixTargetID = addNewDailyPlanActionResultsArr[actionFixTargetDateNum][actionFixTargetActionNum].id;
  const actionFixTarget = cloneDeep(actions[actionFixTargetDateNum][actionFixTargetActionNum]);

  // 修正の内容を設定
  actionFixTarget.arriveDate.setMinutes(58);
  actionFixTarget.leaveDate.setMinutes(59);

  await assertSucceeds(travelPlanCtrler.updateDailyPlanAction(travelPlanID, actionFixTargetDate, actionFixTargetID, actionFixTarget));
  // #endregion

  // #region 修正後の行動データを取得する
  const getFixedDailyPlanActionResult = await assertSucceeds(travelPlanCtrler.getDailyPlanAction(travelPlanID, actionFixTargetDate, actionFixTargetID));

  // 修正処理が反映されているか確認する
  expect(getFixedDailyPlanActionResult.exists()).toBe(true);
  expect(getFixedDailyPlanActionResult.data()).toStrictEqual(actionFixTarget);
  // #endregion
});

testWithTestEnv("TravelPlan / Summary Rules Test", (testEnv) => {
  console.log(testEnv.emulators.firestore);
});
