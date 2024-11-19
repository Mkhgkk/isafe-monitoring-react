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

function SafeAreaDialog({ url }: { url?: string }) {
  const [open, setOpen] = useState(false);
  const canvasRef = useRef();

  const handleGetAreaPosition = () => {
    if (canvasRef.current) {
      const areaPosition = canvasRef.current.getAreaPosition();
      console.log("Area Position: ", areaPosition);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="mt-4" variant="secondary">
          Safe area
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[90vw] min-h-[90vh] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="mb-4">Set safe area</DialogTitle>
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
