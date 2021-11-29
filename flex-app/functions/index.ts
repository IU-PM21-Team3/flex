import * as NextJSFunctions from "./firebaseFunctions";
import * as AuthOnCreateDelete from "./AuthOnCreateDelete";

export const nextjsFunc = NextJSFunctions.nextjsFunc;


export const CreateNewFirestoreDocumentForNewUser = AuthOnCreateDelete.CreateNewFirestoreDocumentForNewUser;
export const DeleteFirestoreDocumentForWithdrawUser = AuthOnCreateDelete.DeleteFirestoreDocumentForWithdrawUser;
