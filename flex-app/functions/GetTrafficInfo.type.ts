/** リアルタイムな列車運行情報用のデータ型
 *  ref : https://developer.odpt.org/documents#_1049efb1db75da61e6373bf5014a0f39
 */

export interface IOdptTrainInformation<TDate> {
  /** JSON-LD仕様に基づく @context のURL */
  "@context": string,
  /** 固有識別子 */
  "@id": string,
  /** クラス名 */
  "@type": string,
  /** データ生成日時 */
  "dc:date": TDate,
  /** データ保証期限 */
  "dct:valid"?: TDate,
  /** 固有識別子 */
  "owl:sameAs": string,
  /** 発生時刻 */
  "odpt:timeOfOrigin": TDate,
  /** 運行会社ID */
  "odpt:operator": string,
  /** 発生路線ID */
  "odpt:railway"?: string,
  /** 運行情報の概要(遅延など) 平常時は省略 */
  "odpt:trainInformationStatus"?: IMultiLangMessage,
  /** 運行情報テキスト(詳細情報) */
  "odpt:trainInformationText": IMultiLangMessage,
  /** 運行情報の適用される方向 */
  "odpt:railDirection"?: string,
  /** 発生エリア */
  "odpt:trainInformationArea"?: IMultiLangMessage,
  /** 鉄道種類 */
  "odpt:trainInformationKind"?: IMultiLangMessage,
  /** 発生場所起点 */
  "odpt:stationFrom"?: string,
  /** 発生場所終点 */
  "odpt:stationTo"?: string,
  /** 発生区間 */
  "odpt:trainInformationRange": IMultiLangMessage,
  /** 発生理由 */
  "odpt:trainInformationCause": IMultiLangMessage,
  /** 振替路線一覧リスト */
  "odpt:transferRailways"?: string[]
  /** 復旧見込み時刻 */
  "odpt:resumeEstimate"?: TDate
}

/** 多言語対応の情報を記録できる型 */
export interface IMultiLangMessage {
  /** 日本語の情報 */
  ja?: string,
  /** 英語の情報 */
  en?: string
}

/**
 *  IOdptTrainInformation<Date> => IOdptTrainInformation<string>
 * @param {IOdptTrainInformation<Date>} d 入力データ
 * @return {IOdptTrainInformation<string>} 出力データ(Dateがstringに変換されたもの)
 */
export function toIOdptTrainInformationWithString(d: IOdptTrainInformation<Date>): IOdptTrainInformation<string> {
  return {
    "@context": d["@context"],
    "@id": d["@id"],
    "@type": d["@type"],
    "dc:date": d["dc:date"].toString(),
    "dct:valid": d["dct:valid"]?.toString(),
    "owl:sameAs": d["owl:sameAs"],
    "odpt:timeOfOrigin": d["odpt:timeOfOrigin"].toString(),
    "odpt:operator": d["odpt:operator"],
    "odpt:railway": d["odpt:railway"],
    "odpt:trainInformationStatus": d["odpt:trainInformationStatus"],
    "odpt:trainInformationText": d["odpt:trainInformationText"],
    "odpt:railDirection": d["odpt:railDirection"],
    "odpt:trainInformationArea": d["odpt:trainInformationArea"],
    "odpt:trainInformationKind": d["odpt:trainInformationKind"],
    "odpt:stationFrom": d["odpt:stationFrom"],
    "odpt:stationTo": d["odpt:stationTo"],
    "odpt:trainInformationRange": d["odpt:trainInformationRange"],
    "odpt:trainInformationCause": d["odpt:trainInformationCause"],
    "odpt:transferRailways": d["odpt:transferRailways"],
    "odpt:resumeEstimate": d["odpt:resumeEstimate"]?.toString(),
  };
}

/**
 *  IOdptTrainInformation<Date>[] => IOdptTrainInformation<string>[]
 * @param {IOdptTrainInformation<Date>[]} d 入力データ配列
 * @return {IOdptTrainInformation<string>[]} 出力データ配列(Dateがstringに変換されたものの配列)
 */
export function toIOdptTrainInformationArrWithString(d: IOdptTrainInformation<Date>[]): IOdptTrainInformation<string>[] {
  const arr: IOdptTrainInformation<string>[] = [];
  d.forEach((v) => arr.push(toIOdptTrainInformationWithString(v)));
  return arr;
}

// function toDateOrUndefined(d?: string): Date | undefined {
//   return d == null ? undefined : new Date(d);
// }

// /**
//  *  IOdptTrainInformation<Date> => IOdptTrainInformation<string>
//  * @param {IOdptTrainInformation<Date>} d 入力データ
//  * @return {IOdptTrainInformation<string>} 出力データ(Dateがstringに変換されたもの)
//  */
// export function fromIOdptTrainInformationWithString(d: IOdptTrainInformation<string>): IOdptTrainInformation<Date> {
//   return {
//     "@context": d["@context"],
//     "@id": d["@id"],
//     "@type": d["@type"],
//     "dc:date": new Date(d["dc:date"]),
//     "dct:valid": toDateOrUndefined(d["dct:valid"]),
//     "owl:sameAs": d["owl:sameAs"],
//     "odpt:timeOfOrigin": new Date(d["odpt:timeOfOrigin"]),
//     "odpt:operator": d["odpt:operator"],
//     "odpt:railway": d["odpt:railway"],
//     "odpt:trainInformationStatus": d["odpt:trainInformationStatus"],
//     "odpt:trainInformationText": d["odpt:trainInformationText"],
//     "odpt:railDirection": d["odpt:railDirection"],
//     "odpt:trainInformationArea": d["odpt:trainInformationArea"],
//     "odpt:trainInformationKind": d["odpt:trainInformationKind"],
//     "odpt:stationFrom": d["odpt:stationFrom"],
//     "odpt:stationTo": d["odpt:stationTo"],
//     "odpt:trainInformationRange": d["odpt:trainInformationRange"],
//     "odpt:trainInformationCause": d["odpt:trainInformationCause"],
//     "odpt:transferRailways": d["odpt:transferRailways"],
//     "odpt:resumeEstimate": toDateOrUndefined(d["odpt:resumeEstimate"]),
//   };
// }

// /**
//  *  IOdptTrainInformation<Date>[] => IOdptTrainInformation<string>[]
//  * @param {IOdptTrainInformation<Date>[]} d 入力データ配列
//  * @return {IOdptTrainInformation<string>[]} 出力データ配列(Dateがstringに変換されたものの配列)
//  */
// export function fromIOdptTrainInformationArrWithString(d: IOdptTrainInformation<string>[]): IOdptTrainInformation<Date>[] {
//   const arr: IOdptTrainInformation<Date>[] = [];
//   d.forEach((v) => arr.push(fromIOdptTrainInformationWithString(v)));
//   return arr;
// }

