import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const clientCredentials = {
  apiKey: "AIzaSyBG-xl2BWKRWFm88QxrtIK4SqRowbKB054",
  authDomain: "tr-flex-dev.firebaseapp.com",
  projectId: "tr-flex-dev",
  storageBucket: "tr-flex-dev.appspot.com",
  messagingSenderId: "1048074287810",
  appId: "1:1048074287810:web:700112690e24e0ef04d95b",
};

export default class flexFirebase {
  public static app: FirebaseApp = initializeApp(clientCredentials);
  public static auth: Auth = getAuth(this.app);
  public static store: Firestore = getFirestore(this.app);
}
