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

export default function ActivateDialog({
  isActivated,
  streamId,
}: {
  isActivated: boolean;
  streamId: string;
}) {
  return (
    <Dialog>
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
          <Button variant={isActivated ? "destructive" : "default"}>
            {isActivated ? "Deactivate" : "Activate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
