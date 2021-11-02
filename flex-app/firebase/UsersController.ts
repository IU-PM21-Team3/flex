import { getDoc, setDoc, deleteDoc, DocumentSnapshot, DocumentReference, Firestore, doc } from "firebase/firestore";
import { DBUser, DBUserConverter } from "./DBTypes";
import flexFirestore from "./clientApp";

export class UserController {
  private db: Firestore;

  private getUserDocRef(id: string): DocumentReference<DBUser> {
    return doc(this.db, "/users", id).withConverter(DBUserConverter);
  }

  constructor(db: Firestore) {
    this.db = db;
  }

  public getUserData(id?: string): Promise<DocumentSnapshot<DBUser>> {
    id ??= flexFirestore.auth.currentUser?.uid;
    if (id == null)
      throw new Error("UID is null.  Is it truly logged in?");

    const ref = this.getUserDocRef(id);

    return getDoc(ref);
  }

  public setUserData(user: DBUser, id?: string): Promise<void> {
    id ??= flexFirestore.auth.currentUser?.uid;
    if (id == null)
      throw new Error("UID is null.  Is it truly logged in?");

    const ref = this.getUserDocRef(id);

    return setDoc(ref, user);
  }

  public deleteUserData(id?: string): Promise<void> {
    id ??= flexFirestore.auth.currentUser?.uid;
    if (id == null)
      throw new Error("UID is null.  Is it truly logged in?");

    const ref = this.getUserDocRef(id);

    return deleteDoc(ref);
  }
}