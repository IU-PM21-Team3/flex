import {
  // assertFails,
  // assertSucceeds,
  initializeTestEnvironment,
  // RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import fs from "fs";
// import { UserController } from "../firebase/UsersController";
// import { DBUser } from "../firebase/DBTypes";


export const abc = 2;

test("test001", async () => {
  const app = await initializeTestEnvironment({
    projectId: "demo-project-1234",
    firestore: {
      rules: fs.readFileSync("firestore.rules", "utf8"),
    },
  });
  // const authd_store = app.authenticatedContext("abc");
  // const ctrler = new UserController(authd_store.firestore());

  console.log(app);
  expect(app != null).toBe(true);
});
