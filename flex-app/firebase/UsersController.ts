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
import { FirebaseFirestore as CompatFirestore } from "@firebase/firestore-types";
import { DBUser } from "./DBTypes";
import { DBUserConverter } from "./DBTypes.Converters";
import flexFirestore from "./clientApp";

export class UserController {
  public _db: Firestore;

  public _getUserDocRef(id: string): DocumentReference<DBUser> {
    return doc(this._db, "/users", id).withConverter(DBUserConverter);
  }

  private setUidOrThrowError(id?: string): string {
    id ??= flexFirestore.auth.currentUser?.uid;

    if (id == null) {
      throw new Error("UID is null.  Is it truly logged in?");
    }

    return id;
  }

  constructor(db: CompatFirestore | Firestore) {
    this._db = db as Firestore;
  }

  public getUserData(id?: string): Promise<DocumentSnapshot<DBUser>> {
    id = this.setUidOrThrowError(id);

    const ref = this._getUserDocRef(id);

    return getDoc(ref);
  }

  public deleteUserData(id?: string): Promise<void> {
    id = this.setUidOrThrowError(id);

    const ref = this._getUserDocRef(id);

    return deleteDoc(ref);
  }

  public changeDisplayName(newName: string): Promise<void> {
    const id: string = this.setUidOrThrowError();

    const ref = this._getUserDocRef(id);

    return updateDoc(ref, { displayName: newName });
  }

  public getUsersArray(): Promise<{ [uid: string]: DBUser }> {
    const usersCollection = collection(this._db, "users");
    const requestQuery = query(usersCollection).withConverter(DBUserConverter);

    return getDocs(requestQuery).then((value) => {
      const retArr: { [uid: string]: DBUser } = {};

      value.forEach((result) => retArr[result.id] = result.data());

      return retArr;
    });
  }
}
