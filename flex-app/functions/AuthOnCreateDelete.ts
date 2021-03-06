import { EventContext } from "firebase-functions";
import { UserRecord, user } from "firebase-functions/v1/auth";
import { firestore } from "firebase-admin";
import { DBUser } from "../firebase/DBTypes";
import firebase from "./firebaseApp";

/** 新規加入ユーザの情報をFirestoreに書き込む */
export const CreateNewFirestoreDocumentForNewUser = user().onCreate((user: UserRecord, context: EventContext): Promise<firestore.WriteResult | null> => {
  const userData: DBUser = {
    displayName: user.displayName ?? user.email ?? user.uid,
    planType: "free",
    planSummaries: [],
    createdDate: new Date(Date.parse(context.timestamp))
  };

  const usersDoc = firestore(firebase()).doc("/users/" + user.uid);

  // 新規作成は, ユーザデータが存在しない場合のみ行う (二重でeventがtriggerされたとき用)
  return usersDoc.get().then((v) => v.exists ? null : usersDoc.create(userData));
});

/** 退会したユーザの情報をDBから削除する */
export const DeleteFirestoreDocumentForWithdrawUser = user().onDelete((user: UserRecord): Promise<firestore.WriteResult> => {
  return firestore(firebase()).doc("/users/" + user.uid).delete();
});
