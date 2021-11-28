import React, { useRef, useEffect, useState, CSSProperties, } from "react";
import interact from "interactjs";
import { DBActionDataCtrler } from "../firebase/DBActionDataCtrler";
import { Dialog, DialogContent, Button } from "@material-ui/core";
import DailyActionModifier from "./dailyActionModifier";

type Partial<T> = {
  [ P in keyof T ]?: T[ P ]
};

const INITPOS_X = "3em";
const TOPPOS_Y = 16;
const BOTTOMPOS_Y = 120 * 24 + TOPPOS_Y;
const ONEHOUR_H = 120;
const ONEMINUTE_H = ONEHOUR_H / 60;
const getHHMM = (hh: number, mm: number) => {
  return String(`00${hh}`).slice(-2) + ":" + String(`00${mm}`).slice(-2);
};
const DRAGGABLE_VALUE = {
  inertia: false
};
const RESIZABLE_VALUE = {
  edges: { bottom: true, top: true },
  preserveAspectRatio: false,
  inertia: false
};

interface RectProps {
  height: number,
  width: number,
  x: number | string,
  y: number;
}

// 初期の要素の配置
const initPosition: RectProps = {
  width: 190,
  height: 120,
  x: INITPOS_X,
  y: 0
};


/**
   * HTML要素を動かせるようにする
   * 返り値で所得できるrefと、styleをそれぞれ対象となるHTML要素の
   * refとstyleに指定することで、そのHTML要素のリサイズと移動が可能になる
   * @param position HTML要素の初期座標と大きさ、指定されない場合はinitPositionで指定された値になる
   */
export function useInteractJS(position: Partial<RectProps> = initPosition, updateCache = false) {
  let currentPos: RectProps = { ...initPosition, ...position };

  const [_position, setPosition] = useState<RectProps>(currentPos);
  const [dY, setDY] = useState(0);
  const [dH, setDH] = useState(0);
  const [isEnabled, setEnable] = useState(true);
  const interactRef = useRef<HTMLDivElement | null>(null);

  if (updateCache) {
    setPosition(currentPos);
  } else {
    currentPos = { ..._position };
  }

  useEffect(() => {
    const y = currentPos.y;

    currentPos.height += dH;
    const h = currentPos.height;
    setDH(0);

    currentPos.y = (y < TOPPOS_Y ?
      TOPPOS_Y :
      (y + h) > BOTTOMPOS_Y ?
        (BOTTOMPOS_Y - h) : y) + dY;
    setDY(0);

    setPosition(currentPos);
  }, [dY, dH]);

  const dragMoveAction: Interact.ListenersArg = (event) => setDY(event.dy);

  const resizeMoveAction: Interact.ListenersArg = (event) => {
    setDY(event.deltaRect.top);
    setDH(event.deltaRect.top + event.deltaRect.bottom);
  };

  const enable = () => {
    if (interactRef == null || interactRef.current == null) {
      return;
    }

    interact((interactRef.current as unknown) as HTMLElement)
      .draggable(DRAGGABLE_VALUE)
      .resizable(RESIZABLE_VALUE)
      .on("dragmove", dragMoveAction)
      .on("resizemove", resizeMoveAction);
  };

  const disable = () => {
    if (interactRef == null || interactRef.current == null) {
      return;
    }
    interact( ( interactRef.current as unknown ) as HTMLElement ).unset();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => isEnabled ? enable() : disable(), [isEnabled]);

  useEffect(() => disable, []);

  return {
    ref: interactRef,
    style: {
      transform: `translate3D(${currentPos.x}, ${currentPos.y}px, 0)`,
      width: `calc(100% - ${currentPos.x})`,
      height: currentPos.height + "px",
      position: "absolute" as CSSProperties["position"],
      padding: "0.5em"
    },
    position: currentPos,
    isEnabled,
    enable: () => setEnable( true ),
    disable: () => setEnable( false )
  };
}

