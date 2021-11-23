import React, { useState } from "react";
import MaterialTable from "material-table";
import { Button, LinearProgress } from "@material-ui/core";
import { IOdptTrainInformation } from "../functions/GetTrafficInfo.type";
import { getTrafficInfo } from "../functions/GetTrafficInfo.client";
import moment from "moment";

function getDateString(v?: Date): string {
  return v == null ? "" : moment(v).format("llll");
}

const TrafficInfoList = () => {
  const [trafficInfoArr, setTrafficInfoArr] = useState<IOdptTrainInformation<Date>[]>([]);
  const [isLoading, setIsLoading] = useState<VisibilityState>("hidden");

  // 再描画がかかると実行される
  function RefleshTable() {
    // 初回実行時は表示を行わないようにするため (不要な再描画防止)
    if (trafficInfoArr.length > 0) {
      setIsLoading("visible");
    }

    // 運行情報データ取得
    getTrafficInfo().then((arr) => {
      if (arr == null) {
        alert("データの取得に失敗しました");
        return;
      }

      // (結局arrの中を変更しているけど, わかりやすいように変数を新たに割り当てる)
      const newArr = arr.map((v) => {
        v["odpt:operator"] = v["odpt:operator"].replace("odpt.Operator:", "");
        v["odpt:railway"] = v["odpt:railway"]?.replace("odpt.Railway:", "").replace(v["odpt:operator"] + ".", "");
        return v;
      }).sort((a, b) => (a["odpt:operator"] + a["odpt:railway"])?.localeCompare(b["odpt:operator"] + b["odpt:railway"]));

      setTrafficInfoArr(newArr);
    }).finally(() => setIsLoading("hidden"));
  }

  if (trafficInfoArr.length <= 0) {
    RefleshTable();
  }

  // Table Icon ref : https://material-table.com/#/docs/install
  return (
    <div style={{ width: "90%", margin: "auto" }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />

      <Button onClick={() => RefleshTable()} variant="contained" style={{ padding: "0.5em 1em", margin: "1em" }}>
        Reflesh Table
      </Button>

      <LinearProgress style={{ visibility: isLoading }} />

      <MaterialTable
        title="交通情報"
        columns={[
          { title: "運行会社ID", field: "odpt:operator", },
          { title: "路線名ID", field: "odpt:railway" },
          { title: "上り/下り", field: "odpt:railDirection" },
          { title: "概要", field: "odpt:trainInformationStatus.ja" },
          { title: "運行情報", field: "odpt:trainInformationText.ja" },
          { title: "発生時刻", field: "odpt:timeOfOrigin", render: (v) => getDateString(v["odpt:timeOfOrigin"]) },
          { title: "発生地点(始)", field: "odpt:stationFrom" },
          { title: "発生地点(終)", field: "odpt:stationTo" },
          { title: "発生区間", field: "odpt:trainInformationRange.ja" },
          { title: "発生理由", field: "odpt:trainInformationCause.ja" },
          { title: "振替路線", field: "odpt:transferRailways" },
          { title: "復旧見込み", field: "odpt:resumeEstimate", render: (v) => getDateString(v["odpt:resumeEstimate"]) },
          { title: "データ生成日時", field: "dc:date", render: (v) => getDateString(v["dc:date"]) },
          { title: "データ保証期限", field: "dct:valid", render: (v) => getDateString(v["dct:valid"]) },
          { title: "データ固有識別子", field: "@id" },
        ]}
        data={trafficInfoArr}
        options={{
          showTitle: true,
          headerStyle: { whiteSpace: "nowrap" },
          rowStyle: { whiteSpace: "nowrap" },
        }}
      />
    </div >
  );
};

export default TrafficInfoList;
