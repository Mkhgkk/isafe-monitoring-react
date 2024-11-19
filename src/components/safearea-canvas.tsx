import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Image, Layer, Rect, Stage, Transformer } from "react-konva";

const URLImage = ({ src, width, height }) => {
  const imageRef = useRef(null);
  const [image, setImage] = useState(null);

  const loadImage = () => {
    const img = new window.Image();
    img.src = src;
    img.crossOrigin = "Anonymous";
    imageRef.current = img;
    imageRef.current.addEventListener("load", handleLoad);
  };

  const handleLoad = () => {
    setImage(imageRef.current);
  };

  useEffect(() => {
    loadImage();
    return () => {
      if (imageRef.current) {
        imageRef.current.removeEventListener("load", handleLoad);
      }
    };
  }, []);

  useEffect(() => {
    loadImage();
  }, [src]);

  return <Image image={image} width={width} height={height} />;
};

const DraggableAndTransformableBox = ({
  box,
  onTransformEnd,
  onSelect,
  isSelected,
}) => {
  const shapeRef = useRef();
  const transformerRef = useRef();

  useEffect(() => {
    if (isSelected) {
      // Attach transformer to the selected shape
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Rect
        ref={shapeRef}
        x={box.x}
        y={box.y}
        width={box.width}
        height={box.height}
        fill="rgba(0, 128, 255, 0.5)"
        draggable
        onClick={onSelect}
        onDragEnd={(e) => {
          onTransformEnd({
            ...box,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          // Handle resizing
          const node = shapeRef.current;
          const newWidth = Math.max(50, node.width() * node.scaleX());
          const newHeight = Math.max(50, node.height() * node.scaleY());

          // Reset the scale to 1 after resizing
          node.scaleX(1);
          node.scaleY(1);

          onTransformEnd({
            ...box,
            width: newWidth,
            height: newHeight,
            x: node.x(),
            y: node.y(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => newBox}
        />
      )}
    </>
  );
};

const SafeAreaCanvas = forwardRef(({ url }, ref) => {
  const containerRef = useRef(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [box, setBox] = useState({
    x: 50,
    y: 50,
    width: 100,
    height: 100,
    id: "box",
  });

  useEffect(() => {
    const updateStageSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setStageSize({ width, height });
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

  // Calculate scaling factor to maintain the image's aspect ratio
  const aspectRatio = 1280 / 720; // Adjust this ratio as needed for your image
  let width = stageSize.width;
  let height = stageSize.width / aspectRatio;

  // If the calculated height is greater than the container height, adjust the width
  if (height > stageSize.height) {
    height = stageSize.height;
    width = stageSize.height * aspectRatio;
  }

  // Function to update box position and size
  const updateBox = (updatedBox) => {
    setBox(updatedBox);
  };

  // Function to get the four corners of the box in actual pixel values
  const getAreaPosition = () => {
    const scaleX = 1280 / stageSize.width;
    const scaleY = 720 / stageSize.height;

    const actualX = box.x * scaleX;
    const actualY = box.y * scaleY;
    const actualWidth = box.width * scaleX;
    const actualHeight = box.height * scaleY;

    const topLeft = [actualX, actualY];
    const topRight = [actualX + actualWidth, actualY];
    const bottomLeft = [actualX, actualY + actualHeight];
    const bottomRight = [actualX + actualWidth, actualY + actualHeight];

    return {
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    };
  };

  // Expose the getAreaPosition function to the parent component
  useImperativeHandle(ref, () => ({
    getAreaPosition,
  }));

  return (
    <div className="w-[100%] h-[100%]">
      <div ref={containerRef} className="w-[100%] h-[100%]">
        <Stage width={stageSize.width} height={stageSize.height}>
          <Layer>
            <URLImage
              src={url}
              width={stageSize.width}
              height={stageSize.height}
            />
            {box && (
              <DraggableAndTransformableBox
                key={"box"}
                box={box}
                isSelected={true}
                onSelect={() => {}}
                onTransformEnd={updateBox}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
});

export default SafeAreaCanvas;
