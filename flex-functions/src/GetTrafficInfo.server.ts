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
const MINIMUM_VALID_TIME = new Date(0, 0, 0, 0, 15, 0).getTime();
// #endregion

/** 運行情報を取得する関数 */
export const getTrafficInfo = functions.https.onRequest(async (request, response) => {
  const rest = new RestClient(USER_AGENT, BASE_URL, undefined);
  const res: IRestResponse<IOdptTrainInformation[]>
    = await rest.get<IOdptTrainInformation[]>("/api/v4/" + TRAFFIC_INFO_KEY, API_KEY_OPT);

  let minimumValidTime: Date = new Date(Date.now() + MINIMUM_VALID_TIME);
  res.result?.forEach(e => {
    // 一旦データ保証期限情報をキャッシュする
    const validT = e["dct:valid"];

    // データ保証期限情報が存在し, かつ参照中の期限情報の方が早く到来する場合には, 
    // 暫定期限情報を更新する
    if (validT != null && validT < minimumValidTime)
      minimumValidTime = validT;
  });

  // 何秒間キャッシュしても大丈夫かを計算する
  const DATE_NOW: number = Date.now();
  const VALID_LIMIT: number = minimumValidTime.getTime();

  // キャッシュの生存期間 [秒]
  const CACHE_LIFE_S: number = Math.floor((VALID_LIMIT - DATE_NOW) / 1000);

  // cache ref : https://blog.katsubemakito.net/firebase/cloudfunctions-cdn-cache
  response.set("Cache-Control", "public, max-age=" + CACHE_LIFE_S).send(res);
});
