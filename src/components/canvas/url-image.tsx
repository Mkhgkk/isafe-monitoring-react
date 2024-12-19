import { useEffect, useRef, useState } from "react";
import { Image } from "react-konva";

const URLImage = ({
  src,
  width,
  height,
}: {
  src?: string;
  width: number;
  height: number;
}) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const loadImage = () => {
    if (!src) return;
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

  if (!image) return null;
  return <Image image={image} width={width} height={height} />;
};

export default URLImage;
