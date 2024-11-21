import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

import SafeAreaCanvas from "./safearea-canvas";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { configService } from "@/api";
import { toast } from "@/hooks/use-toast";

function SafeAreaDialog({
  url,
  onClose,
  streamId,
}: {
  url?: string;
  onClose: () => void;
  streamId: string;
}) {
  const [open, setOpen] = useState(true);
  const canvasRef = useRef(null);
  const { mutate: setDangerZone, isPending } = useMutation({
    mutationFn: configService.setDangerZone,
    onSuccess: () => {
      onClose();
      toast({
        description: "Danger zone has been set successfully",
        variant: "success",
      });
    },

    onError: (err) => {
      toast({
        description: "Failed to set danger zone",
        variant: "destructive",
      });
    },
  });

  const handleGetAreaPosition = () => {
    if (canvasRef.current) {
      const areaPosition = canvasRef.current.getAreaPosition();
      console.log("Area Position: ", areaPosition);
      console.log("url", url);

      if (!url || !areaPosition) return;
      setDangerZone({
        image: url,
        coords: [
          areaPosition.topLeft,
          areaPosition.topRight,
          areaPosition.bottomRight,
          areaPosition.bottomLeft,
        ],
        streamId,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
        setOpen(value);
      }}
    >
      {/* <DialogTrigger>
        <Button className="mt-4" variant="secondary">
          Safe area
        </Button>
      </DialogTrigger> */}
      <DialogContent className="w-[90vw] max-w-[90vw] min-h-[90vh] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="mb-4">Set hazard area</DialogTitle>
          <SafeAreaCanvas url={url} ref={canvasRef} />
          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={handleGetAreaPosition} loading={isPending}>
              Save
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default SafeAreaDialog;
