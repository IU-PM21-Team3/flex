/** リアルタイムな列車運行情報用のデータ型
 *  ref : https://developer.odpt.org/documents#_1049efb1db75da61e6373bf5014a0f39
 */
export interface IOdptTrainInformation {
  /** JSON-LD仕様に基づく @context のURL */
  "@context": string,
  /** 固有識別子 */
  "@id": string,
  /** クラス名 */
  "@type": string,
  /** データ生成日時 */
  "dc:date": Date,
  /** データ保証期限 */
  "dct:valid"?: Date,
  /** 固有識別子 */
  "owl:sameAs": string,
  /** 発生時刻 */
  "odpt:timeOfOrigin": Date,
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
  "odpt:resumeEstimate"?: Date
};

/** 多言語対応の情報を記録できる型 */
export interface IMultiLangMessage {
  /** 日本語の情報 */
  ja?: string,
  /** 英語の情報 */
  en?: string
}