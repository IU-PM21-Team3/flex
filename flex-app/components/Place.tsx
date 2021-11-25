import React, { useRef, useEffect, useState, CSSProperties, } from "react";
import interact from "interactjs";
import { DBActionData } from "../firebase/DBTypes";

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

// 初期の要素の配置
const initPosition = {
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
export function useInteractJS( position: Partial<typeof initPosition> = initPosition ) {
  const [_position, setPosition] = useState({ ...initPosition, ...position });
  const [isEnabled, setEnable] = useState(true);
  const interactRef = useRef<HTMLDivElement | null>(null);

  let { x, y, width, height } = _position;

  const enable = () => {
    if (interactRef == null || interactRef.current == null) {
      return;
    }

    interact((interactRef.current as unknown) as HTMLElement)
      .draggable(DRAGGABLE_VALUE)
      .resizable(RESIZABLE_VALUE)
      .on( "dragmove", ( event ) => {
        y = (y < TOPPOS_Y ?
          TOPPOS_Y :
          (y + height) > BOTTOMPOS_Y ?
            (BOTTOMPOS_Y - height) : y) + event.dy;

        setPosition({ x, y, width, height });
      } )
      .on( "resizemove", ( event ) => {
        width = event.rect.width;
        height = event.rect.height;
        // x += event.deltaRect.left;
        y += event.deltaRect.top;
        setPosition({ x, y, width, height });
      } );
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
      transform: `translate3D(${_position.x}, ${_position.y}px, 0)`,
      width: `calc(100% - ${_position.x})`,
      height: _position.height + "px",
      position: "absolute" as CSSProperties["position"],
      padding: "0.5em"
    },
    position: _position,
    isEnabled,
    enable: () => setEnable( true ),
    disable: () => setEnable( false )
  };
}

const PLACE = ( props: {key: string, actionData : DBActionData } ) => {
  // スケジュールの初期値開始時間からy座標を求める
  const tmp_y = props.actionData.arriveDate;
  // const hhmm_y = tmp_y.split( ":" );
  const hh_y = tmp_y.getHours() * ONEHOUR_H;
  const mm_y = tmp_y.getMinutes() * ONEMINUTE_H;

  // スケジュールの初期値終了時間からheightを求める
  const tmp_height = props.actionData.leaveDate;
  const tmp_height_isSameDate = tmp_height.toDateString() == tmp_y.toDateString();
  const hh_height_num = tmp_height_isSameDate ? tmp_height.getHours() : 24;
  const mm_height_num = tmp_height_isSameDate ? tmp_height.getMinutes() : 0;
  // const hhmm_height = tmp_height.split( ":" );
  const hh_height = hh_height_num * ONEHOUR_H;
  const mm_height = mm_height_num * ONEMINUTE_H;

  // 初期値
  const Position = {
    width: initPosition.width,
    height: hh_height + mm_height - hh_y - mm_y,
    x: INITPOS_X,
    y: hh_y + mm_y + TOPPOS_Y
  };

  const interact = useInteractJS( Position );

  // ドラッグアンドドロップ、リサイズで時刻表示かえる
  // y座標
  const run_hh_mm_y = Math.floor( interact.position.y - TOPPOS_Y );
  const run_hh_y = Math.floor( run_hh_mm_y / ONEHOUR_H );
  const run_mm_y = Math.floor( ( run_hh_mm_y % ONEHOUR_H ) / ONEMINUTE_H );
  const run_hhmm_y = getHHMM(run_hh_y, run_mm_y);// 表示される開始時刻

  // height
  const run_hh_mm_height = Math.floor( interact.position.y + interact.position.height - TOPPOS_Y );
  const run_hh_height = Math.floor( run_hh_mm_height / ONEHOUR_H );
  const run_mm_height = Math.floor( ( run_hh_mm_height % ONEHOUR_H ) / ONEMINUTE_H );
  const run_hhmm_height = getHHMM(run_hh_height, run_mm_height);// 表示される開始時刻

  props.actionData.arriveDate.setHours(run_hh_y, run_mm_y);
  props.actionData.leaveDate.setHours(run_hh_height, run_mm_height);

  return (
    <div
      ref={interact.ref}
      style={{
        ...interact.style,
        border: "2px solid #0489B1",
        backgroundColor: "#A9D0F5"
      }}>
      {props.actionData.placeName}
      <br />{run_hhmm_y}-{run_hhmm_height}
      {/* 以下のボタンはAutoでドラッグアンドドロップの有効化、blockで無効化 */}
      {/* <button onClick={() => interact.enable()}>Auto</button> */}
      {/* <button onClick={() => interact.disable()}>block</button> */}
    </div>
  );
};
export default PLACE;
