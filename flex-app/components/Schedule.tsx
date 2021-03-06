import React from "react";
import styles from "../styles/timeline.module.css";
import { formatDate } from "../utils/utils";

const Schedule = (props: {planName :string, beginDate :Date, endDate :Date}) => {
  return (
    <div className={styles.theme}>
      {props.planName}
      <br />
      {formatDate( props.beginDate, "yyyy-MM-dd" )}
      &emsp;
      {formatDate( props.endDate, "yyyy-MM-dd" )}
    </div>
  );
};

export default Schedule;
