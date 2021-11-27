import { CSSProperties } from "react";

const MIN_W_ARR = ["18em", "200px", "25em"];
const HEIGHT = "95vh";

export const colimnProvider: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  padding: "1em",
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
