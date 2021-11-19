import { UserController } from "../firebase/UsersController";
import { DBUser } from "../firebase/DBTypes";
import { doc, Firestore, setDoc } from "firebase/firestore";
import { DBUserConverter } from "../firebase/DBTypes.Converters";
import { testUserID_1, testUserData_1 } from "../__tests_utils__/TestDataSources";

// CompatFirestore ref : https://github.com/firebase/firebase-js-sdk/issues/5550
import { FirebaseFirestore as CompatFirestore } from "@firebase/firestore-types";
import { testWithTestEnv } from "../__tests_utils__/getTestEnv";


export const setUserData = (db: Firestore | CompatFirestore, userData: DBUser, userid: string) => {
  return setDoc(doc(db as Firestore, "/users", userid).withConverter(DBUserConverter), userData);
};

testWithTestEnv("getUserData Test", async (testEnv) => {
  const store = testEnv.authenticatedContext("testID").firestore();
  const ctrler = new UserController(store);

  const testUserID: string = testUserID_1;
  const testUserData: DBUser = testUserData_1;

  // ユーザデータの作成はサーバ側で行われるものであるため
  await setUserData(store, testUserData, testUserID);

  const actual = await ctrler.getUserData(testUserID);

  expect(actual.data()).toStrictEqual(testUserData);
});
