import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Layer, Stage } from "react-konva";
import { Button } from "./ui/button";
import URLImage from "./canvas/url-image";
import PolygonConstructor, { Point } from "./canvas/polygon-constructor";

const SafeAreaCanvas = forwardRef(({ url }: { url?: string }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [points, setPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const constructorRef = useRef(null);

  useEffect(() => {
    const updateStageSize = () => {
      if (containerRef.current) {
        const size = containerRef.current.getBoundingClientRect();
        //width, height of size not changing with resize
        const aspectRatio = 1280 / 720; // Adjust this ratio as needed for your image
        let width = size.width;
        let height = size.width / aspectRatio;

        // If the calculated height is greater than the container height, adjust the width
        if (height > size.height) {
          height = size.height;
          width = size.height * aspectRatio;
        }
        setStageSize({ width: size.width, height: size.height });
        setImageSize({ width, height });
      }
    };

    // Initial size update
    updateStageSize();

    // Update size on window resize
    window.addEventListener("resize", updateStageSize);

    return () => {
      window.removeEventListener("resize", updateStageSize);
    };
  }, []);

  // Function to get the four corners of the box in actual pixel values
  const getAreaPosition = () => {
    const scaleX = 1280 / imageSize.width;
    const scaleY = 720 / imageSize.height;

    return points.map((point) => [point.x * scaleX, point.y * scaleY]);
  };

  const restartDrawing = () => {
    constructorRef.current?.reset();
    setPoints([]);
  };

  // Expose the getAreaPosition function to the parent component
  useImperativeHandle(ref, () => ({
    getAreaPosition,
  }));

  return (
    <div
      ref={containerRef}
      className="w-[100%] h-[100%] overflow-hidden relative"
    >
      <Stage width={stageSize.width} height={stageSize.height}>
        <Layer>
          <URLImage
            src={url}
            width={imageSize.width}
            height={imageSize.height}
          />

          <PolygonConstructor
            width={imageSize.width}
            height={imageSize.height}
            ref={constructorRef}
            onComplete={(points) => {
              setPoints(points);
            }}
            onChange={(points) => {
              setIsDrawing(points.length > 0);
            }}
          />
        </Layer>
      </Stage>
      {isDrawing && (
        <Button onClick={restartDrawing} className="absolute top-4 left-4">
          Reset
        </Button>
      )}
    </div>
  );
});

export default SafeAreaCanvas;
