import * as styles from "../styles/timelinepage.style";
import type { NextPage } from "next";
import TimeLine from "../components/timeLine";
import Schedule from "../components/Schedule";
import PrivatePage from "../components/PrivatePage";
import { DBTravelPlanSummary } from "../firebase/DBTypes";
import { useState } from "react";
import { TravelPlanController } from "../firebase/TravelPlanController";
import { UserController } from "../firebase/UsersController";
// import { doc } from "firebase/firestore";
import app from "../firebase/clientApp";
import PlaceMap from "../components/PlaceMap";


export const travelPlanSampleID = "testData";

// 初期値
export const travelPlanProps: DBTravelPlanSummary = {
  planName: "福島-茨城旅行",
  // Dateの「月」指定は 0 ~ 11 である点に注意
  beginDate: new Date( 2021, 11, 30 ),
  endDate: new Date(2021, 12, 1),
  lastUpdate: new Date(),
  description: "テスト用データ",
};


const Time: NextPage = () => {
  const [travelCtrler] = useState(new TravelPlanController(new UserController(app.store)));

  return (
    <PrivatePage>
      <div style={styles.colimnProvider}>
        <div style={styles.leftColumn}>
          <Schedule planName={travelPlanProps.planName} beginDate={travelPlanProps.beginDate} endDate={travelPlanProps.endDate} />
          <TimeLine travelPlanCtrler={travelCtrler} />
        </div>
        <div style={styles.rightColumn}>
          <PlaceMap />
        </div>
      </div>
    </PrivatePage>
  );
};
export default Time;
