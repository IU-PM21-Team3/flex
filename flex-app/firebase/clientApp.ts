import { Functions, getFunctions } from "@firebase/functions";
import { FirebaseApp, initializeApp, FirebaseOptions, deleteApp } from "firebase/app";
import { getAuth, Auth, connectAuthEmulator, signInAnonymously } from "firebase/auth";
import { getFirestore, Firestore, connectFirestoreEmulator } from "firebase/firestore";
import { connectFunctionsEmulator } from "firebase/functions";

// ref : https://www.reddit.com/r/Firebase/comments/nntc4d/cant_connect_to_firestore_emulator_in_nextjs/
const isBrowser =
  typeof window !== "undefined" && typeof window.document !== "undefined";

const isLocalhost =
  isBrowser &&
  Boolean(
    window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

const isInitWithAnonymousUser = isLocalhost && false;

const __DEBUG__ = isLocalhost && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true";
const __DEBUG_SERVER_ADDR__ = "127.0.0.1";
const __DEBUG_AUTH_EMU_PORT__ = 9099;
const __DEBUG_STORE_EMU_PORT__ = 8080;
const __DEBUG_FUNC_EMU_PORT__ = 5001;

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

    // エミュレータに接続する
    if (__DEBUG__) {
      console.log("__DEBUG_MODE__");
      connectAuthEmulator(this.auth, `http://${__DEBUG_SERVER_ADDR__}:${__DEBUG_AUTH_EMU_PORT__}`);
      connectFirestoreEmulator(this.store, __DEBUG_SERVER_ADDR__, __DEBUG_STORE_EMU_PORT__);
      connectFunctionsEmulator(this.functions, __DEBUG_SERVER_ADDR__, __DEBUG_FUNC_EMU_PORT__);

      // デバッグ時に匿名ユーザを使用する場合用
      if (isInitWithAnonymousUser) {
        signInAnonymously(this.auth);
      }
    }
  }

  public Dispose(): Promise<void> {
    return deleteApp(this.app);
  }
}

const AppScopeFirebase = new flexFirebase();

export default AppScopeFirebase;
