import { updatedDiff } from "deep-object-diff";
import { cloneDeep } from "lodash";
import { DBTravelPlanSummary } from "./DBTypes";
import { TravelPlanController } from "./TravelPlanController";

export class DBTravelPlanDataCtrler {
  private _travelPlanCtrler: TravelPlanController;
  public get travelPlanCtrler(): TravelPlanController {
    return this._travelPlanCtrler;
  }

  private _DBTravelPlanSummary: DBTravelPlanSummary;
  public get DBTravelPlanSummary(): DBTravelPlanSummary {
    return this._DBTravelPlanSummary;
  }

  private _OriginalDBTravelPlanSummary: DBTravelPlanSummary;
  public get OriginalDBTravelPlanSummary(): Readonly<DBTravelPlanSummary> {
    return this._OriginalDBTravelPlanSummary;
  }

  private _isDeleted = true;
  public get isDeleted(): boolean {
    return this._isDeleted;
  }

  private readonly planID: string;

  constructor(ctrler: TravelPlanController, planID: string, dbTravelPlanSummary: DBTravelPlanSummary) {
    this._travelPlanCtrler = ctrler;
    this.planID = planID;
    this._DBTravelPlanSummary = dbTravelPlanSummary;
    this._OriginalDBTravelPlanSummary = cloneDeep(dbTravelPlanSummary);
  }

  public updateTravelPlanSummary(newData?: DBTravelPlanSummary): Promise<DBTravelPlanSummary> {
    if (newData != null) {
      this._DBTravelPlanSummary = newData;
    }

    return this.travelPlanCtrler
      .updatePlanSummary(this.planID, updatedDiff(this.OriginalDBTravelPlanSummary, this.DBTravelPlanSummary))
      .then(() => this._OriginalDBTravelPlanSummary = cloneDeep(this.DBTravelPlanSummary));
  }

  public addReadableWritableUsers(readableUserID?: string | string[], writableUserID?: string | string[]) {
    return this.travelPlanCtrler.addTravelPlanRWableUser(this.planID, readableUserID, writableUserID);
  }

  public getTravelPlan() {
    return this.travelPlanCtrler.getTravelPlan(this.planID);
  }
}
