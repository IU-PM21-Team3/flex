import type { NextPage } from "next";
import TimeLine from "../components/timeLine";
import Schedule from "../components/Schedule";
import PrivatePage from "../components/PrivatePage";
import { DBTravelPlanSummary } from "../firebase/DBTypes";
import { doc } from "firebase/firestore";
import app from "../firebase/clientApp";

// 旅程のテーマと日付の設定
type travelPlanProps = {
  planName: string,
  // description: string,
  beginDate: Date,
  endDate: Date,
  // lastUpdate: Date
  // planDoc: Reference
};

// 初期値
// +1ヶ月分で表示されてしまう
const travelPlanProps: DBTravelPlanSummary = {
  planName: "福島-茨城旅行",
  description: "試験用のデータ",
  beginDate: new Date( 2021, 11, 30 ), // +1ヶ月分で表示されてしまう
  endDate: new Date(2021, 12, 1),
  lastUpdate: new Date(),
  planDoc: doc(app.store, "/travelPlans/testData")
};


const Time: NextPage = () => {
  return (
    <PrivatePage>
      <Schedule planName={travelPlanProps.planName} beginDate={travelPlanProps.beginDate} endDate={travelPlanProps.endDate} />
      <TimeLine summary={travelPlanProps} />
    </PrivatePage>
  );
};
export default Time;
