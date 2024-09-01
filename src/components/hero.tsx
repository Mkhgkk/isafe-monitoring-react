import React from "react";

export default function Hero() {
  return (
    <div className="flex border rounded-lg overflow-hidden">
      <div className="relative w-[40%] h-[300px]">
        <img src="/hero.png" />
      </div>
      <div className="flex flex-col justify-center p-6 w-[60%]">
        <h3 className="text-3xl font-extrabold">Highest Level of Protection</h3>
        <p className="text-muted-foreground mt-4">
          We protected of 3 million people with our fort pallas security system.
          We protected of 3 million people with our fort pallas security system.
        </p>
        <div className="flex gap-8 mt-6">
          <div className="flex items-center">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-3" />
            <p className="text-sm text-muted-foreground">Security blur blur</p>
          </div>

          <div className="flex items-center">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-3" />
            <p className="text-sm text-muted-foreground">
              Monitoring blur blur
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
