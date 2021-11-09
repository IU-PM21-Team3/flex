import { flexFirebase } from "../firebase/clientApp";
import { connectAuthEmulator } from "firebase/auth";
import { connectFirestoreEmulator } from "firebase/firestore";
import { connectFunctionsEmulator } from "firebase/functions";

export class flexFirebaseEmulator extends flexFirebase {
  constructor() {
    super();

    // エミュレータに接続する
    connectAuthEmulator(this.auth, "http://localhost:9099");
    connectFirestoreEmulator(this.store, "localhost", 8080);
    connectFunctionsEmulator(this.functions, "localhost", 5001);
  }
}

export const FirebaseEmulatorConnection: flexFirebaseEmulator = new flexFirebaseEmulator();

export default FirebaseEmulatorConnection;
