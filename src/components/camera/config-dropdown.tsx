import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import ActivateDialog from "../stream/activate-dialog";
import { useNavigate } from "react-router-dom";
import { Separator } from "../ui/separator";
import Contents from "../contents";
import { Switch } from "../ui/switch";
import { useTranslation } from "react-i18next";
import { Stream } from "@/type";

const ConfigDropdown = ({
  stream,
  streamId,
}: {
  stream?: Stream;
  streamId: string;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <Icons.settings className="w-4 h-4 " />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <ActivateDialog isActivated={!!stream?.is_active} streamId={streamId} />

        <DropdownMenuItem
          onSelect={() => navigate("/streams/hazard-area/" + streamId)}
          disabled={!stream?.is_active}
        >
          <Icons.hazard className="w-4 h-4 text-zinc-800 mr-2 dark:text-white" />
          <div className="flex-1">{t("hazardArea.title")}</div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => navigate("/streams/patrol-area/" + streamId)}
          disabled={!stream?.is_active}
        >
          <Icons.patrol className="w-4 h-4 text-zinc-800 mr-2 dark:text-white" />
          <div className="flex-1">{t("patrolArea.title")}</div>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Contents field={t("monitoring.savingVideo")} value={<Switch />} />
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Contents field={t("monitoring.intrusion")} value={<Switch />} />
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Contents field={t("monitoring.inspect")} value={<Switch />} />
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Contents field={t("monitoring.alert")} value={<Switch />} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConfigDropdown;
