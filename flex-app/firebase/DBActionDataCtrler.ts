import { updatedDiff } from "deep-object-diff";
import { cloneDeep, isEqual } from "lodash";
import { DBActionData } from "./DBTypes";
import { TravelPlanController } from "./TravelPlanController";

export class DBActionDataCtrler {
  private _travelPlanCtrler: TravelPlanController;
  public get travelPlanCtrler() : TravelPlanController {
    return this._travelPlanCtrler;
  }

  private _DBActionData: DBActionData;
  public get DBActionData(): DBActionData {
    return this._DBActionData;
  }

  private _OriginalDBActionData: DBActionData;
  public get OriginalDBActionData(): Readonly<DBActionData> {
    return this._OriginalDBActionData;
  }

  private _DBActionDataID?: string;
  public get DBActionDataID(): string | undefined {
    return this._DBActionDataID;
  }

  private _isDeleted = true;
  public get isDeleted(): boolean {
    return this._isDeleted;
  }

  private readonly planID: string;

  private readonly date: Date;

  constructor(ctrler: TravelPlanController, planID: string, date: Date, dbActionData: DBActionData, dbActionDataID?: string) {
    this._travelPlanCtrler = ctrler;
    this.planID = planID;
    this.date = date;
    this._DBActionData = dbActionData;
    this._OriginalDBActionData = cloneDeep(dbActionData);
    this._DBActionDataID = dbActionDataID;

    if (dbActionDataID != undefined) {
      this._isDeleted = false;
    }
  }

  public addOrUpdateDailyPlanAction(newData?: DBActionData): Promise<DBActionData> {
    if (newData != null) {
      this._DBActionData = newData;
    }

    if (this.DBActionDataID == undefined) {
      // ActionID未設定の場合は「新規追加」
      return this.travelPlanCtrler.addNewDailyPlanAction(this.planID, this.date, this.DBActionData)
        .then((v) => this._DBActionDataID = v.id)
        .then(() => this._isDeleted = false)
        .then(() => this._OriginalDBActionData = cloneDeep(this.DBActionData));
    } else if (!isEqual(this.DBActionData, this.OriginalDBActionData)) {
      // ActionID設定済みの場合は「データ更新」
      return this.travelPlanCtrler.updateDailyPlanAction(this.planID, this.date, this.DBActionDataID, updatedDiff(this.OriginalDBActionData, this.DBActionData))
        .then(() => this._OriginalDBActionData = cloneDeep(this.DBActionData));
    }

    return Promise.resolve(this.DBActionData);
  }

  public deleteDailyPlanAction(): Promise<void> {
    if (this.DBActionDataID == undefined) {
      // ActionIDがundefinedであれば「削除済み」
      return Promise.resolve();
    } else {
      // ActionIDがundefinedでなければ, データの削除を実行してIDをundefinedにする
      return this.travelPlanCtrler.deleteDailyPlanAction(this.planID, this.date, this.DBActionDataID)
        .then(() => this._isDeleted = true)
        .then(() => this._DBActionDataID = undefined);
    }
  }
}
