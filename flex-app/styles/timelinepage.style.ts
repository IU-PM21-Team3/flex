import { CSSProperties } from "react";

const MIN_W_ARR = ["22em", "25em"];
const HEIGHT = "85vh";
const HEAD_HEIGHT = "3em";
const TOP_Head = "0";
const TOP = "6em";
const FLEX_ARR = [1, 4];

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
  width: "100vw",
  position: "relative",
  top: 0,
  left: "1em",
};
export const rightHeadColumn: CSSProperties = {
  flex: FLEX_ARR[1],
  minWidth: MIN_W_ARR[1],
  height: HEAD_HEIGHT,
  width: "100vw",
  position: "relative",
  top: 0,
};

export const leftColumn: CSSProperties = {
  flex: FLEX_ARR[0],
  height: HEIGHT,
  minWidth: MIN_W_ARR[0],
  width: "100vw",
  padding: "1em",
  position: "relative",
  top: 0,
};
export const rightColumn: CSSProperties = {
  flex: FLEX_ARR[1],
  height: HEIGHT,
  minWidth: MIN_W_ARR[1],
  width: "100vw",
  padding: "1em",
  position: "relative",
  top: 0,
};
