import React, { useState, useEffect } from "react";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import { Slider } from "./ui/slider";
import socket from "../services/socketService";

interface PTZControlProps {
  streamId: string;
}

function PTZControl({streamId}: PTZControlProps) {
  const gridClass = "h-10 w-10 flex justify-center items-center";
  const buttonClass = cn(gridClass, "cursor-pointer");

  const [activeButton, setActiveButton] = useState("");
  const [sliderValue, setSliderValue] = useState(0)

  const onMouseDown = (btn) => {
    setActiveButton(btn);
  };

  const onMouseUp = (btn) => {
    setActiveButton("");
  };

  useEffect(() => {
    console.log("PTZ component mounted atleast")
    socket.emit("join_ptz", { stream_id: streamId });

    socket.on("zoom-level", (data) => {
        console.log("Zoooooooooooooooooom data: ", data)
        const current_zoom = data["zoom"]
        const value = parseFloat(current_zoom.toFixed(2));
        setSliderValue(value)
    })

    return () => {
      console.log("Leaving ptz room");
      socket.off("zoom-level")
      socket.emit("leave_ptz", { stream_id: streamId });
    }
  }, [streamId])

  const handleChangeZoom = (value) => {
    console.log("Zoooooooooooooom change: ", sliderValue)
    socket.emit("ptz_move", {stream_id: streamId, direction: 'zoom_in', zoom_amount: sliderValue})
  }

  const handleSetSliderValue = (value) => {
    setSliderValue(value[0])
  }


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
          // defaultValue={[0.33]}
          value={[sliderValue]}
          onValueChange={handleSetSliderValue}
          onValueCommit={handleChangeZoom}
          max={1.0}
          step={0.01}
          orientation="vertical"
          className="h-full w-4"
        />
      </div>
    </div>
  );
}

export default PTZControl;
