import { UserController } from "../firebase/UsersController";
import { DBUser } from "../firebase/DBTypes";
import flexFirebase from "./FirebaseEmulatorConnection";
import { doc } from "firebase/firestore";

const testUserID_1: string = "niocbqnwio";
const testUserID_2: string = "nibewocji0f";

test("Create User Test With Empty PlanSummaries", async () => {
  const ctrler = new UserController(flexFirebase.store);

  const testUserID: string = testUserID_1;
  const testUserData: DBUser = {
    displayName: "DispName",
    planType: "admin",
    planSummaries: []
  }

  await ctrler.setUserData(testUserData, testUserID);

  const actual = await ctrler.getUserData(testUserID);

  expect(actual.data()).toStrictEqual(testUserData);
});

test("Delete User Test 1", () => (new UserController(flexFirebase.store)).deleteUserData(testUserID_1));

test("Create User Test With 2 PlanSummaries", async () => {
  const ctrler = new UserController(flexFirebase.store);

  const testUserID: string = testUserID_2;
  const testUserData: DBUser = {
    displayName: "DispName",
    planType: "admin",
    planSummaries: [
      {
        planName: "Plan01",
        description: "Plan01Description",
        beginDate: new Date(2021, 10, 10),
        endDate: new Date(2021, 12, 31),
        lastUpdate: new Date(),
        planDoc: doc(flexFirebase.store, "/travelPlans", "plan01")
      },
      {
        planName: "Plan02",
        description: "Plan02Description",
        beginDate: new Date(2022, 10, 10),
        endDate: new Date(2022, 12, 31),
        lastUpdate: new Date(),
        planDoc: doc(flexFirebase.store, "/travelPlans", "plan02")
      },
    ]
  }

  await ctrler.setUserData(testUserData, testUserID);

  const actual = await ctrler.getUserData(testUserID);

  expect(actual.data()).toStrictEqual(testUserData);
});

afterAll(() => flexFirebase.Dispose());
