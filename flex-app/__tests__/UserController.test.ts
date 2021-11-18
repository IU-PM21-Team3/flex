import { UserController } from "../firebase/UsersController";
import flexFirebase from "./FirebaseEmulatorConnection";
// import flexFirebase from "../firebase/clientApp";
import { DBUser } from "../firebase/DBTypes";
import { doc, Firestore, setDoc } from "firebase/firestore";
import { DBUserConverter } from "../firebase/DBTypes.Converters";
import { testUserID_1, testUserData_1 } from "./TestDataSources";

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
