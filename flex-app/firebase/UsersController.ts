import {
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  DocumentSnapshot,
  DocumentReference,
  Firestore,
  doc
} from "firebase/firestore";
import { DBUser } from "./DBTypes";
import { DBUserConverter } from "./DBTypes.Converters";
import flexFirestore from "./clientApp";

export class UserController {
  private db: Firestore;

  private getUserDocRef(id: string): DocumentReference<DBUser> {
    return doc(this.db, "/users", id).withConverter(DBUserConverter);
  }

  private setUidOrThrowError(id?: string): string {
    id ??= flexFirestore.auth.currentUser?.uid;

    if (id == null)
      throw new Error("UID is null.  Is it truly logged in?");

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
}
