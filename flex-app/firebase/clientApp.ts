import { Functions, getFunctions } from "@firebase/functions";
import { FirebaseApp, initializeApp, FirebaseOptions, deleteApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const clientCredentials: FirebaseOptions = {
  apiKey: "AIzaSyBG-xl2BWKRWFm88QxrtIK4SqRowbKB054",
  authDomain: "tr-flex-dev.firebaseapp.com",
  projectId: "tr-flex-dev",
  storageBucket: "tr-flex-dev.appspot.com",
  messagingSenderId: "1048074287810",
  appId: "1:1048074287810:web:700112690e24e0ef04d95b",
};

export class flexFirebase {
  public get app(): FirebaseApp {
    return this._app;
  }
  public get auth(): Auth {
    return this._auth;
  }
  public get store(): Firestore {
    return this._store;
  }
  public get functions(): Functions {
    return this._functions;
  }

  protected _app: FirebaseApp;
  protected _auth: Auth;
  protected _store: Firestore;
  protected _functions: Functions;

  constructor(app?: FirebaseApp, credentials?: FirebaseOptions) {
    this._app = app ?? initializeApp(credentials ?? clientCredentials);

    this._auth = getAuth(this.app);
    this._store = getFirestore(this.app);
    this._functions = getFunctions(this.app);
  }

  public Dispose(): Promise<void> {
    return deleteApp(this.app);
  }
}

const AppScopeFirebase = new flexFirebase();

export default AppScopeFirebase;
