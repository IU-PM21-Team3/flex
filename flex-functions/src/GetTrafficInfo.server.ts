import * as functions from "firebase-functions";
import { RestClient, IRestResponse, IRequestOptions } from "typed-rest-client/RestClient";
import { IOdptTrainInformation } from "./GetTrafficInfo.type"

// #region 定数宣言
const USER_AGENT = "GCF";
const API_KEY = // "PUT_API_KEY";
  "eeb79adabbb87d6aefdd93ebbde513a95cd99e6634405c84fa99fbbb060a671f";
const TRAFFIC_INFO_KEY = "odpt:TrainInformation";
const BASE_URL = "https://api.odpt.org";
export const API_KEY_OPT: IRequestOptions = {
  queryParameters: {
    params: {
      "acl:consumerKey": API_KEY
    }
  }
};
// #endregion

/** 運行情報を取得する関数 */
export const getTrafficInfo = functions.https.onRequest(async (request, response) => {
  const rest = new RestClient(USER_AGENT, BASE_URL, undefined);
  const res: IRestResponse<IOdptTrainInformation[]>
    = await rest.get<IOdptTrainInformation[]>("/api/v4/" + TRAFFIC_INFO_KEY, API_KEY_OPT);


});
