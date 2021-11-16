import * as NextJSFunctions from "./firebaseFunctions";
// import { getTrafficInfo } from "./GetTrafficInfo.server";
import * as AuthOnCreateDelete from "./AuthOnCreateDelete";

export const nextjsFunc = NextJSFunctions.nextjsFunc;

// export const gettrafficinfo = getTrafficInfo;

export const CreateNewFirestoreDocumentForNewUser = AuthOnCreateDelete.CreateNewFirestoreDocumentForNewUser;
export const DeleteFirestoreDocumentForWithdrawUser = AuthOnCreateDelete.DeleteFirestoreDocumentForWithdrawUser;
