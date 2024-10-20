import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import React, { useEffect, useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Icons } from "../icons";
import { Skeleton } from "../ui/skeleton";
import PanelVideo from "../panel-video";
import PTZControl from "../ptz-control";
import { Button } from "../ui/button";

function AutoTrackDialog({
  url,
  streamId,
  name,
}: {
  url: string;
  streamId: string;
  name: string;
}) {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Icons.autoTrack className="w-4 h-4 text-zinc-800 mr-2 dark:text-white" />
          Autotrack
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="lg:max-w-[60vw]">
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>
            Configure home position for the camera
          </DialogDescription>
          {open && (
            <div className="pt-4">
              {loading ? (
                <Skeleton className="rounded-md w-full lg:max-w-5xl mb-5 aspect-[16/9]" />
              ) : (
                <div className="overflow-hidden rounded-md w-full lg:max-w-5xl mb-5 relative aspect-[16/9]">
                  <PanelVideo streamId={streamId} config />
                  <div className="absolute left-0 top-0 right-0 bottom-0 flex flex-col justify-center">
                    <PTZControl streamId={streamId} />
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogHeader>
        <DialogFooter>
          <Button>Configure</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AutoTrackDialog;