const PLACE = (props: { ctrler: DBActionDataCtrler; isStartWithDialogOpen?: boolean; }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(props.isStartWithDialogOpen ?? false);

  // Dialogで更新が行われた場合用
  const [isEditDialogAttemptingToTerminate, setIsEditDialogAttemptingToTerminate] = useState(false);

  // スケジュールの初期値開始時間からy座標を求める
  const tmp_y = props.ctrler.DBActionData.arriveDate;
  // const hhmm_y = tmp_y.split( ":" );
  const hh_y = tmp_y.getHours() * ONEHOUR_H;
  const mm_y = tmp_y.getMinutes() * ONEMINUTE_H;

  // スケジュールの初期値終了時間からheightを求める
  const tmp_height = props.ctrler.DBActionData.leaveDate;
  const tmp_height_isSameDate = tmp_height.toDateString() == tmp_y.toDateString();
  const hh_height_num = tmp_height_isSameDate ? tmp_height.getHours() : 24;
  const mm_height_num = tmp_height_isSameDate ? tmp_height.getMinutes() : 0;
  // const hhmm_height = tmp_height.split( ":" );
  const hh_height = hh_height_num * ONEHOUR_H;
  const mm_height = mm_height_num * ONEMINUTE_H;

  // 初期値
  const Position: RectProps = {
    width: initPosition.width,
    height: hh_height + mm_height - hh_y - mm_y,
    x: INITPOS_X,
    y: hh_y + mm_y + TOPPOS_Y
  };

  const interact = useInteractJS(Position, isEditDialogAttemptingToTerminate);

  // ドラッグアンドドロップ、リサイズで時刻表示かえる
  // y座標
  const run_hh_mm_y = Math.floor(interact.position.y - TOPPOS_Y);
  const run_hh_y = Math.floor(run_hh_mm_y / ONEHOUR_H);
  const run_mm_y = Math.floor((run_hh_mm_y % ONEHOUR_H) / ONEMINUTE_H);
  const run_hhmm_y = getHHMM(run_hh_y, run_mm_y);// 表示される開始時刻

  // height
  const run_hh_mm_height = Math.floor(interact.position.y + interact.position.height - TOPPOS_Y);
  const run_hh_height = Math.floor(run_hh_mm_height / ONEHOUR_H);
  const run_mm_height = Math.floor((run_hh_mm_height % ONEHOUR_H) / ONEMINUTE_H);
  const run_hhmm_height = getHHMM(run_hh_height, run_mm_height);// 表示される開始時刻

  props.ctrler.DBActionData.arriveDate.setHours(run_hh_y, run_mm_y);
  props.ctrler.DBActionData.leaveDate.setHours(run_hh_height, run_mm_height);

  if (isEditDialogAttemptingToTerminate) {
    setIsEditDialogAttemptingToTerminate(false);
  }

  return (
    <div>
      <div
        ref={interact.ref}
        style={{
          ...interact.style,
          border: "2px solid #0489B1",
          backgroundColor: "#A9D0F5",
          visibility: props.ctrler.isDeleted ? "collapse" : "visible"
        }}>
        <Button
          style={
            {
              position: "absolute",
              right: "0.5em",
              top: "0.5em"
            }
          }
          onClick={() => setIsEditDialogOpen(!isEditDialogOpen)}
          variant="outlined">
          編集
        </Button>

        {props.ctrler.DBActionData.placeName}
        <br />{run_hhmm_y}-{run_hhmm_height}
        {/* 以下のボタンはAutoでドラッグアンドドロップの有効化、blockで無効化 */}
        {/* <button onClick={() => interact.enable()}>Auto</button> */}
        {/* <button onClick={() => interact.disable()}>block</button> */}

      </div>

      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} fullWidth maxWidth={"sm"}>
        <DialogContent>
          <DailyActionModifier ctrler={props.ctrler} closeDialogAction={() => {
            setIsEditDialogAttemptingToTerminate(true);
            setIsEditDialogOpen(false);
          }}/>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default PLACE;
