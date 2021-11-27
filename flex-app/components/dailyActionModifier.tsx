import React from "react";
import { DBActionDataCtrler } from "../firebase/DBActionDataCtrler";

const dailyActionModifier = (props : { ctrler : DBActionDataCtrler }) => {
  return (
    <div>
      {props.ctrler.DBActionDataID}
    </div>
  );
};

export default dailyActionModifier;
