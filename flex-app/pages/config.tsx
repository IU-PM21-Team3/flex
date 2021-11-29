import * as styles from "../styles/timelinepage.style";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import TimeLine from "../components/timeLine";
import Schedule from "../components/Schedule";
import { TravelPlanController } from "../firebase/TravelPlanController";
import { UserController } from "../firebase/UsersController";
import app from "../firebase/clientApp";
import PlaceMap from "../components/PlaceMap";
import { DBTravelPlanSummary, EMPTY_DBTravelPlanSummary } from "../firebase/DBTypes";
import { useRouter } from "next/router";


const Config: NextPage = () => {
  const [travelCtrler] = useState(new TravelPlanController(new UserController(app.store)));
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
      }
    });
  }, [planid]);

  return (
    <div>
      <h1>旅程表示/編集ページ</h1>
      <div style={{ position: "relative" }}>
        <div style={styles.colimnProvider}>
          <div style={styles.leftColumn}>
            <Schedule planName={travelPlanProps.planName} beginDate={travelPlanProps.beginDate} endDate={travelPlanProps.endDate} />
            <TimeLine travelPlanCtrler={travelCtrler} planSummary={travelPlanProps} />
          </div>
          <div style={styles.rightColumn}>
            <PlaceMap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Config;
