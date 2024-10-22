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

const DeleteDialog = ({ id, stream_id }: { id: string; stream_id: string }) => {
  const [open, setOpen] = useState(false);
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
        description: "Stream has been deleted successfully",
        variant: "success",
      });
    },
    onError: (err) => {
      console.log("Error deleting stream: ", err);
      toast({
        description: "Failed to delete stream",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteStream(id);
  };
  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="text-destructive focus:text-destructive dark:text-red-500"
        >
          <Icons.delete className="w-4 h-4 text-destructive mr-2 dark:text-red-500" />
          Delete
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Confirm</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {`Are you sure you want to delete ${stream_id}?`}
        </DialogDescription>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            loading={isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
