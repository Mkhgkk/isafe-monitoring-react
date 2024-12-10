import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card } from "./ui/card";

export default function Monitoring() {
  const [loading, setLoading] = useState(false);
  const [camera_id, setCameraId] = useState(1);
  const [model, setModel] = useState("PPE");
  // http://localhost:5000/feed?camera_id=2&model=PPE
  // "http://127.0.0.1:5000/video_feed/6?model=Scaffolding"
  const [link, setLink] = useState(
    `http://${document.domain}:5000/feed?camera_id=2&model=PPE`
  );

  const [url, setURL] = useState("");
  // const updateLink = () => {
  //   setLink(`http://127.0.0.1:5000/video_feed/6?model=${model}`)
  // }

  useEffect(() => {
    console.log("This code should run only once!");
    const socket = io(`http://${document.domain}:5000/video`);

    socket.on("connect", function () {
      console.log("WebSocket connected");
    });

    socket.on("frame", function (data) {
      console.log("Frame received!");
      const img = document.getElementById("video-stream");

      // Create a Blob from the binary data
      const blob = new Blob([new Uint8Array(data.image)], {
        type: "image/jpeg",
      });
      const url_ = URL.createObjectURL(blob);
      setURL(url_);

      // Clean up old URLs to avoid memory leaks
      // img.onload = function() {
      //     URL.revokeObjectURL(url);
      // };
    });

    socket.on("disconnect", function () {
      console.log("WebSocket disconnected");
    });

    socket.on("error", function (err) {
      console.error("Socket error:", err);
    });
  }, []);

  const handleClick = () => {
    // setLoading(true)
    setLink(`http://localhost:5000/feed?camera_id=${camera_id}&model=${model}`);
  };

  return (
    <div className="flex gap-4">
      <Card className="p-4 w-[100%]">
        <h1 className="text-xl font-semibold">Monitoring</h1>
        <div className="flex items-center mt-1">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2" />
          <p className="text-sm text-muted-foreground">Construction site 4</p>
        </div>
        <div className="pt-4">
          <div className="rounded-lg overflow-hidden relative">
            {/* <div className="absolute py-1 px-3 bg-slate-700 bg-opacity-60 rounded-2xl flex items-center mt-2 ml-2">
              <span className="flex h-2 w-2 rounded-full bg-red-600 mr-1.5" />
              <p className="text-xs">Live</p>
            </div> */}
            <div className="absolute right-0 py-1 px-3 bg-slate-700 bg-opacity-60 rounded-2xl flex items-center mt-2 mr-2">
              <span className="flex h-2 w-2 rounded-full bg-red-600 mr-1.5" />
              <p className="text-xs">Live</p>
            </div>

            {/* <video width="100%" autoPlay loop muted>
              <source src="/main.mp4" type="video/mp4" />
              <track
                src="/path/to/captions.vtt"
                kind="subtitles"
                srcLang="en"
                label="English"
              />
              Your browser does not support the video tag.
            </video> */}
            {loading && (
              <Card
                style={{
                  width: "100%",
                  height: "80vh",
                  backgroundColor: "#f0f0f0",
                  position: "relative",
                  // top: 0,
                  // left: 0,
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* You can add a loading spinner or text here */}
                <span>Loading...</span>
              </Card>
            )}
            <img
              style={{ width: "100%" }}
              // src="http://127.0.0.1:5000/video_feed/6?model=Scaffolding"
              src={url}
              onLoad={() => URL.revokeObjectURL(url)}
              alt="Camera Stream"
            />
            {/* <img
              src="http://127.0.0.1:5000/video_feed/6?model=Scaffolding"
              alt="Camera Stream"
              style={{
                display: "block",
                WebkitUserSelect: "none",
                margin: "auto",
                backgroundColor: "hsl(0, 0%, 25%)",
              }}
              width="1920"
              height="1080"
            /> */}
          </div>
          {/* <div className="mt-5">
            <h1 className="text-md font-semibold">Suspicious activities</h1>
            <ScrollArea className="mt-2">
              <div className="flex gap-4">
                {["/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg", "/5.jpg"].map(
                  (item) => (
                    <div>
                      <div className="relative h-[100px] w-[150px] rounded-sm overflow-hidden">
                        <Image src={item} fill objectFit="cover" />
                      </div>
                      <p className="text-xs mt-1 ">30 mins ago</p>
                    </div>
                  )
                )}
              </div>
            </ScrollArea>
          </div> */}

          <div className="flex gap-4 mt-4">
            <Select onValueChange={setCameraId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a camera" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Cameras</SelectLabel>
                  <SelectItem value="1">camera 1</SelectItem>
                  <SelectItem value="2">camera 2</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select onValueChange={setModel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Models</SelectLabel>
                  <SelectItem value="PPE">PPE</SelectItem>
                  <SelectItem value="Scaffolding">scaffolding</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button variant={"outline"} onClick={handleClick}>
              Monitor
            </Button>
          </div>
        </div>
      </Card>
      {/* <Card className="flex-1 w-[30%] p-4 ">
        <h1 className="text-xl font-semibold">Other monitors</h1>
        <div className="flex items-center mb-4 mt-1">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2" />
          <p className="text-sm text-muted-foreground">5 active monitors</p>
        </div>
        <div className="flex flex-col gap-2">
          {[0, 1].map((item) => (
            <button
              key={item}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent"
              )}
            >
              <div className="flex gap-4">
                <div className="rounded-sm overflow-hidden w-[80%]">
                  <video width="100%" autoPlay loop muted>
                    <source src="/main.mp4" type="video/mp4" />
                    <track
                      src="/path/to/captions.vtt"
                      kind="subtitles"
                      srcLang="en"
                      label="English"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>

                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{`Monitor ${
                        item + 1
                      }`}</div>
                      <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Your browser does not support the video tag.
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card> */}
    </div>
  );
}
