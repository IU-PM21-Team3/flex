import type { NextPage } from "next";
import TimeLine from "../components/timeLine";
import Schedule from "../components/Schedule";
import PrivatePage from "../components/PrivatePage";

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
const travelPlanProps: travelPlanProps = {
  planName: "福島-茨城旅行",
  // Dateの「月」指定は 0 ~ 11 である点に注意
  beginDate: new Date( 2021, 11, 30 ),
  endDate: new Date( 2022, 0, 1 )
};


const Time: NextPage = () => {
  return (
    <PrivatePage>
      <Schedule planName={travelPlanProps.planName} beginDate={travelPlanProps.beginDate} endDate={travelPlanProps.endDate} />
      <TimeLine beginDate={travelPlanProps.beginDate} endDate={travelPlanProps.endDate} />
    </PrivatePage>
  );
};
export default Time;
