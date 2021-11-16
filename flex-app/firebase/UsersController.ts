import {
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  collection,
  DocumentSnapshot,
  DocumentReference,
  Firestore,
  doc
} from "firebase/firestore";
import { DBTravelPlanSummary, DBUser } from "./DBTypes";
import { DBUserConverter } from "./DBTypes.Converters";
import flexFirestore from "./clientApp";

export class UserController {
  private db: Firestore;

  public getUserDocRef(id: string): DocumentReference<DBUser> {
    return doc(this.db, "/users", id).withConverter(DBUserConverter);
  }

  private setUidOrThrowError(id?: string): string {
    id ??= flexFirestore.auth.currentUser?.uid;

    if (id == null) {
      throw new Error("UID is null.  Is it truly logged in?");
    }

    return id;
  }

  constructor(db: Firestore) {
    this.db = db;
  }

  public getUserData(id?: string): Promise<DocumentSnapshot<DBUser>> {
    id = this.setUidOrThrowError(id);

    const ref = this.getUserDocRef(id);

    return getDoc(ref);
  }

  public deleteUserData(id?: string): Promise<void> {
    id = this.setUidOrThrowError(id);

    const ref = this.getUserDocRef(id);

    return deleteDoc(ref);
  }

  public changeDisplayName(newName: string): Promise<void> {
    const id: string = this.setUidOrThrowError();

    const ref = this.getUserDocRef(id);

    return updateDoc(ref, { displayName: newName });
  }

  public getUsersArray(): Promise<{ [uid: string]: DBUser }> {
    const usersCollection = collection(this.db, "users");
    const requestQuery = query(usersCollection).withConverter(DBUserConverter);

    return getDocs(requestQuery).then((value) => {
      const retArr: { [uid: string]: DBUser } = {};

      value.forEach((result) => retArr[result.id] = result.data());

      return retArr;
    });
  }

  public updatePlanSummaries(id?:string, summaries: DBTravelPlanSummary[] = []) {
    id = this.setUidOrThrowError(id);

    const ref = this.getUserDocRef(id);

    return updateDoc(ref, { planSummaries: summaries });
  }

  public addPlanSummary(id?: string, summary?: DBTravelPlanSummary): Promise<void> {
    if (summary == null) {
      return Promise.resolve();
    }

    return this.getUserData(id).then((v) => {
      const arr = v.data()?.planSummaries;

      if (Array.isArray(arr)) {
        arr.push(summary);
        return this.updatePlanSummaries(id, arr);
      } else {
        return Promise.resolve();
      }
    });
  }
}
