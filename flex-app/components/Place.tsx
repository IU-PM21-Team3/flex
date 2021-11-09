import { useRef, useEffect, useState, CSSProperties, } from "react";
import interact from "interactjs";
//import { Visibility } from "@material-ui/icons";

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
  const [ _position, setPosition ] = useState( {
    ...initPosition,
    ...position
  } );

  const [ isEnabled, setEnable ] = useState( true );

  const interactRef = useRef( null );
  let { x, y, width, height } = _position;

  const enable = () => {
    interact( ( interactRef.current as unknown ) as HTMLElement )
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
    interact( ( interactRef.current as unknown ) as HTMLElement ).unset();
  };

  useEffect( () => {
    if ( isEnabled ) {
      enable();
    } else {
      disable();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isEnabled ] );

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




const PLACE = ( props: { id: number; index: number; name: string; y: number; height: number; } ) => {
  const Position = {
    width: 190,
    height: props.height,
    x: -80,
    y: props.y
  };
  const interact = useInteractJS( Position );

  return (
    <body>
      <div
        ref={interact.ref}
        style={{
          ...interact.style,
          // height: Places[props.index].height,
          // top: Places[props.index].y,
          border: "2px solid #0489B1",
          backgroundColor: "#A9D0F5"
        }}>
        {props.name}
        {/* 以下のボタンはAutoでドラッグアンドドロップの有効化、blockで無効化 */}
        {/* <button onClick={() => interact.enable()}>Auto</button> */}
        {/* <button onClick={() => interact.disable()}>block</button> */}
      </div>

    </body>
  );
};

export default PLACE;
