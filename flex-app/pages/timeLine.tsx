import type { NextPage } from "next";
import TimeLine from "../components/timeLine";
import Schedule from "../components/Schedule";
import PrivatePage from "../components/PrivatePage";
import { DBTravelPlanSummary } from "../firebase/DBTypes";
import { doc } from "firebase/firestore";
import app from "../firebase/clientApp";

export const travelPlanSampleID = "testData";

// 初期値
export const travelPlanProps: DBTravelPlanSummary = {
  planName: "福島-茨城旅行",
  // Dateの「月」指定は 0 ~ 11 である点に注意
  beginDate: new Date( 2021, 11, 30 ),
  endDate: new Date(2021, 12, 1),
  lastUpdate: new Date(),
  description: "テスト用データ",
  planDoc: doc(app.store, "/travelPlans/" + travelPlanSampleID)
};


const Time: NextPage = () => {
  return (
    <PrivatePage>
      <Schedule planName={travelPlanProps.planName} beginDate={travelPlanProps.beginDate} endDate={travelPlanProps.endDate} />
      <TimeLine />
    </PrivatePage>
  );
};
export default Time;
