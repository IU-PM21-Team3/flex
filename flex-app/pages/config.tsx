import * as styles from "../styles/timelinepage.style";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogContent } from "@material-ui/core";
import TimeLine from "../components/timeLine";
import Schedule from "../components/Schedule";
import { TravelPlanController } from "../firebase/TravelPlanController";
import { UserController } from "../firebase/UsersController";
import app from "../firebase/clientApp";
import PlaceMap from "../components/PlaceMap";
import { DBTravelPlanSummary, EMPTY_DBTravelPlanSummary } from "../firebase/DBTypes";
import { useRouter } from "next/router";
import TravelPlanSummaryModifier from "../components/travelPlanSummaryModifier";
import { DBTravelPlanDataCtrler } from "../firebase/DBTravelPlanDataCtrler";
import UserIDTable from "../components/UserIDTable";


const Config: NextPage = () => {
  const [isSummaryEditDialogOpen, setIsSummaryEditDialogOpen] = useState(false);
  const [isAccessableUsersDialogOpen, setIsAccessableUsersDialogOpen] = useState(false);
  const [travelCtrler] = useState(new TravelPlanController(new UserController(app.store)));
  const [TravelPlanSummaryModifierElem, setTravelPlanSummaryModifier] = useState<JSX.Element>();
  const [AccessableUsersTable, setAccessableUsersTable] = useState<JSX.Element>();
  const [travelPlanProps, setTravelPlanProps] = useState<DBTravelPlanSummary>(EMPTY_DBTravelPlanSummary);
  const router = useRouter();
  const { planid } = router.query;

  useEffect(() => {
    if (planid == undefined) {
      return;
    }


    // クエリ入力が配列であればその最初の要素を採用し, そうでなければ(undefinedでない限り)入力値を使用する
    const planID = Array.isArray(planid) ? planid[0] : planid == null || planid.length <= 0 ? "" : planid;

    travelCtrler.getPlanSummary(planID).then((v) => {
      const newSummary = v.data();
      if (newSummary != undefined) {
        setTravelPlanProps(newSummary);

        const travelPlanDataCtrler = new DBTravelPlanDataCtrler(travelCtrler, planID, newSummary);

        setAccessableUsersTable(
          <UserIDTable
            ctrler={travelPlanDataCtrler}
            closeDialogAction={setIsSummaryEditDialogOpen}
          />
        );
        setTravelPlanSummaryModifier(
          <TravelPlanSummaryModifier
            ctrler={travelPlanDataCtrler}
            closeDialogAction={setIsSummaryEditDialogOpen}
          />
        );
      }
    });
  }, [planid]);

  return (
    <div style={{ position: "relative", width: "100vw" }}>
      <div style={styles.colimnProvider}>
        <div style={{ position: "absolute" }}>
          <h1>旅程表示/編集ページ</h1>
        </div>

        <div style={{ position: "absolute", right: "1em", top: "1em" }}>
          <Button
            style={{ margin: "0.5em" }}
            variant="contained"
            onClick={() => setIsAccessableUsersDialogOpen(true)}>
            アクセス権を編集
          </Button>

          <Button
            style={{ margin: "0.5em" }}
            variant="contained"
            onClick={() => setIsSummaryEditDialogOpen(true)}>
            プランの概要を表示/編集
          </Button>

        </div>

        <div style={styles.leftColumn}>
          <Schedule planName={travelPlanProps.planName} beginDate={travelPlanProps.beginDate} endDate={travelPlanProps.endDate} />
          <TimeLine travelPlanCtrler={travelCtrler} planSummary={travelPlanProps} />
        </div>

        <div style={styles.rightColumn}>
          <PlaceMap />
        </div>

        <Dialog open={isAccessableUsersDialogOpen} onClose={() => setIsAccessableUsersDialogOpen(false)} fullWidth maxWidth={"sm"}>
          <DialogContent>
            {AccessableUsersTable}
          </DialogContent>
        </Dialog>

        <Dialog open={isSummaryEditDialogOpen} onClose={() => setIsSummaryEditDialogOpen(false)} fullWidth maxWidth={"sm"}>
          <DialogContent>
            {TravelPlanSummaryModifierElem}
          </DialogContent>
        </Dialog>
      </div>

    </div>
  );
};

export default Config;
