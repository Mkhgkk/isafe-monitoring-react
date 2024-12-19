import { forwardRef, useImperativeHandle, useState } from "react";
import { Circle, Line, Rect } from "react-konva";

export type Point = {
  x: number;
  y: number;
};

type AnchorProps = {
  point: Point;
  fill: string;
  onClick: () => void;
  onMouseOver: () => void;
  onMouseOut: () => void;
};

type PolygonOriginAnchorProps = {
  point: Point;
  onValidClick: () => void;
  onValidMouseOver: () => void;
  validateMouseEvents: () => boolean;
};

type PolygonConstructorProps = {
  closeTargetRadius?: number;
  onComplete: (points: Point[]) => void;
  onChange: (points: Point[]) => void;
  width: number;
  height: number;
};

function Anchor(props: AnchorProps) {
  const [strokeWidth, setStrokeWidth] = useState(2);

  return (
    <Circle
      x={props.point.x}
      y={props.point.y}
      radius={10}
      stroke="white"
      opacity={0.7}
      fill={props.fill}
      strokeWidth={strokeWidth}
      onMouseOver={() => {
        document.body.style.cursor = "pointer";
        setStrokeWidth(3);
        props.onMouseOver();
      }}
      onMouseOut={() => {
        document.body.style.cursor = "default";
        setStrokeWidth(2);
        props.onMouseOut();
      }}
      onClick={() => {
        document.body.style.cursor = "default";
        props.onClick();
      }}
    />
  );
}

function PolygonOriginAnchor(props: PolygonOriginAnchorProps) {
  const isValid = props.validateMouseEvents();
  const [fill, setFill] = useState("transparent");

  return (
    <Anchor
      point={props.point}
      fill={fill}
      onClick={() => {
        if (isValid) {
          props.onValidClick();
        }
      }}
      onMouseOver={() => {
        if (isValid) {
          document.body.style.cursor = "pointer";
          setFill("green");
          props.onValidMouseOver();
        } else {
          document.body.style.cursor = "not-allowed";
          setFill("red");
        }
      }}
      onMouseOut={() => {
        setFill("transparent");
      }}
    />
  );
}

const PolygonConstructor = forwardRef((props: PolygonConstructorProps, ref) => {
  const [points, setPoints] = useState<Point[]>([]);
  const [nextPoint, setNextPoint] = useState({ x: 0, y: 0 });
  const [isComplete, setIsComplete] = useState(false);

  const reset = () => {
    setPoints([]);
    setNextPoint({ x: 0, y: 0 });
    setIsComplete(false);
    props.onChange([]);
  };

  const handleClick = ({ x, y }: Point) => {
    const newPoints = points.concat({ x, y });
    setPoints(newPoints);
    props.onChange(newPoints);
  };

  useImperativeHandle(ref, () => ({
    reset,
  }));

  return (
    <>
      <Line
        strokeWidth={3}
        stroke="white"
        opacity={0.7}
        lineJoin="round"
        closed={isComplete}
        points={points
          .flatMap((point) => [point.x, point.y])
          .concat([nextPoint.x, nextPoint.y])}
      />

      <Rect
        x={0}
        y={0}
        width={props.width}
        height={props.height}
        onClick={(event) => {
          if (!isComplete) {
            const x = event.evt.offsetX;
            const y = event.evt.offsetY;
            handleClick({ x, y });
          }
        }}
        onMouseMove={(event) => {
          if (!isComplete) {
            const x = event.evt.offsetX;
            const y = event.evt.offsetY;
            setNextPoint({ x, y });
          }
        }}
      />

      {points[0] && !isComplete && (
        <PolygonOriginAnchor
          point={points[0]}
          onValidClick={() => {
            props.onComplete(points);
            setNextPoint(points[0]);
            setIsComplete(true);
          }}
          onValidMouseOver={() => {
            setNextPoint(points[0]);
          }}
          validateMouseEvents={() => {
            return points.length > 2;
          }}
        />
      )}
    </>
  );
});

export default PolygonConstructor;
