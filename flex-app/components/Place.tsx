import React, { useRef, useEffect, useState, CSSProperties, } from "react";
import interact from "interactjs";

type Partial<T> = {
  [ P in keyof T ]?: T[ P ]
};

// 初期の要素の配置
const initPosition = {
  width: 190,
  height: 120,
  x: -80,
  y: 0
};

/**
   * HTML要素を動かせるようにする
   * 返り値で所得できるrefと、styleをそれぞれ対象となるHTML要素の
   * refとstyleに指定することで、そのHTML要素のリサイズと移動が可能になる
   * @param position HTML要素の初期座標と大きさ、指定されない場合はinitPositionで指定された値になる
   */
export function useInteractJS( position: Partial<typeof initPosition> = initPosition ) {
  const [_position, setPosition] = useState( {
    ...initPosition,
    ...position
  } );

  const [isEnabled, setEnable] = useState( true );

  const interactRef = useRef<HTMLDivElement | null>(null);
  let { x, y, width, height } = _position;

  const enable = () => {
    if (interactRef == null || interactRef.current == null) {
      return;
    }

    interact((interactRef.current as unknown) as HTMLElement)
      .draggable( {
        inertia: false
      } )
      .resizable( {
        // resize from all edges and corners
        edges: { bottom: true, top: true },
        preserveAspectRatio: false,
        inertia: false
      } )
      .on( "dragmove", ( event ) => {
        //  x += event.dx

        if ( y < -10 ) {
          y = -10;
        } else if ( y + height > 2400 ) {
          y = 2400 - height;
        }

        y += event.dy;
        setPosition( {
          width,
          height,
          x,
          y
        } );
      } )
      .on( "resizemove", ( event ) => {
        width = event.rect.width;
        height = event.rect.height;
        x += event.deltaRect.left;
        y += event.deltaRect.top;
        setPosition( {
          x,
          y,
          width,
          height
        } );
      } );
  };

  const disable = () => {
    if (interactRef == null || interactRef.current == null) {
      return;
    }
    interact( ( interactRef.current as unknown ) as HTMLElement ).unset();
  };

  useEffect( () => {
    if ( isEnabled ) {
      enable();
    } else {
      disable();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled] );

  useEffect( () => {
    return disable;
  }, [] );

  return {
    ref: interactRef,
    style: {
      transform: `translate3D(${_position.x}px, ${_position.y}px, 0)`,
      width: _position.width + "px",
      height: _position.height + "px",
      position: "absolute" as CSSProperties[ "position" ]
    },
    position: _position,
    isEnabled,
    enable: () => setEnable( true ),
    disable: () => setEnable( false )
  };
}

const PLACE = ( props: { id: number; index: number; name: string; starttime: string; endtime: string; } ) => {
  // スケジュールの初期値開始時間からy座標を求める
  const tmp_y = props.starttime;
  const hhmm_y = tmp_y.split( ":" );
  const hh_y = ( parseInt( hhmm_y[0] ) - 4 ) * 120;
  const mm_y = parseInt( hhmm_y[1] ) * 2;

  // スケジュールの初期値終了時間からheightを求める
  const tmp_height = props.endtime;
  const hhmm_height = tmp_height.split( ":" );
  const hh_height = ( parseInt( hhmm_height[0] ) - 4 ) * 120;
  const mm_height = parseInt( hhmm_height[1] ) * 2;

  // 初期値
  const Position = {
    width: 190,
    height: hh_height + mm_height - hh_y - mm_y,
    x: -80,
    y: hh_y + mm_y
  };

  const interact = useInteractJS( Position );

  // ドラッグアンドドロップ、リサイズで時刻表示かえる
  // y座標
  const run_hh_mm_y = Math.floor( interact.position.y );
  const run_hh_y = Math.floor( run_hh_mm_y / 120 + 4 );
  const run_mm_y = Math.floor( ( run_hh_mm_y % 120 ) / 2 );
  const run_hhmm_y = String( "00" + run_hh_y ).slice( -2 ) + ":" + String( "00" + run_mm_y ).slice( -2 );// 表示される開始時刻

  // height
  const run_hh_mm_height = Math.floor( interact.position.y + interact.position.height );
  const run_hh_height = Math.floor( run_hh_mm_height / 120 + 4 );
  const run_mm_height = Math.floor( ( run_hh_mm_height % 120 ) / 2 );
  const run_hhmm_height = String( "00" + run_hh_height ).slice( -2 ) + ":" + String( "00" + run_mm_height ).slice( -2 );// 表示される開始時刻

  return (
    <body>
      <div
        ref={interact.ref}
        style={{
          ...interact.style,
          border: "2px solid #0489B1",
          backgroundColor: "#A9D0F5"
        }}>
        {props.name}
        <br />{run_hhmm_y}-{run_hhmm_height}
        {/* 以下のボタンはAutoでドラッグアンドドロップの有効化、blockで無効化 */}
        {/* <button onClick={() => interact.enable()}>Auto</button> */}
        {/* <button onClick={() => interact.disable()}>block</button> */}
      </div>
    </body>
  );
};
export default PLACE;
