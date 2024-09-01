import React, { useState } from "react";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import { Slider } from "./ui/slider";

function PTZControl() {
  const gridClass = "h-10 w-10 flex justify-center items-center";
  const buttonClass = cn(gridClass, "cursor-pointer");

  const [activeButton, setActiveButton] = useState("");

  const onMouseDown = (btn) => {
    setActiveButton(btn);
  };

  const onMouseUp = (btn) => {
    setActiveButton("");
  };

  return (
    <div className="flex justify-between p-5 items-center">
      <div className="grid grid-cols-3 bg-zinc-300 h-[7.5rem] w-[7.5rem] rounded-full overflow-hidden bg-opacity-60 ">
        <div className={gridClass}></div>
        <div
          className={buttonClass}
          onMouseDown={() => onMouseDown("up")}
          onMouseUp={() => onMouseUp("up")}
        >
          <Icons.up
            className={`${activeButton === "up" ? "text-black" : "text-white"}`}
          />
        </div>
        <div className={gridClass}></div>
        <div
          className={buttonClass}
          onMouseDown={() => onMouseDown("left")}
          onMouseUp={() => onMouseUp("left")}
        >
          <Icons.left
            className={`${
              activeButton === "left" ? "text-black" : "text-white"
            }`}
          />
        </div>
        <div className={gridClass}></div>
        <div
          className={buttonClass}
          onMouseDown={() => onMouseDown("right")}
          onMouseUp={() => onMouseUp("right")}
        >
          <Icons.right
            className={`${
              activeButton === "right" ? "text-black" : "text-white"
            }`}
          />
        </div>
        <div className={gridClass}></div>
        <div
          className={buttonClass}
          onMouseDown={() => onMouseDown("down")}
          onMouseUp={() => onMouseUp("down")}
        >
          <Icons.down
            className={`${
              activeButton === "down" ? "text-black" : "text-white"
            }`}
          />
        </div>
        <div className={gridClass}></div>
      </div>

      <div className="bg-zinc-300 rounded-sm overflow-hidden bg-opacity-60 p-5 h-[10rem]">
        <Slider
          defaultValue={[33]}
          max={100}
          step={1}
          orientation="vertical"
          className="h-full w-4"
        />
      </div>
    </div>
  );
}

export default PTZControl;
