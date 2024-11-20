import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

import SafeAreaCanvas from "./safearea-canvas";
import { useRef, useState } from "react";

function SafeAreaDialog({
  url,
  onClose,
}: {
  url?: string;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(true);
  const canvasRef = useRef(null);

  const handleGetAreaPosition = () => {
    if (canvasRef.current) {
      const areaPosition = canvasRef.current.getAreaPosition();
      console.log("Area Position: ", areaPosition);
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
            <Button onClick={handleGetAreaPosition}>Save</Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default SafeAreaDialog;
