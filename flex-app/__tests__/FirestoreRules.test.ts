import { UserController } from "../firebase/UsersController";
import { TravelPlanController } from "../firebase/TravelPlanController";
import {
  actionData_1,
  travelPlanSummary_1,
  userAuthTest1_TestUserData
} from "../__tests_utils__/TestDataSources";
import {
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import { DocumentReference, QuerySnapshot } from "@firebase/firestore";
import { setUserData } from "./UserController.test";
import { cloneDeep } from "lodash";
import { DBActionData, DBTravelPlanSummary } from "../firebase/DBTypes";
import { testWithTestEnv } from "../__tests_utils__/getTestEnv";


/** プランを作成し, 読み取り権限をもたないユーザからの読み込みがignoreされるのを確認する */
testWithTestEnv("TravelPlanSummary read-ignore Test", async (testEnv) => {
  // #region Prepare Test Data
  const userID = "userAuthTest";
  const readerUserID = "userAuthTestReader";
  const planSummary = travelPlanSummary_1;

  const dayCount = 3;

  const planDays = Array.from(Array(dayCount), (v, k) =>
    new Date(new Date(planSummary.beginDate).setDate(planSummary.beginDate.getDate() + k))
  );
  // #endregion

  const userAuth1 = testEnv.authenticatedContext(userID);
  const userAuth2 = testEnv.authenticatedContext(readerUserID);

  const userCtrler: UserController = new UserController(userAuth1.firestore());
  const travelPlanCtrler: TravelPlanController = new TravelPlanController(userCtrler);

  const userCtrler2: UserController = new UserController(userAuth2.firestore());
  const travelPlanCtrler2: TravelPlanController = new TravelPlanController(userCtrler2);

  // ユーザ作成はCloud Function経由で行われるため, 一時的にセキュリティルールを無効化してユーザ作成を行う
  await testEnv.withSecurityRulesDisabled((v) => setUserData(v.firestore(), userAuthTest1_TestUserData, userID));
  await testEnv.withSecurityRulesDisabled((v) => setUserData(v.firestore(), userAuthTest1_TestUserData, readerUserID));

  // ユーザ作成に成功したかを確認する
  const getUserDataResult = await assertSucceeds(userCtrler.getUserData(userID));
  expect(getUserDataResult.data()).toStrictEqual(userAuthTest1_TestUserData);

  const getUserDataResult2 = await assertSucceeds(userCtrler.getUserData(readerUserID));
  expect(getUserDataResult2.data()).toStrictEqual(userAuthTest1_TestUserData);

  // 旅行プランを作成する
  const createNewTravelPlanResult = await assertSucceeds(travelPlanCtrler.createNewTravelPlan(userID, userID, planSummary));
  const travelPlanID = createNewTravelPlanResult.id;

  // #region 作成した旅行プラン(の概要)を取得する
  const getPlanSummaryResult = await assertSucceeds(travelPlanCtrler.getPlanSummary(travelPlanID));

  // 送信したものと一致するか確認する
  expect(getPlanSummaryResult.exists()).toBe(true);
  expect(getPlanSummaryResult.data()).toStrictEqual(planSummary);
  // #endregion

  await assertFails(travelPlanCtrler2.getPlanSummary(travelPlanID));
});

interface TravelPlanCtrlerUnitTestOpts {
  userID: string,
  planSummary: DBTravelPlanSummary,
  dayCount: number,
  actionsPerDay: number,
  readableUsers: string | string[],
  writableUsers: string | string[],
}
