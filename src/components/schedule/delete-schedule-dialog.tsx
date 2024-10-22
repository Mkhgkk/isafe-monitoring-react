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
import { ScheduleDocument } from "@/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleService } from "@/api";
import { useToast } from "@/hooks/use-toast";

const DeleteScheduleDialog = ({ schedule }: { schedule: ScheduleDocument }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const handleOpen = (value: boolean) => {
    setOpen(value);
  };
  const { mutate: deleteSchedule, isPending } = useMutation({
    mutationFn: scheduleService.deleteSchedule,
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["scheduleService.fetchAllSchedules"],
      });
      toast({
        description: "Schedule has been deleted successfully",
        variant: "success",
      });
    },
    onError: (err) => {
      console.log("Error deleting schedule: ", err);
      toast({
        description: "Failed to delete schedule",
        variant: "destructive",
      });
    },
  });

  const handleDelete = async () => {
    deleteSchedule(schedule);
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
          Are you sure you want to delete this schedule?
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

export default DeleteScheduleDialog;
