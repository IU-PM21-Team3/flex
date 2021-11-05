import React from "react";
import styles from "../styles/timeline.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Next(props: any) {
  return (
    <div>
      <button id={styles.next} onClick={props.click}>＞</button>

    </div>
  );
}

export default Next;
