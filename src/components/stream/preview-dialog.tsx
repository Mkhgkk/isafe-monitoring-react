import { useEffect, useState } from "react";
import { Icons } from "../icons";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import video1 from "@/assets/1.mp4";

const PreviewDialog = ({
  url,
  streamId,
  name,
}: {
  url: string;
  streamId: string;
  name: string;
}) => {
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
          <Icons.preview className="w-4 h-4 text-zinc-800 mr-2 dark:text-white" />
          Preview
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="lg:max-w-[60vw]">
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
          {open && (
            <div className="pt-4">
              {loading ? (
                <Skeleton className="rounded-md w-full lg:max-w-5xl mb-5 aspect-[16/9]" />
              ) : (
                <div className="overflow-hidden rounded-md w-full lg:max-w-5xl mb-5">
                  <video
                    src={video1}
                    controls={true}
                    autoPlay
                    muted
                    loop
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
