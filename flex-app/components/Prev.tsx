import React from "react";
import styles from "../styles/timeline.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Prev(props: any) {
  return (
    <div>
      <button id={styles.previous} onClick={props.click}>＜</button>

    </div>
  );
}

export default Prev;
