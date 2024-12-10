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
import { useTranslation } from "react-i18next";

export default function ActivateDialog({
  isActivated,
  streamId,
}: {
  isActivated: boolean;
  streamId: string;
}) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
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
        description: t("activateStream.alert.successActivate"),
        variant: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      toast({
        description: t("activateStream.alert.errorActivate"),
        variant: "destructive",
      });
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
        description: t("activateStream.alert.successDeactivate"),
        variant: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      toast({
        description: t("activateStream.alert.errorDeactivate"),
        variant: "destructive",
      });
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
          {isActivated
            ? t("activateStream.deactivate")
            : t("activateStream.activate")}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isActivated
              ? t("activateStream.deactivateStream")
              : t("activateStream.activateStream")}
          </DialogTitle>
          <DialogDescription className="mt-4">
            {isActivated
              ? t("activateStream.alert.confirmDeactivate", { streamId })
              : t("activateStream.alert.confirmActivate", { streamId })}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant={isActivated ? "destructive" : "default"}
            onClick={onClick}
            loading={isPending || isStopping}
          >
            {isActivated
              ? t("activateStream.deactivate")
              : t("activateStream.activate")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
