import { CSSProperties } from "react";

const MIN_W_ARR = ["22em", "25em"];
const HEIGHT = "85vh";
const HEAD_HEIGHT = "3em";
const TOP_Head = "3em";
const TOP = "9em";
const FLEX_ARR = [1, 4];
const WIDTH = "calc(100vw - 1em)";

export const headColimnProvider: CSSProperties = {
  position: "absolute",
  display: "flex",
  flexWrap: "wrap",
  top: TOP_Head
};
export const colimnProvider: CSSProperties = {
  position: "absolute",
  display: "flex",
  flexWrap: "wrap",
  top: TOP
};
export const leftHeadColumn: CSSProperties = {
  flex: FLEX_ARR[0],
  minWidth: MIN_W_ARR[0],
  height: HEAD_HEIGHT,
  width: WIDTH,
  position: "relative",
  top: 0,
  left: "1em",
};
export const rightHeadColumn: CSSProperties = {
  flex: FLEX_ARR[1],
  minWidth: MIN_W_ARR[1],
  height: HEAD_HEIGHT,
  width: WIDTH,
  position: "relative",
  top: 0,
};

export const leftColumn: CSSProperties = {
  flex: FLEX_ARR[0],
  height: HEIGHT,
  width: WIDTH,
  minWidth: MIN_W_ARR[0],
  padding: "1em",
  position: "relative",
  top: 0,
};
export const rightColumn: CSSProperties = {
  flex: FLEX_ARR[1],
  height: HEIGHT,
  width: WIDTH,
  minWidth: MIN_W_ARR[1],
  padding: "1em",
  position: "relative",
  top: 0,
};
