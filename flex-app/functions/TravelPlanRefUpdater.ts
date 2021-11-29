import { firestore } from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { DBTravelPlan, DBUser } from "../firebase/DBTypes";
import { DocumentReference } from "@firebase/firestore";
import { document } from "firebase-functions/v1/firestore";
import firebase from "./firebaseApp";

function getReadableUsersRefArr(d:DBTravelPlan):Array<DocumentReference<DBUser>> {
  return "readableUsers" in d ? d.readableUsers : [];
}

function getWritableUsersRefArr(d: DBTravelPlan): Array<DocumentReference<DBUser>> {
  return "writableUsers" in d ? d.writableUsers : [];
}
function getUsersIDArr(d?: DBTravelPlan): Array<string> {
  if (d == undefined) {
    return [];
  } else {
    return Array.from(
      new Set(
        getReadableUsersRefArr(d)
          .concat(
            getWritableUsersRefArr(d)
          )
      )
    ).map((v) => v.id);
  }
}

export const OnTravelPlanWritten = document("travelPlans/{planID}").onWrite((change) => {
  const newAccessableUsers = getUsersIDArr(change.after.data() as DBTravelPlan);
  const oldAccessableUsers = getUsersIDArr(change.before.data() as DBTravelPlan);

  // 新規追加ユーザを検出する
  newAccessableUsers.forEach((userID) => {
    // 変更前にも存在したのであれば, 新規追加ユーザではない
    if (oldAccessableUsers.indexOf(userID) >= 0) {
      return;
    }


    // ユーザデータにTravelPlanのRefを追加する
    return firestore(firebase()).doc("/users/" + userID).update({
      planSummaries: FieldValue.arrayUnion(change.after.ref)
    });
  });

  // 削除ユーザを検出する
  oldAccessableUsers.forEach((userID) => {
    // 変更前にも存在したのであれば, 削除されたユーザではない.
    if (newAccessableUsers.indexOf(userID) >= 0) {
      return;
    }

    // ユーザデータからTravelPlanのRefを削除する
    return firestore(firebase()).doc("/users/" + userID).update({
      planSummaries: FieldValue.arrayRemove(change.after.ref)
    });
  });
});
