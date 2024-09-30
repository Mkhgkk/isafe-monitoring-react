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
import { useAppwrite } from "@/context/AppwriteContext";

const DeleteDialog = ({ $id, stream_id }: { id: string; name: string }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = (value: boolean) => {
    setOpen(value);
  };

  const { databases } = useAppwrite();

  const handleDelete = async () => {
    try {
      const result = await databases.deleteDocument(
        "isafe-guard-db",
        "66f504260003d64837e5",
        $id
      );

      console.log(result);

      setOpen(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="text-destructive focus:text-destructive"
        >
          <Icons.delete className="w-4 h-4 text-destructive mr-2" />
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
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
