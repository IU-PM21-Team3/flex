import { UserController } from "../firebase/UsersController";
import { TravelPlanController } from "../firebase/TravelPlanController";
import {
  actionData_1,
  actionData_2,
} from "../__tests_utils__/TestDataSources";
import {
  // assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import { testWithTestEnv } from "./getTestEnv";
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

