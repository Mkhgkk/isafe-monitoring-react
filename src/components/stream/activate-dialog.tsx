import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Icons } from "../icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { streamService } from "@/api";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

export default function ActivateDialog({
  isActivated,
  streamId,
}: {
  isActivated: boolean;
  streamId: string;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: startStream, isPending } = useMutation({
    mutationFn: streamService.startStream,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["streamService.fetchStreamById", streamId],
      });
      queryClient.invalidateQueries({
        queryKey: ["streamService.fetchStreams"],
      });

      setOpen(false);

      toast({
        description: "Stream has been started successfully",
        variant: "success",
      });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const { mutate: stopStream, isPending: isStopping } = useMutation({
    mutationFn: streamService.stopStream,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["streamService.fetchStreamById", streamId],
      });
      queryClient.invalidateQueries({
        queryKey: ["streamService.fetchStreams"],
      });

      setOpen(false);

      toast({
        description: "Stream has been stopped successfully",
        variant: "success",
      });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const onClick = () => {
    if (isActivated) {
      stopStream(streamId);
    } else startStream(streamId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Icons.power className="w-4 h-4 text-zinc-800 mr-2 dark:text-white" />
          {isActivated ? "Deactivate" : "Activate"}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isActivated ? "Deactivate" : "Activate"} stream
          </DialogTitle>
          <DialogDescription className="mt-4">
            {isActivated ? "Deactivate" : "Activate"} {streamId}?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant={isActivated ? "destructive" : "default"}
            onClick={onClick}
            loading={isPending || isStopping}
          >
            {isActivated ? "Deactivate" : "Activate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
