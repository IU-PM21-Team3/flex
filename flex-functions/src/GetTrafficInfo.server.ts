import * as functions from "firebase-functions";
import { CallableContext, } from "firebase-functions/v1/https";
// import { RestClient, IRestResponse, IRequestOptions } from "typed-rest-client/RestClient";
// import { IOdptTrainInformation, /* toIOdptTrainInformationArrWithString */ } from "./GetTrafficInfo.type";

// #region 定数宣言
// const USER_AGENT = "GCF";
// const API_KEY = // "PUT_API_KEY";
//   "eeb79adabbb87d6aefdd93ebbde513a95cd99e6634405c84fa99fbbb060a671f";
// const TRAFFIC_INFO_KEY = "odpt:TrainInformation";
// const BASE_URL = "https://api.odpt.org";
// export const API_KEY_OPT: IRequestOptions = {
//   queryParameters: {
//     params: {
//       "acl:consumerKey": API_KEY
//     }
//   }
// };
// #endregion

/** 運行情報を取得する関数 */
export const getTrafficInfo = functions.https.onCall(async (data, context: CallableContext) => {
//  export const getTrafficInfo = functions.https.onCall(async (data, context: CallableContext): Promise<IOdptTrainInformation<string>[]> => {
  // const rest = new RestClient(USER_AGENT, BASE_URL, undefined);
  // const res: IRestResponse<IOdptTrainInformation<Date>[]> = await rest.get<IOdptTrainInformation<Date>[]>("/api/v4/" + TRAFFIC_INFO_KEY, API_KEY_OPT);

  // if (res.statusCode != 200 || res.result == null) {
  //   throw new HttpsError("unavailable", res.result?.toString() ?? "REST Error");
  // }

  // Cloud FuncyionsではDate型をJSONに変換してくれないため, 送信前にtoStringをかける
  // ref : https://note.com/zy6wh1b6heb6vq0b/n/nac7a52ca5be3

  // return toIOdptTrainInformationArrWithString(res.result);
  // console.log(res.result);
  const firstNumber = 10;
  const secondNumber = 20;
  return {
    firstNumber: firstNumber,
    secondNumber: secondNumber,
    operator: "+",
    operationResult: firstNumber + secondNumber,
  };
});
