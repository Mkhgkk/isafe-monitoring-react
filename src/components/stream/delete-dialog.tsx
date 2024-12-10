import { useState } from "react";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { streamService } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const DeleteDialog = ({ stream_id }: { stream_id: string }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const handleOpen = (value: boolean) => {
    setOpen(value);
  };

  const { mutate: deleteStream, isPending } = useMutation({
    mutationFn: streamService.deleteStream,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["streamService.fetchStreams"],
      });
      setOpen(false);
      toast({
        description: t("stream.alert.deleteSuccess"),
        variant: "success",
      });
    },
    onError: (err) => {
      console.log("Error deleting stream: ", err);
      toast({
        description: t("stream.alert.deleteError"),
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteStream(stream_id);
  };
  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="text-destructive focus:text-destructive dark:text-red-500"
        >
          <Icons.delete className="w-4 h-4 text-destructive mr-2 dark:text-red-500" />
          {t("common.delete")}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>{t("common.confirm")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {t("stream.alert.deleteConfirm", { streamId: stream_id })}
        </DialogDescription>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            loading={isPending}
          >
            {t("common.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
