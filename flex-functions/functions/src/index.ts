import * as functions from "firebase-functions";

export const gettrafficinfo = functions.https.onRequest((request, response) => {
  // 仮で空のJsonを返す
  response.send("{}");
});
