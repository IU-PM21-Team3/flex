import { CSSProperties } from "react";

const MIN_W_ARR = ["200px", "200px", "200px"];
const HEIGHT = "90vh";

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
export const centerColumn: CSSProperties = {
  flex: 1,
  height: HEIGHT,
  minWidth: MIN_W_ARR[1],
  padding: "1em",
  position: "relative",
};
export const rightColumn: CSSProperties = {
  flex: 4,
  height: HEIGHT,
  minWidth: MIN_W_ARR[2],
  padding: "1em",
  position: "relative",
};
