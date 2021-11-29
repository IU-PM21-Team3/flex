import { CSSProperties } from "react";

const MIN_W_ARR = ["18em", "200px", "25em"];
const HEIGHT = "80vh";

export const colimnProvider: CSSProperties = {
  position: "absolute",
  display: "flex",
  flexWrap: "wrap",
  top: "0%"
};
export const leftColumn: CSSProperties = {
  flex: 1,
  height: HEIGHT,
  minWidth: MIN_W_ARR[0],
  padding: "1em",
  position: "relative",
};
export const rightColumn: CSSProperties = {
  flex: 5,
  height: HEIGHT,
  minWidth: MIN_W_ARR[2],
  padding: "1em",
  position: "relative",
};
